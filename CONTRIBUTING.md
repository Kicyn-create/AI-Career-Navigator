# AI Career Navigator 协作指南

团队分工见 [TEAM_WORKFLOW](docs/TEAM_WORKFLOW.md)。所有日常开发都在任务分支，通过 PR 进入 main；不在 main 开发，不向别人的分支强推。

## 0. 当前配置与首次接入

2026-10-20 从官方模板克隆，基线 commit 为 `ae48a68`，保留官方代码与材料。团队已建立独立仓库：https://github.com/xieyifeng24/AI-Career-Navigator 。本地 origin 已关联该地址，协作配置通过 `chore/team-workflow` 分支 PR 提交；合并与保护设置状态以 GitHub 页面为准。

团队其他成员只 clone 团队仓库：

```bash
git clone https://github.com/xieyifeng24/AI-Career-Navigator.git
cd AI-Career-Navigator
git remote -v
git status
```

安装 Git、GitHub Desktop（可选）和 Python 3.11。设置自己的 Git 姓名、邮箱并完成 GitHub 身份认证。五个人使用各自账号，管理员邀请成员并赋予 Write 权限。不要共用凭证。

GitHub Desktop：File → Clone repository → URL，填写团队仓库地址，选择本地空目录。打开 Repository → Open in Terminal 可执行本文命令。

## 1. 同步 main 并建立任务分支

先检查工作区；未提交的工作应在原分支提交，或 `git stash push -u` 暂存后在原分支恢复。不要用丢弃更改清空工作区。

```bash
git status
git switch main
git pull --ff-only origin main
git switch -c feature/backend-career-api
```

Desktop：Current Branch → main → Fetch origin → Pull origin，再选择 New Branch，以 main 为基础命名。遇到 main 与远程分叉时交给 Y 排查，不强制重置。

初始分支示例为 `feature/product-ai`、`feature/backend`、`feature/frontend`、`feature/ai-engine`、`feature/testing`。这些是示例，不需要预建五个长期分支。推荐每个 Issue 一个短期分支，例如 `feature/frontend-profile-form` 或 `fix/testing-empty-input`；已经合并的分支不继续使用。

## 2. 使用 Codex 开发

在当前任务分支打开仓库，让 Codex 先读 README、本文和相关代码；明确 Issue、验收条件、允许修改的范围。可使用提示：

> 先检查 git status 和当前分支，按 Issue #N 实现并测试。保持官方模板结构；不要切换到 main 开发，不提交密钥，不自动 commit、push、merge 或部署。

查看 Codex 的 diff，确认只改了本次任务涉及的文件；理解生成的代码、测试和局限。每个人使用独立本地 checkout，避免多人操作同一个远程工作目录。共享 API 或数据结构必须先按团队规则讨论。

## 3. 本地测试与环境

当前基础测试只依赖 Python 标准库，不需要 pytest、Node、GPU 或真实 RunPod 密钥：

```bash
python3 -m unittest discover tests -v
```

Windows 通常使用 `python`；CI 使用 `python`。当前应执行 3 个测试，新增功能应补充相应测试，发现运行 0 个测试不能视为有效验证。

需要运行应用或 RunPod 相关代码时才创建独立虚拟环境、安装模板声明的依赖：

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Windows PowerShell 激活：`.venv\Scripts\Activate.ps1`。按 `.env.example` 创建本地 `.env`（已有则不要覆盖），仅填写自己需要的配置。模板入口未自动加载 dotenv 文件；本地运行需在进程环境中配置变量，Replit 使用 Secrets。密钥不放进代码、Issue、PR、截图或日志。

当前 CI 不启动应用、RunPod handler 或部署，不检验真实模型调用。将来测试引入第三方库时，须在同一个 PR 中明确依赖并在 CI 增加安装步骤；增加前端后再按实际清单和锁文件配置前端检查。

## 4. Commit 与 Push

```bash
git diff
git status
# 仅暂存已审核的具体文件，不盲目 git add .
git add <文件路径>
git diff --cached
git commit -m "feat(backend): add career API validation"
git push -u origin <当前任务分支>
```

提交信息使用 `feat`、`fix`、`docs`、`test`、`chore` 等清楚表达目的。一次 commit 聚焦一个改动。

Desktop：Changes 中逐文件查看 diff、勾选要提交的文件，填写 Summary → Commit to 当前分支 → Publish branch / Push origin。确认按钮显示的分支不是 main。

`.gitignore` 不会自动移除已跟踪的秘密，也不是密钥检测器。若发现泄露，立即撤销或轮换密钥，联系 Y 处理历史；不要只删除文件后认为已安全。

## 5. Pull Request、自动检查与审核

Desktop 的 Create Pull Request 会打开 GitHub，也可在 GitHub 使用 Compare & pull request。base 选择 main，compare 选择自己的任务分支，填写模板、关联 Issue，并邀请 Y 和受影响成员审核。未准备好时创建 Draft PR。

每次创建、重新打开 PR 或推送新提交，GitHub Actions 自动执行 `CI / Python unit tests`（以 Checks 页面实际显示名称为准）。失败时查看 Actions 日志，在同一分支修复、重新测试、commit、push；同一 PR 会自动更新。没有可用 runner、Actions 被禁用或尚待批准时，检查不代表通过。

审核人检查需求、API 兼容性、实现、测试和密钥风险，通过后 Approve；有阻塞问题则 Request changes。作者逐条回应并修改，作者不能批准自己的 PR。至少需要一名其他成员批准，Y 协调集成，其他成员均可参与审核。

## 6. 合并、同步和清理

Y 确认检查通过、审核通过、讨论已解决且符合验收条件后协调合并；经协调的有权限成员也可操作。建议 Squash and merge，保留清晰的 PR 记录。不要绕过保护规则。合并后可删除远程任务分支，作者在工作区干净时同步：

```bash
git switch main
git pull --ff-only origin main
git fetch --prune
```

Desktop：切回 main → Fetch origin → Pull origin。下一项任务从最新 main 建新分支。可选删除已合并本地分支；Squash 后 `git branch -d` 可能拒绝，先核对 PR 和代码，不直接用强制删除。

## 7. 开发期间同步 main 与解决冲突

在自己的任务分支、工作区干净时：

```bash
git fetch origin
git merge origin/main
```

Desktop：Fetch origin，然后在当前任务分支使用 Branch → Merge into Current Branch，选择 origin/main（或已更新的本地 main）。不要反向把任务分支本地合入 main。

发生冲突时，用编辑器逐段理解双方改动，找受影响文件负责人确认；移除 `<<<<<<<`、`=======`、`>>>>>>>` 标记，保留正确业务语义，不批量选择 ours/theirs。完成后：

```bash
git add <已解决文件>
python3 -m unittest discover tests -v
git diff --cached
git commit
git push
```

Desktop 可在编辑器解决后标记解决，完成 merge commit，再 Push。无法确定时保留现场并找 Y；若决定撤回本次未完成合并，使用 `git merge --abort`，不要使用 `reset --hard`。合并 main 后的改动仍需 PR 检查和审核；不对共享分支 rebase 或 force push。

## 8. 比赛模板边界

保留 `src/`、`runpod/`、`submission/`、`docs/`、`tests/`、`.replit`、`.env.example`、README 和 LICENSE。官方要求包含 Replit 与 RunPod 使用说明和证明、初赛文档、技术声明、演示及幻灯片链接，提交前由 Product Lead 和 Z 按官方 README 逐项核对。官方 README 还链接 Google Drive 提交模板，需要另行下载核对，本次未验证该文件夹内容。不要把 PDF 提交材料加入忽略规则。

来源：https://github.com/michaelzhngg/SDC_Hackathon_Submission_Template
