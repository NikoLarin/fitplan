const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function endpoint(table: string, query = '') {
  return `${url}/rest/v1/${table}${query}`;
}

async function sbFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });

  if (!res.ok) throw new Error(`Supabase error ${res.status}: ${await res.text()}`);
  return res;
}

export async function insertRow<T>(table: string, row: unknown): Promise<T> {
  const res = await sbFetch(endpoint(table), {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(row)
  });
  const json = await res.json();
  return json[0] as T;
}

export async function updateRows(table: string, filter: string, patch: unknown) {
  await sbFetch(endpoint(table, filter), {
    method: 'PATCH',
    body: JSON.stringify(patch)
  });
}

export async function selectOne<T>(table: string, query: string): Promise<T> {
  const res = await sbFetch(endpoint(table, query), {
    headers: { Accept: 'application/vnd.pgrst.object+json' }
  });
  return (await res.json()) as T;
}

export async function selectMany<T>(table: string, query: string): Promise<T[]> {
  const res = await sbFetch(endpoint(table, query));
  return (await res.json()) as T[];
}
