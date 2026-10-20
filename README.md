> [!IMPORTANT]
> ## 📁 Submission Documents & Templates
> **All required submission templates are in the Google Drive folder below. Download them before you start.**
>
> ### 👉 [**OPEN THE GOOGLE DRIVE FOLDER**](https://drive.google.com/drive/folders/1xw7c2aN8N-at8hPEULzkcU76e_FFb0Ef) 👈

---

# AI Career Navigator

> Your Skills. Your Future. Your Choice. A career exploration experience that helps people understand their capabilities, examine AI's impact on specific tasks, and test practical development paths.

**Current stage:** Interactive Prototype V0.1. This repository contains a local, scripted demo; it does not yet provide live AI analysis, a deployed app, or completed hackathon submission evidence. See the [founding manifesto](docs/FOUNDING_MANIFESTO.md) for the product principles.

---

## Team Information

| Field                  | Details                                     |
| ---------------------- | ------------------------------------------- |
| **Team Name**          | Nexus                                       |
| **Team Domain**        | To be confirmed by the team (Domain 1 or 2) |
| **SDG Track (1–17)**   | To be confirmed; the manifesto discusses SDG 4, 8 and 10 |
| **Team Leader**        | XIE YIFENG                                 |
| **University**         | Xiamen University Malaysia                 |
| **Number of Members**  | 5                                          |

## Links

| Resource          | Link                                           |
| ----------------- | ---------------------------------------------- |
| GitHub Repository | https://github.com/xieyifeng24/AI-Career-Navigator |
| Replit Project    | Not created yet                                |
| Live Demo         | Not deployed yet; [run the local prototype](prototype/README.md) |
| RunPod Endpoint   | Not configured yet                             |
| Slide Deck        | To be added for submission                    |
| Demo Video        | To be added for submission                    |

---

## Overview

### Problem

People facing AI-driven changes often hear broad claims about whole jobs without understanding which of their own tasks and skills are affected. That makes it hard to distinguish useful opportunities from anxiety, or to choose a realistic next step within time and resource limits. AI Career Navigator starts from a person's actual work and constraints rather than a job-title replacement score.

### Solution

The intended product will combine a personal profile, evidence-based capability assessment, task-level AI impact analysis, two career paths, and a concrete action plan. **V0.1 validates this flow with two fictional, scripted cases only.** It does not call an AI model or make verified labour-market claims. AI integration and evidence review are future work.

### Key Features

- **Four-step personal profile** — Background, tasks, skills, AI use, concerns, goals and constraints, with validation and editing.
- **Explainable mock report** — Three capability lenses and task-level AI impact, with visible evidence limitations.
- **Two paths and an action plan** — Compare upgrading a current role with exploring an adjacent role, then test a small practical project.

### Tech Stack

| Layer         | Technology                   |
| ------------- | ---------------------------- |
| Frontend      | Vanilla HTML, CSS and JavaScript (local V0.1) |
| Backend       | None for the prototype; Python standard-library static server for local preview |
| Database      | None; profile state is held in browser memory |
| AI / Compute  | None in V0.1; `runpod/handler.py` is the retained official placeholder |
| Hosting / Dev | Local preview; `.replit` and `src/main.py` are retained official placeholders |

---

## Project Structure

```
.
├── docs/                    # Founding manifesto and team workflow
├── prototype/               # Local interactive V0.1 (HTML/CSS/JS, mock data)
├── runpod/
│   └── handler.py           # Official RunPod placeholder, not used by V0.1
├── src/
│   ├── main.py              # Official template entry point, not V0.1
│   └── utils.py             # Helper functions
├── submission/              # Required submission documents
│   ├── SDC2026_TeamName_Preliminary.pdf      # Preliminary submission
│   ├── SDC2026_TeamName_TechDeclaration.pdf  # Technology declaration
│   ├── SDC2026_TeamName_Replit_POU.pdf       # Replit proof of use
│   └── SDC2026_TeamName_Runpod_POU.pdf       # RunPod proof of use
├── tests/
│   └── test_utils.py        # Unit tests
├── .env.example             # Example environment variables
├── .gitignore
├── .replit                  # Replit run configuration
├── LICENSE
├── requirements.txt         # Python dependencies
└── README.md
```

### Architecture

```
V0.1: Browser ──► Local static server ──► Scripted demo scenarios

Future submission target: Replit (App / API) ──► RunPod Endpoint
```

---

## How to Run

### Option 1 — Run the V0.1 prototype locally

From the repository root, with Python 3.11 or newer:

```bash
python3 prototype/server.py
```

Open <http://127.0.0.1:4173>. No API key, package installation or database is needed. The two fictional cases are marked **Demo / Mock**. Answers remain in browser memory for this session and are not uploaded.

### Option 2 — Official template entry point / future Replit integration

The retained `.replit` file runs `python src/main.py`. That file still prints the official starter output; it does **not** serve this prototype. Before claiming Replit use for submission, the team must integrate and run the actual app there, configure required secrets, and capture proof of use.

To run the original template entry point locally:

```bash
git clone https://github.com/xieyifeng24/AI-Career-Navigator.git
cd AI-Career-Navigator
python src/main.py
```

### Run Tests

```bash
python -m unittest discover tests
node --check prototype/app.js
node --check prototype/data.js
node --check prototype/logic.js
node --test prototype/logic.test.mjs
```

---

## How We Use Replit *(Required)*

**Not completed in V0.1.** The team must import or deploy the application to Replit, verify the actual run command and live demo, store any future secrets in Replit Secrets, and replace the placeholder proof-of-use PDF with genuine evidence.

📄 Proof of use: [`submission/SDC2026_TeamName_Replit_POU.pdf`](submission/SDC2026_TeamName_Replit_POU.pdf)

## How We Use RunPod *(Required)*

**Not completed in V0.1.** `runpod/handler.py` is the official placeholder. A real model workload, endpoint, integration, secure credentials and proof-of-use must be added before the team marks this requirement complete.

Example request:

```bash
curl -X POST https://api.runpod.ai/v2/$RUNPOD_ENDPOINT_ID/runsync \
  -H "Authorization: Bearer $RUNPOD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input": {"prompt": "Hello"}}'
```

📄 Proof of use: [`submission/SDC2026_TeamName_Runpod_POU.pdf`](submission/SDC2026_TeamName_Runpod_POU.pdf)

---

## Challenges & Learnings

- We kept the official submission structure intact while making the prototype separately runnable under `prototype/`.
- We made uncertainty and sample-data limits visible throughout the report, so the UX can be tested without claiming verified career analysis.

## Future Improvements

- [ ] Agree on the shared report API and replace scripted scenarios with source-backed analysis.
- [ ] Connect the required Replit and RunPod workflow, verify the deployment and collect genuine proof of use.

## Team

| Name        | Role                | GitHub                                   |
| ----------- | ------------------- | ---------------------------------------- |
| XIE YIFENG | Product Lead / team leader | [@xieyifeng24](https://github.com/xieyifeng24) |
| YANG XUHUI | Tech Lead / backend | GitHub account to be added |
| CHEN QIANYU | Frontend & UI/UX | GitHub account to be added |
| LAI HAILU | AI Engineer | GitHub account to be added |
| ZHANG XINAO | Research & QA | GitHub account to be added |

---

## Submission Checklist

- [ ] Team name, domain (Domain 1 / Domain 2) and SDG track filled in
- [ ] Slide deck link added
- [ ] Demo video link added
- [ ] Replit used, with proof of use in `submission/`
- [ ] RunPod used, with proof of use in `submission/`
- [ ] Preliminary submission completed (`SDC2026_TeamName_Preliminary.pdf`)
- [ ] Technology declaration completed (`SDC2026_TeamName_TechDeclaration.pdf`)
- [ ] Submission files renamed with your team name (replace `TeamName`)
- [x] V0.1 local "How to Run" steps and tests verified
- [x] No real API keys or secrets committed with this prototype

## License

This project is licensed under the [Apache License 2.0](LICENSE).
