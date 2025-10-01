import { APIRequestContext, expect } from '@playwright/test';

export interface RegisterUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  userType?: 'buyer' | 'seller' | 'agent' | 'landlord';
}

export interface AuthContext {
  token: string;
  userId: string | number;
}

const authHeaders = (auth: AuthContext) => ({
  Authorization: `Bearer ${auth.token}`
});

export async function registerUser(api: APIRequestContext, input: RegisterUserInput): Promise<AuthContext> {
  const registerResponse = await api.post('/api/users/register', {
    data: {
      email: input.email,
      password: input.password,
      firstName: input.firstName ?? 'Test',
      lastName: input.lastName ?? 'User',
      acceptTerms: true,
      acceptMarketing: false,
      userType: input.userType ?? 'buyer'
    }
  });

  if (!registerResponse.ok() && registerResponse.status() !== 409) {
    const body = await registerResponse.text();
    expect(
      registerResponse.ok(),
      `registration failed [${registerResponse.status()}]: ${body}`
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
  const response = await api.post('/api/properties', {
    headers: authHeaders(auth),
    data: {
      ownerId: normalizedOwnerId,
      title: payload.title,
      description: payload.description ?? 'Automated listing',
      price: payload.price,
      currency: 'BWP',
      address: payload.address,
      city: payload.city,
      state: payload.state,
      zipCode: payload.zipCode,
      propertyType: payload.propertyType,
      listingType: payload.listingType,
      status: 'active',
      bedrooms: payload.bedrooms ?? 3,
      bathrooms: payload.bathrooms ?? 2,
      latitude: payload.latitude ?? -24.6282,
      longitude: payload.longitude ?? 25.9231,
      images: payload.images ?? ['https://images.unsplash.com/photo-1613490493576-7fde63acd811'],
      features: payload.features ?? ['Automated Test Listing'],
      areaText: 'Tlokweng',
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
