# Hackathon delivery — 21 October 2026

Owner requested Release / Delivery mode: freeze features, stop repeated GPU
quality optimisation, and accept one successful production browser journey as
this stage's delivery gate. Non-blocking limitations are in KNOWN_ISSUES.md.

Candidate code: `4397ee7` on `codex/real-ai-mvp` (PR #3). Main was not changed.
Basic checks: 22 Python tests and 8 Node tests passed. Replit's actual Python
3.12.12 environment also passed all 22 Python tests using uv 0.9.5.

Existing project only: https://replit.com/@xyf20070924/AI-Career-Navigator
Requested public domain: https://ai-career-navigator-xyf20070924.replit.app/
Autoscale: Asia, 1 vCPU, 0.5 GiB RAM, maximum one instance; no database required.
RunPod: endpoint cckbk8134lpxf8, Qwen3-4B-Instruct-2507, max one GPU worker,
minimum zero. API key and demo code remain in Replit Secrets and ignored local .env.

Rollback code: Replit branch `backup/replit-static-20261021` at `cc8efba`.
The owner explicitly approved Replit's required Static unpublish operation and
its deletion of deployment history / saved domain on 21 October 2026. No code
backup was deleted. Replit-created `.replit` Git-package change was also stashed
before fast-forwarding the candidate branch.

Publication and the single production acceptance result will be recorded below.
