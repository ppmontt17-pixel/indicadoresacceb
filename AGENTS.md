<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Portal routes: private pages live under src/routes/_authenticated (client-side gate, redirects to /auth); / redirects to /portal.
- Login and signup share the public auth page; signup never requests a role and a missing session always requires email confirmation before portal access.
- Sector access: admins (user_roles) see all sectors; others see sectors listed in sector_members; enforced by RLS. First registered user becomes admin via signup trigger.
- Spreadsheets are parsed in the browser (xlsx) and stored per sheet as JSON rows in reports; dashboards are derived from them.
- Imported dashboards live in src/features/{financeiro,faturamento} with routes /financeiro and /faturamento under _authenticated, gated by sector slug (financeiro-custos, faturamento). Faturamento data is in faturamento/glosas tables, read by sector members via can_see_sector RLS.
