// syncDraws.cjs

// 1) Load environment variables
require('dotenv').config();

// 2) Import Supabase client
const { createClient } = require('@supabase/supabase-js');

// 3) Read and validate env vars
const SUPABASE_URL      = process.env.SUPABASE_URL      || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase credentials are missing');
}

// 4) Debug credentials
console.log('DEBUG: SUPABASE_URL      =', SUPABASE_URL);
console.log('DEBUG: SUPABASE_ANON_KEY =', SUPABASE_ANON_KEY.slice(0, 4) + '...');

// 5) Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 6) Define games and target tables
const GAMES = [
  { id: 5130, table: 'oz_lotto_draws', hasCounts: true },
  { id: 5132, table: 'powerball_draws', hasPowerball: true },
  { id: 5127, table: 'saturday_lotto_draws' },
  { id: 5237, table: 'set_for_life_draws' },
  { id: 5303, table: 'weekday_windfall_draws' }
];

// 7) Helper: parse CSV into objects
function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, idx) => {
      obj[header] = (values[idx] || '').trim();
      return obj;
    }, {});
  });
}

// 8) Helper: extract numeric fields by prefix and ignore empty/zero
function extractNumbers(row, prefix) {
  return Object.keys(row)
    .filter(key => key.toLowerCase().startsWith(prefix.toLowerCase()))
    .map(key => Number(row[key]))
    .filter(n => n > 0);
}

// 9) Convert DD/MM/YYYY to ISO YYYY-MM-DD
function formatDateDMY(dmy) {
  const [d, m, y] = dmy.split('/').map(p => p.padStart(2, '0'));
  return `${y}-${m}-${d}`;
}

// 10) Sync a single game
async function syncGame(game) {
  console.log(`\n🔄 Syncing ${game.table}`);
  try {
    const url = `https://api.lotterywest.wa.gov.au/api/v1/games/${game.id}/results-csv`;
    console.log('FETCH:', url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const csv = await res.text();
    const rows = parseCsv(csv);
    console.log(`DEBUG: Parsed rows = ${rows.length}`);

    const records = rows.map(row => {
      const draw_number = Number(row['Draw number']);
      const draw_date = formatDateDMY(row['Draw date']);
      const winning_numbers = extractNumbers(row, 'Winning Number');

      if (game.hasPowerball) {
        const powerball = Number(row['Powerball Number']) || null;
        return { draw_number, draw_date, winning_numbers, powerball };
      }

      if (game.hasCounts) {
        const supplementary_numbers = extractNumbers(row, 'Supplementary Number');
        return {
          draw_number,
          draw_date,
          winning_numbers,
          supplementary_numbers,
          number_of_main:       winning_numbers.length,
          number_of_supps:      supplementary_numbers.length
        };
      }

      // default for games without count fields
      const supplementary_numbers = extractNumbers(row, 'Supplementary Number');
      return { draw_number, draw_date, winning_numbers, supplementary_numbers };
    });

    const { data, error } = await supabase
      .from(game.table)
      .upsert(records, { onConflict: 'draw_number' });

    if (error) console.error('UPSERT ERROR:', game.table, error);
    else console.log(`✅ ${game.table}: ${Array.isArray(data) ? data.length : 0} rows`);
  } catch (err) {
    console.error('SYNC ERROR:', game.table, err);
  }
}

// 11) Run sync for all games
async function syncAllGames() {
  for (const game of GAMES) {
    await syncGame(game);
  }
}

// 12) Invoke when run directly
if (require.main === module) {
  syncAllGames().catch(err => console.error('FATAL:', err));
}
