import { APIRequestContext, expect } from '@playwright/test';

interface RegisterUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  userType?: 'buyer' | 'seller' | 'agent' | 'landlord';
}

export interface AuthContext {
  token: string;
  userId: number;
}

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

  expect(registerResponse.status(), 'registration should succeed or surface validation errors').toBeLessThan(500);

  const loginResponse = await api.post('/api/users/login', {
    data: {
      email: input.email,
      password: input.password
    }
  });

  expect(loginResponse.ok(), 'login should succeed for newly registered user').toBeTruthy();

  const loginJson = await loginResponse.json();
  expect(loginJson.token, 'login response should include JWT token').toBeTruthy();
  expect(loginJson.id ?? loginJson.user?.id, 'login response should include user id').toBeTruthy();

  return {
    token: loginJson.token ?? loginJson.user?.token ?? loginJson.user?.sessionToken,
    userId: loginJson.id ?? loginJson.user?.id ?? loginJson.userId
  };
}

interface PropertyPayload {
  ownerId?: number;
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
  const response = await api.post('/api/properties', {
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    data: {
      ownerId: payload.ownerId ?? auth.userId,
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

  expect(response.ok(), 'property creation should succeed').toBeTruthy();
  const json = await response.json();
  expect(json.id, 'new property should have id').toBeTruthy();
  return json;
}

export async function saveSearch(api: APIRequestContext, auth: AuthContext, filters: Record<string, unknown>) {
  const response = await api.post('/api/users/saved-searches', {
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    data: {
      name: 'Playwright smoke',
      filters,
      frequency: 'daily'
    }
  });

  expect(response.status()).toBeLessThan(500);
  return response;
}

export async function saveFavorite(api: APIRequestContext, auth: AuthContext, propertyId: number) {
  const response = await api.post(`/api/users/${auth.userId}/saved-properties/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  });

  expect(response.status()).toBeLessThan(500);
  return response;
}

export async function unsaveFavorite(api: APIRequestContext, auth: AuthContext, propertyId: number) {
  const response = await api.delete(`/api/users/${auth.userId}/saved-properties/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  });

  expect(response.status()).toBeLessThan(500);
  return response;
}

export async function scheduleViewing(api: APIRequestContext, auth: AuthContext, propertyId: number, datetimeIso: string) {
  const response = await api.post('/api/appointments', {
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    data: {
      propertyId,
      buyerId: auth.userId,
      appointmentDate: datetimeIso,
      type: 'in-person',
      notes: 'Automated calendar booking'
    }
  });

  expect(response.status()).toBeLessThan(500);
  return response;
}
