# Collegamento Revolut tramite open banking

Provider scelto: `GoCardless Bank Account Data`

## Perché questa scelta

- Per `Revolut personale` è più realistico usare un aggregatore PSD2 già autorizzato.
- L'app evita l'accesso diretto alle API Revolut come TPP regolamentato.
- La sync può poi vivere bene su `Cloudflare Worker + Supabase`.

## Variabili Cloudflare da aggiungere

- `GC_BA_SECRET_ID`
- `GC_BA_SECRET_KEY`
- `GC_BA_REDIRECT_URI`

## Tabelle Supabase già previste

- `bank_connections`
- `bank_sync_runs`
- `bank_transactions`

## Passi successivi

1. Creare i `User Secrets` nel portale GoCardless Bank Account Data.
2. Inserire le 3 variabili in Cloudflare.
3. Eseguire di nuovo `supabase-setup.sql` per creare le tabelle banca.
4. Costruire il Worker che:
   - crea il token GoCardless
   - elenca gli istituti disponibili
   - crea la `requisition`
   - salva la connessione in `bank_connections`
   - sincronizza i movimenti in `bank_transactions`
5. Collegare i movimenti importati al planner.
