# NeerWatch

NeerWatch is a water evidence and prototype risk dashboard for Northeast India. The interface combines published historical water observations, a field verification workflow, and a separate ML Model Studio.

## Model data notice

The repository contains saved prediction and SHAP CSV outputs dated August 2024. It does **not** contain executable XGBoost weights or live sensor feeds, so the current app cannot run new predictions on uploaded data. The risk values are synthetic demonstration outputs and are not current water safety findings. Verify current conditions with field and laboratory testing.

## Run locally

Requirements: Node.js 18 or newer. There are no third-party npm dependencies.

```sh
npm start
```

Then open [http://localhost:8000](http://localhost:8000). The model inspection page is at [http://localhost:8000/model-studio](http://localhost:8000/model-studio). Set `PORT` to use another port. Local mode allows field verification records to be written to `backend/data/verification.json`.

## Pages and API

- Home: published evidence workspace, field test flow, and CSV schema validation.
- About: the project story, evidence workflow, model-output explanation, limitations, and walkthrough for judges.
- ML Model Studio: saved zone estimates, SHAP explanations, model flow, and snapshot integrity check.
- `GET /health`: deployment and data status.
- `GET /api/v1/locations` and `GET /api/v1/risk`: location and saved risk records.
- `GET /api/v1/risk/{location_id}` and `GET /api/v1/locations/{location_id}/history`: zone details and historical observations.
- `GET /api/v1/model/check`: checks saved prediction and SHAP record integrity; it does not run inference.
- `POST /api/v1/locations/{location_id}/verification`: saves a field verification record in local mode.

## Deployment

This repository includes a Render Blueprint (`render.yaml`) and a Dockerfile. The Render configuration deploys a **read-only public demo**: `NEERWATCH_READ_ONLY=true` blocks public field record writes and dataset uploads. To enable writes, deploy behind an authentication layer and use persistent storage for `backend/data/verification.json`; do not expose the unauthenticated local write API directly to the public internet.

For Render, push this project to a Git provider connected to your Render account, then create a new Blueprint instance from `render.yaml`. The Docker image can be built with `docker build -t neerwatch .` and run with `docker run --rm -p 8000:10000 neerwatch`.

The project also contains the presentation decks, demo video, source notes, and a synthetic CSV fixture used for schema checks.
