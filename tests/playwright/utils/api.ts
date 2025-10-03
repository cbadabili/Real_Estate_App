import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export interface RegisterUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  userType?: 'buyer' | 'seller' | 'agent' | 'landlord';
}

export const uniqueEmail = (prefix = 'e2e') =>
  `${prefix}+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

export interface AuthContext {
  token: string;
  userId: string | number;
}

const authHeaders = (auth: AuthContext) => ({
  Authorization: `Bearer ${auth.token}`
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function registerUser(api: APIRequestContext, input: RegisterUserInput): Promise<AuthContext> {
  const maxAttempts = 5;
  let registerResponse: APIResponse | undefined;
  let responseBody: string | undefined;
  const firstName = input.firstName ?? 'Test';
  const lastName = input.lastName ?? 'User';
  const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    registerResponse = await api.post('/api/users/register', {
      data: {
        username,
        email: input.email,
        password: input.password,
        firstName,
        lastName,
        acceptTerms: true,
        acceptMarketing: false,
        userType: input.userType ?? 'buyer'
      }
    });

    if (registerResponse.ok() || registerResponse.status() === 409) {
      break;
    }

    responseBody = await registerResponse.text();

    if (registerResponse.status() === 429 && attempt < maxAttempts) {
      const retryAfterHeader = registerResponse.headers()['retry-after'];
      const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : undefined;
      const computedBackoff = Number.isFinite(retryAfterSeconds)
        ? Math.max(0, Number(retryAfterSeconds) * 1000)
        : 500 * attempt;
      const backoffMs = Math.min(Math.max(computedBackoff, 250), 5000);
      await wait(backoffMs);
      continue;
    }

    break;
  }

  if (!registerResponse || (!registerResponse.ok() && registerResponse.status() !== 409)) {
    const failureBody = responseBody ?? (registerResponse ? await registerResponse.text() : '');
    expect(
      registerResponse?.ok(),
      `registration failed [${registerResponse?.status()}]: ${failureBody}`
    ).toBeTruthy();
  }

  const loginResponse = await api.post('/api/users/login', {
    data: {
      email: input.email,
      password: input.password
    }
  });

  expect(loginResponse, 'login should succeed for newly registered or existing user').toBeOK();

  const loginJson = await loginResponse.json();
  const token = loginJson.token ?? loginJson.user?.token ?? loginJson.user?.sessionToken;
  const userId = loginJson.id ?? loginJson.user?.id ?? loginJson.userId;
  expect(token, 'login response should include JWT token').toBeTruthy();
  expect(userId, 'login response should include user id').toBeTruthy();

  return {
    token,
    userId
  };
}

export interface PropertyPayload {
  ownerId?: string | number;
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  listingType: string;
  bedrooms?: number;
  bathrooms?: number;
  latitude?: number;
  longitude?: number;
  features?: string[];
  images?: string[];
}

export async function createProperty(api: APIRequestContext, auth: AuthContext, payload: PropertyPayload) {
  const ownerIdSource = payload.ownerId ?? auth.userId;
  const normalizedOwnerId = Number(ownerIdSource);
  expect(Number.isFinite(normalizedOwnerId), 'ownerId must be numeric').toBeTruthy();
  const features = (payload.features ?? ['Automated Test Listing']).map(feature =>
    typeof feature === 'string' ? feature : String(feature)
  );

  const images = (payload.images ?? [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811'
  ]).map(image => (typeof image === 'string' ? image : String(image)));

  const normalizeNumber = (value: unknown, fallback: number, field: string) => {
    if (value === undefined || value === null) {
      return fallback;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      expect(Number.isFinite(parsed), `${field} must be numeric`).toBeTruthy();
      return parsed;
    }

    expect(false, `${field} must be numeric`).toBeTruthy();
    return fallback;
  };

  const price = normalizeNumber(payload.price, 0, 'price');
  expect(price > 0, 'price must be greater than zero').toBeTruthy();

  const bedrooms = normalizeNumber(payload.bedrooms, 3, 'bedrooms');
  const bathrooms = normalizeNumber(payload.bathrooms, 2, 'bathrooms');

  const response = await api.post('/api/properties', {
    headers: authHeaders(auth),
    data: {
      ownerId: normalizedOwnerId,
      title: payload.title,
      description: payload.description ?? 'Automated listing',
      price: price.toString(),
      currency: 'BWP',
      address: payload.address,
      city: payload.city,
      state: payload.state,
      zipCode: payload.zipCode,
      propertyType: payload.propertyType,
      listingType: payload.listingType,
      status: 'active',
      bedrooms,
      bathrooms,
      latitude: payload.latitude ?? -24.6282,
      longitude: payload.longitude ?? 25.9231,
      images,
      features,
      placeName: 'Tlokweng',
      placeId: 'test-place-id',
      locationSource: 'seeded'
    }
  });

  expect(response, 'property creation should succeed').toBeOK();
  const json = await response.json();
  expect(json.id, 'new property should have id').toBeTruthy();
  return json;
}

export async function saveSearch(api: APIRequestContext, auth: AuthContext, filters: Record<string, unknown>) {
  const response = await api.post('/api/users/saved-searches', {
    headers: authHeaders(auth),
    data: {
      name: 'Playwright smoke',
      filters,
      frequency: 'daily'
    }
  });

  expect(response).toBeOK();
  return response;
}

export async function saveFavorite(api: APIRequestContext, auth: AuthContext, propertyId: number) {
  const response = await api.post(`/api/users/${auth.userId}/saved-properties/${propertyId}`, {
    headers: authHeaders(auth)
  });

  expect(response).toBeOK();
  return response;
}

export async function unsaveFavorite(api: APIRequestContext, auth: AuthContext, propertyId: number) {
  const response = await api.delete(`/api/users/${auth.userId}/saved-properties/${propertyId}`, {
    headers: authHeaders(auth)
  });

  expect(
    response.ok() || response.status() === 404,
    'unsaveFavorite should succeed or be a no-op'
  ).toBeTruthy();
  return response;
}

export async function scheduleViewing(api: APIRequestContext, auth: AuthContext, propertyId: number, datetimeIso: string) {
  const response = await api.post('/api/appointments', {
    headers: authHeaders(auth),
    data: {
      propertyId,
      buyerId: auth.userId,
      appointmentDate: datetimeIso,
      type: 'in-person',
      notes: 'Automated calendar booking'
    }
  });

  expect(response).toBeOK();
  return response;
}
