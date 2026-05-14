# Collegamento Revolut tramite open banking

Provider scelto: `Enable Banking`

## Perche questa scelta

- Per `Revolut personale` ci serve un aggregatore PSD2 con flusso di consenso dedicato.
- Hai gia registrato una sandbox app e generato la private key `.pem`.
- La sync puo vivere bene su `Cloudflare Worker + Supabase` senza esporre la chiave privata nel frontend.

## Variabili Cloudflare da aggiungere

- `ENABLE_BANKING_APP_ID`
- `ENABLE_BANKING_PRIVATE_KEY`
- `ENABLE_BANKING_REDIRECT_URI`

Valori attesi:

- `ENABLE_BANKING_APP_ID` = UUID dell'app registrata in Enable Banking
- `ENABLE_BANKING_PRIVATE_KEY` = contenuto completo del file `.pem`
- `ENABLE_BANKING_REDIRECT_URI` = `https://budgetmanager.mattiaxmart.workers.dev/bank.html`

## Tabelle Supabase gia previste

- `bank_connections`
- `bank_sync_runs`
- `bank_transactions`

## Passi successivi

1. Verificare che `/api/bank/config` torni tutto verde.
2. Eseguire di nuovo `supabase-setup.sql` se le tabelle banca non esistono ancora.
3. Costruire il Worker che:
   - firma un JWT con `ENABLE_BANKING_PRIVATE_KEY`
   - ottiene il token verso Enable Banking
   - elenca gli istituti disponibili
   - avvia il consenso utente
   - salva la connessione in `bank_connections`
   - sincronizza i movimenti in `bank_transactions`
4. Collegare i movimenti importati al planner.
