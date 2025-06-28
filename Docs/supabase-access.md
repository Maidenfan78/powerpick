# Supabase Access for Sync Scripts

The data sync scripts require write permissions to your Supabase
project. Use a **service role key** via the `SUPABASE_SERVICE_ROLE_KEY`
environment variable when running `yarn sync-draws` or other node
scripts.

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key
```

Older variable names `SUPABASE_URL` and `SUPABASE_ANON_KEY` are still
supported. The sync scripts and Expo config will fall back to them if
the new names are not set.

Without the service role key the scripts will connect using the anon
key which can only read tables. Writes will fail silently under row
level security.
