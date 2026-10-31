import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const PORT = 8089;
const BASE_URL = `http://127.0.0.1:${PORT}`;
let serverProcess = null;
let verificationBackup = null;
const verificationFilePath = resolve('backend/data/verification.json');

const results = [];

function pass(name, details = '') {
  results.push({ name, passed: true, details });
  console.log(`  \x1b[32m✔ PASS\x1b[0m: ${name} ${details ? `(${details})` : ''}`);
}

function fail(name, error) {
  results.push({ name, passed: false, error: String(error) });
  console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${name} -> ${error}`);
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, options);
  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  return { status: response.status, headers: response.headers, data };
}

async function startServer() {
  console.log(`\n--- Starting NeerWatch Test Server on port ${PORT} ---`);
  // Backup verification.json
  try {
    verificationBackup = await readFile(verificationFilePath, 'utf8');
  } catch (e) {
    verificationBackup = '{}';
  }

  return new Promise((resolvePromise, rejectPromise) => {
    serverProcess = spawn('node', ['backend/server.mjs'], {
      env: { ...process.env, PORT: String(PORT) },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let started = false;
    serverProcess.stdout.on('data', chunk => {
      const msg = chunk.toString();
      if (msg.includes('NeerWatch API listening') && !started) {
        started = true;
        resolvePromise();
      }
    });

    serverProcess.stderr.on('data', chunk => {
      console.error(`[Server Stderr]`, chunk.toString());
    });

    serverProcess.on('error', err => {
      rejectPromise(err);
    });

    setTimeout(() => {
      if (!started) rejectPromise(new Error('Server start timed out after 5s'));
    }, 5000);
  });
}

async function stopServer() {
  console.log(`\n--- Stopping Server and Restoring Data ---`);
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  if (verificationBackup) {
    await writeFile(verificationFilePath, verificationBackup, 'utf8');
  }
}

async function runTests() {
  try {
    await startServer();
    console.log(`\n--- Running End-to-End Test Suite ---`);

    // 1. Health check
    try {
      const res = await request('/health');
      if (res.status === 200 && res.data.status === 'ok' && res.data.locations_loaded === 244) {
        pass('Server Health Check (/health)', `status: ${res.data.status}, locations: ${res.data.locations_loaded}`);
      } else {
        fail('Server Health Check (/health)', `Unexpected response: ${JSON.stringify(res.data)}`);
      }
    } catch (e) {
      fail('Server Health Check (/health)', e.message);
    }

    // 2. Dashboard UI Serving
    try {
      const res = await request('/');
      if (res.status === 200 && typeof res.data === 'string' && res.data.includes('NeerWatch') && res.data.includes('maplibre')) {
        pass('Dashboard UI HTML Serving (/)', `HTML length: ${res.data.length} bytes`);
      } else {
        fail('Dashboard UI HTML Serving (/)', `Unexpected response status ${res.status}`);
      }
    } catch (e) {
      fail('Dashboard UI HTML Serving (/)', e.message);
    }

    // 3. /dashboard alias
    try {
      const res = await request('/dashboard');
      if (res.status === 200 && typeof res.data === 'string' && res.data.includes('NeerWatch')) {
        pass('Dashboard Alias (/dashboard)', 'Serves HTML successfully');
      } else {
        fail('Dashboard Alias (/dashboard)', `Unexpected response status ${res.status}`);
      }
    } catch (e) {
      fail('Dashboard Alias (/dashboard)', e.message);
    }

    // 4. API Directory (/api/v1)
    try {
      const res = await request('/api/v1');
      if (res.status === 200 && Array.isArray(res.data.endpoints) && res.data.endpoints.length >= 5) {
        pass('API Documentation Endpoint (/api/v1)', `Declared endpoints: ${res.data.endpoints.length}`);
      } else {
        fail('API Documentation Endpoint (/api/v1)', `Unexpected structure`);
      }
    } catch (e) {
      fail('API Documentation Endpoint (/api/v1)', e.message);
    }

    // 5. Locations Catalog (/api/v1/locations)
    try {
      const res = await request('/api/v1/locations');
      if (res.status === 200 && res.data.total === 244 && Array.isArray(res.data.locations) && res.data.locations.length === 244) {
        pass('Locations Catalog (/api/v1/locations)', `Total locations: ${res.data.total}`);
      } else {
        fail('Locations Catalog (/api/v1/locations)', `Total mismatch: ${res.data.total}`);
      }
    } catch (e) {
      fail('Locations Catalog (/api/v1/locations)', e.message);
    }

    // 6. Locations Filtering by State (/api/v1/locations?state=Assam)
    try {
      const res = await request('/api/v1/locations?state=Assam');
      const allAssam = res.data.locations.every(l => l.state === 'Assam');
      if (res.status === 200 && allAssam && res.data.total > 0) {
        pass('Locations State Filter (/api/v1/locations?state=Assam)', `Found ${res.data.total} stations in Assam`);
      } else {
        fail('Locations State Filter (/api/v1/locations?state=Assam)', `Mismatch in state filtering`);
      }
    } catch (e) {
      fail('Locations State Filter (/api/v1/locations?state=Assam)', e.message);
    }

    // 7. Locations Invalid State (400)
    try {
      const res = await request('/api/v1/locations?state=InvalidStateXYZ');
      if (res.status === 400 && res.data.error && res.data.error.code === 'INVALID_STATE') {
        pass('Locations Invalid State Error Handling', `Returned 400 with code INVALID_STATE`);
      } else {
        fail('Locations Invalid State Error Handling', `Expected 400, got ${res.status}`);
      }
    } catch (e) {
      fail('Locations Invalid State Error Handling', e.message);
    }

    // 8. Risk Overview (/api/v1/risk)
    try {
      const res = await request('/api/v1/risk');
      const validLocations = res.data.locations.filter(l => l.risk_level && l.priority_level);
      if (res.status === 200 && res.data.total === 244 && validLocations.length >= 200) {
        pass('Risk Overview (/api/v1/risk)', `Total: ${res.data.total}, ML Scored: ${validLocations.length}`);
      } else {
        fail('Risk Overview (/api/v1/risk)', `Mismatch in risk data`);
      }
    } catch (e) {
      fail('Risk Overview (/api/v1/risk)', e.message);
    }

    // 9. Risk Detail with SHAP Contributors (/api/v1/risk/LOC_001)
    try {
      const res = await request('/api/v1/risk/LOC_001');
      const hasDrivers = Array.isArray(res.data.top_risk_drivers) && res.data.top_risk_drivers.length > 0;
      const hasRisk = res.data.risk && typeof res.data.risk.probability === 'number';
      const hasPriority = res.data.priority && typeof res.data.priority.score === 'number';
      if (res.status === 200 && hasDrivers && hasRisk && hasPriority) {
        pass('Risk Detail + SHAP Drivers (/api/v1/risk/LOC_001)', `Drivers: ${res.data.top_risk_drivers.join(', ')}`);
      } else {
        fail('Risk Detail + SHAP Drivers (/api/v1/risk/LOC_001)', `Missing drivers or metrics: ${JSON.stringify(res.data)}`);
      }
    } catch (e) {
      fail('Risk Detail + SHAP Drivers (/api/v1/risk/LOC_001)', e.message);
    }

    // 10. Nonexistent Risk Detail (404)
    try {
      const res = await request('/api/v1/risk/LOC_NONEXISTENT');
      if (res.status === 404 && res.data.error && res.data.error.code === 'LOCATION_NOT_FOUND') {
        pass('Nonexistent Location Risk Detail Handling (404)', 'Returns 404 LOCATION_NOT_FOUND');
      } else {
        fail('Nonexistent Location Risk Detail Handling (404)', `Expected 404, got ${res.status}`);
      }
    } catch (e) {
      fail('Nonexistent Location Risk Detail Handling (404)', e.message);
    }

    // 11. Observation History (/api/v1/locations/LOC_001/history)
    try {
      const res = await request('/api/v1/locations/LOC_001/history');
      if (res.status === 200 && Array.isArray(res.data.history) && res.data.history.length > 0) {
        pass('Location History (/api/v1/locations/LOC_001/history)', `Historical records: ${res.data.history.length}`);
      } else {
        fail('Location History (/api/v1/locations/LOC_001/history)', `Expected history records, got ${JSON.stringify(res.data)}`);
      }
    } catch (e) {
      fail('Location History (/api/v1/locations/LOC_001/history)', e.message);
    }

    // 12. Nonexistent History (404)
    try {
      const res = await request('/api/v1/locations/LOC_NONEXISTENT/history');
      if (res.status === 404 && res.data.error && res.data.error.code === 'LOCATION_NOT_FOUND') {
        pass('Nonexistent Location History Handling (404)', 'Returns 404 LOCATION_NOT_FOUND');
      } else {
        fail('Nonexistent Location History Handling (404)', `Expected 404, got ${res.status}`);
      }
    } catch (e) {
      fail('Nonexistent Location History Handling (404)', e.message);
    }

    // 13. Field Verification Submission (POST /api/v1/locations/LOC_002/verification)
    try {
      const payload = {
        verification_status: 'IN_PROGRESS',
        recommended_verification_priority: 'HIGH',
        reason_for_priority: 'Automated Test Verification Run',
        verification_date: '2026-10-29',
        actual_field_result: {
          ph: 7.2,
          turbidity: 3.5,
          fecal_coliform: 15
        }
      };
      const res = await request('/api/v1/locations/LOC_002/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.status === 201 && res.data.verification_id && res.data.verification_status === 'IN_PROGRESS') {
        // Read back via risk detail
        const checkRes = await request('/api/v1/risk/LOC_002');
        if (checkRes.data.verification.verification_status === 'IN_PROGRESS') {
          pass('Field Verification Submission & Roundtrip Persist', `ID: ${res.data.verification_id}`);
        } else {
          fail('Field Verification Submission & Roundtrip Persist', 'Saved, but not reflected in risk detail verification');
        }
      } else {
        fail('Field Verification Submission & Roundtrip Persist', `Expected 201, got ${res.status}: ${JSON.stringify(res.data)}`);
      }
    } catch (e) {
      fail('Field Verification Submission & Roundtrip Persist', e.message);
    }

    // 14. Verification Validation Failure (Invalid status)
    try {
      const badPayload = { verification_status: 'INVALID_STATUS' };
      const res = await request('/api/v1/locations/LOC_002/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(badPayload)
      });
      if (res.status === 400 && res.data.error && res.data.error.code === 'INVALID_VERIFICATION') {
        pass('Field Verification Payload Validation', 'Rejected invalid verification_status with 400');
      } else {
        fail('Field Verification Payload Validation', `Expected 400, got ${res.status}`);
      }
    } catch (e) {
      fail('Field Verification Payload Validation', e.message);
    }

    // 15-18. Dataset Upload, Validate, Analyze & Status Flow
    try {
      const sampleCsv = `location_id,state,date,ph,turbidity,fecal_coliform\nLOC_001,Assam,2026-10-28,7.4,2.8,12\nLOC_002,Meghalaya,2026-10-28,6.8,5.1,45\n`;
      // Upload
      const upRes = await request('/api/v1/dataset/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: sampleCsv
      });
      if (upRes.status !== 202) throw new Error(`Upload returned status ${upRes.status}`);

      // Validate
      const valRes = await request('/api/v1/dataset/validate', { method: 'POST' });
      if (valRes.status !== 200 || valRes.data.status !== 'READY_FOR_ANALYSIS') {
        throw new Error(`Validate failed: ${JSON.stringify(valRes.data)}`);
      }

      // Analyze
      const anRes = await request('/api/v1/dataset/analyze', { method: 'POST' });
      if (anRes.status !== 202 && anRes.status !== 409) throw new Error(`Analyze returned status ${anRes.status}`);

      // Status Check
      const statRes = await request('/api/v1/dataset/status');
      if (statRes.status === 200 && ['ANALYSIS_RUNNING', 'ANALYSIS_COMPLETE', 'INFERENCE_UNAVAILABLE'].includes(statRes.data.status)) {
        pass('CSV Dataset Upload, Validation & Analysis Flow', `Status: ${statRes.data.status}`);
      } else {
        fail('CSV Dataset Upload, Validation & Analysis Flow', `Unexpected status: ${JSON.stringify(statRes.data)}`);
      }
    } catch (e) {
      fail('CSV Dataset Upload, Validation & Analysis Flow', e.message);
    }

    // 19. CORS Preflight Support
    try {
      const res = await request('/api/v1/risk', { method: 'OPTIONS' });
      const allowOrigin = res.headers.get('access-control-allow-origin');
      if (res.status === 204 && allowOrigin === '*') {
        pass('CORS Preflight Headers (OPTIONS /api/v1/risk)', `Access-Control-Allow-Origin: ${allowOrigin}`);
      } else {
        fail('CORS Preflight Headers (OPTIONS /api/v1/risk)', `Expected 204 and CORS headers, got status ${res.status}`);
      }
    } catch (e) {
      fail('CORS Preflight Headers (OPTIONS /api/v1/risk)', e.message);
    }

    // 20. 404 Route Not Found
    try {
      const res = await request('/api/v1/unknown_endpoint');
      if (res.status === 404 && res.data.error && res.data.error.code === 'ROUTE_NOT_FOUND') {
        pass('Unknown Endpoint 404 Handling', 'Returns 404 ROUTE_NOT_FOUND');
      } else {
        fail('Unknown Endpoint 404 Handling', `Expected 404, got ${res.status}`);
      }
    } catch (e) {
      fail('Unknown Endpoint 404 Handling', e.message);
    }

    // 21. Geospatial & Data Integrity Check
    try {
      const locData = JSON.parse(await readFile('backend/data/locations.json', 'utf8'));
      let coordErrors = 0;
      for (const loc of locData.locations) {
        // Northeast India rough bounds: Lat 21.5 - 29.5 N, Lon 88.0 - 97.5 E
        if (loc.latitude < 21.0 || loc.latitude > 30.0 || loc.longitude < 88.0 || loc.longitude > 98.0) {
          coordErrors++;
        }
      }
      if (coordErrors === 0) {
        pass('Geospatial Coordinate Integrity (Northeast Bounds)', `All ${locData.locations.length} stations bounded within NE India`);
      } else {
        fail('Geospatial Coordinate Integrity (Northeast Bounds)', `${coordErrors} stations outside expected lat/lon bounds`);
      }
    } catch (e) {
      fail('Geospatial Coordinate Integrity (Northeast Bounds)', e.message);
    }

    // Summary
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;
    console.log(`\n========================================`);
    console.log(`TEST SUITE RESULTS: ${passed}/${total} PASSED (${failed} failed)`);
    console.log(`========================================\n`);

  } finally {
    await stopServer();
  }
}

runTests();


