# Supabase Setup

1. Crea un progetto su Supabase.
2. Vai in `SQL Editor`.
3. Incolla ed esegui il file `supabase-setup.sql`.
4. Vai in `Authentication -> Sign In / Providers`.
5. Abilita `Email`.
6. Se vuoi evitare la conferma email all'inizio, disattiva `Confirm email`.
7. Copia:
   - `Project URL`
   - `Publishable / anon key`
8. Su Cloudflare Pages apri il progetto e aggiungi queste environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
9. Dopo il deploy, il frontend potrà usare Supabase Auth e salvare il planner nel DB.

Tabella usata:
- `public.planner_states`

Struttura:
- `user_id`: utente Supabase Auth
- `username`: campo testuale opzionale
- `planner_state`: JSON completo del planner

RLS:
- ogni utente legge e scrive solo la propria riga
