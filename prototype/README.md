# AI Career Navigator — Interactive Prototype V0.1

Run locally with Python 3.11+ (no package install):

```bash
python3 prototype/server.py
```

Open http://127.0.0.1:4173. The original `src/main.py`, `.replit`, RunPod handler and submission materials are untouched.

This is a static, client-side prototype. It has four questionnaire steps and four report sections: capability assessment, task-level AI impact, two career paths, and an action plan. Two fictional scenarios (marketing and administration) provide different scripted reports. The form is editable, but only the selected scenario, user-entered profile and time constraint shape the output. No data is uploaded, stored, or sent to an AI API. All report content is marked Demo / Mock; it is not verified career research.

`data.js` contains scenario content, `logic.js` contains validation and report assembly, and `app.js` handles screens and interactions. For future integration, replace `makeReport(profile)` with a backend request that returns the same report sections and supplies evidence, source metadata, uncertainty, and review status. Keep the questionnaire validation client-side, add server-side validation and explicit user consent, and distinguish sourced findings from hypotheses in the UI. The existing Python/RunPod template can be connected after API contracts are agreed with the team.

Run checks:

```bash
python3 -m unittest discover tests -v
node --check prototype/app.js
node --check prototype/data.js
node --check prototype/logic.js
node --test prototype/logic.test.mjs
```
