const ORCID_AUTH_URL = 'https://orcid.org/oauth/authorize';
const ORCID_TOKEN_URL = 'https://orcid.org/oauth/token';
const ORCID_PERSON_URL = 'https://pub.orcid.org/v3.0';

export function getOrcidAuthorizeUrl(state: string) {
  const clientId = process.env.ORCID_CLIENT_ID;
  const redirectUri = process.env.ORCID_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('ORCID_CLIENT_ID u ORCID_REDIRECT_URI faltante');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    scope: '/authenticate',
    redirect_uri: redirectUri,
    state,
  });

  return `${ORCID_AUTH_URL}?${params.toString()}`;
}

export async function exchangeOrcidCode(code: string) {
  const clientId = process.env.ORCID_CLIENT_ID;
  const clientSecret = process.env.ORCID_CLIENT_SECRET;
  const redirectUri = process.env.ORCID_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Variables ORCID incompletas');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  });

  const response = await fetch(ORCID_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ORCID token: ${text}`);
  }

  return response.json();
}

export async function fetchOrcidPerson(orcidId: string, accessToken: string) {
  const response = await fetch(`${ORCID_PERSON_URL}/${orcidId}/person`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export function extractOrcidFullName(person: any): string | null {
  const given = person?.name?.['given-names']?.value ?? '';
  const family = person?.name?.['family-name']?.value ?? '';
  const full = `${given} ${family}`.trim();
  return full || null;
}
