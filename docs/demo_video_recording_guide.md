# NeerWatch — Demo Video Screen Recording Guide
**120-Second Pitch & Working Prototype Walkthrough**

This guide provides the exact second-by-second storyboard, on-screen actions, and word-for-word voiceover script for your Unstop video submission.

---

## 🎬 Quick Setup: How to Record in 10 Seconds

Since the local backend is actively running at `http://localhost:8000`:
1. Open Google Chrome or Microsoft Edge and navigate to **`http://localhost:8000`**.
2. Press **`F11`** to enter full-screen mode for a clean presentation look.
3. Start recording:
   - **Windows Game Bar**: Press **`Win + Alt + R`** (or **`Win + G`** ➔ Record).
   - **Windows Snipping Tool**: Press **`Win + Shift + S`** (select video recorder icon).
   - **OBS Studio / Loom**: Select your browser window.

---

## ⏱️ Second-by-Second Storyboard & Voiceover Script

### [00:00 – 00:15] Hook & Hero Introduction
- **On-Screen Action**:
  - Show the top of the dashboard at `http://localhost:8000`.
  - Slowly hover over the hero section; point cursor at the live status chip (`● Connected to NeerWatch Engine`) and the Northeast India title.
- **Voiceover Narration**:
  > *"Every monsoon, communities across Northeast India face devastating waterborne epidemics like cholera and diarrhea. Welcome to NeerWatch — an AI-powered surveillance platform designed to predict contamination before outbreaks occur, built with an Apple-inspired liquid glass interface."*

---

### [00:15 – 00:35] Regional Overview & Interactive Cartography
- **On-Screen Action**:
  - Scroll smoothly down to the interactive **Regional Map**.
  - Show how smooth and responsive the 60fps scrolling is.
  - Click on the State filter dropdown (`stateSelect`) and select **"Assam"**, then switch to **"All States"**.
  - Click on a **Red (Critical/High)** pin on the map (e.g. `LOC_001` - Brahmaputra Basin).
- **Voiceover Narration**:
  > *"NeerWatch aggregates 44 active monitoring stations across all eight Northeastern states. Our interactive Leaflet cartography maps risk levels in real time. Notice the fluid, responsive interaction — we can filter by state or click any station marker to instantly surface its telemetry."*

---

### [00:35 – 00:55] Explainable AI: XGBoost & SHAP Risk Drivers
- **On-Screen Action**:
  - Pan to the right-hand **Station Detail Card**.
  - Highlight the **Priority Score**, **Exceedance Probability**, and **Reliability Metrics**.
  - Hover over the **Top Risk Drivers (SHAP Explanations)** section, pointing to positive contributors like *Total Coliform Spike* and *High Turbidity*.
- **Voiceover Narration**:
  > *"Unlike black-box models, NeerWatch pairs XGBoost risk prediction with SHAP explainability. Here, for Location 001, we don't just see a High Risk score — our SHAP engine reveals the exact mathematical drivers: a massive spike in Total Coliform and severe turbidity exceedance following recent rainfall."*

---

### [00:55 – 01:15] Epidemiological Trends & Physical Verification Loop
- **On-Screen Action**:
  - Scroll down to the **Disease Trends** chart (showing historical Diarrhea and Cholera correlations).
  - Click the **"Log Field Verification"** button to open the verification drawer.
  - Fill in a quick test status (e.g., *Field Sample Collected*, *Action Recommended*) and show the clean form.
- **Voiceover Narration**:
  > *"NeerWatch cross-references water contamination with historical epidemiological curves to model outbreak likelihood. Front-line health workers can open the verification drawer directly in the browser, log on-site rapid test kit findings, and submit ground-truth updates that feed back into our model."*

---

### [01:15 – 01:40] On-the-Fly Dataset Analysis & Performance
- **On-Screen Action**:
  - Scroll to the **Custom Dataset Analysis** zone (`mlZoneSelect`).
  - Demonstrate clicking the zone selector or hovering over the upload CSV trigger.
  - Pan back to the summary metrics at the top with a smooth scroll, showing the frosted glass cards with zero lag.
- **Voiceover Narration**:
  > *"Districts can also analyze new sensor readings on the fly. Best of all, the entire platform runs with zero external backend dependencies using native Node.js, and our frontend is GPU-composited for silky smooth performance even on low-power field laptops."*

---

### [01:40 – 02:00] Conclusion & Impact
- **On-Screen Action**:
  - Return to the clean hero view at the top of the page.
  - Highlight the project branding and summary cards.
- **Voiceover Narration**:
  > *"By turning weeks of diagnostic delay into immediate preventative action, NeerWatch empowers the Jal Jeevan Mission and protects vulnerable communities across Northeast India. Thank you for watching!"*

---

## 💡 Pro Tips for Maximum Score on Unstop
1. **Audio Clarity**: Speak at a steady, confident pace. Use an external mic or headphones if possible.
2. **Video Resolution**: Record at 1080p (1920x1080) at 60fps or 30fps.
3. **Cursor Smoothness**: Move the mouse deliberately from section to section without erratic wiggles.
4. **File Format**: Save the video as an **`.mp4`** or upload to **YouTube (Unlisted)** or **Google Drive (Anyone with link can view)** and submit the link directly on Unstop.
