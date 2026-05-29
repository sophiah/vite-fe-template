# Architecture

本專案主要由三個部分組成：

- `nginx`
- `frontend`
- `backend`

流量路徑為：

- 使用者請求先進入 `nginx`
- `nginx` 依路由將請求轉導到 `frontend` 或 `backend`

其他前端與後端開發規範，分別參考：

- `.ai/skills/frontend-development.md`
- `.ai/skills/api-development.md`
