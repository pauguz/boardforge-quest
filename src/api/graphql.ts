const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const GQL_URL  = import.meta.env.VITE_SUPABASE_URL + '/graphql/v1';

export async function gqlQuery(
  query: string, 
  variables: Record<string, unknown> = {},
  localId?: string
) {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':        ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      ...(localId ? { 'local-id': localId } : {})
    },
    body: JSON.stringify({ query, variables })
  });
  const { data, errors } = await res.json();
  if (errors) console.error('GraphQL errors:', errors);
  return data;
}