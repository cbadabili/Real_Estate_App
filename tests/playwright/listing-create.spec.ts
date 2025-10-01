import { test, expect } from '@playwright/test';
import { createProperty, registerUser } from './utils/api';

const uniqueEmail = () => `lister-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;

test.describe('Agent listing lifecycle', () => {
  test('agent can publish, update, and unpublish a Botswana geo-coded listing', async ({ request }) => {
    const auth = await registerUser(request, {
      email: uniqueEmail(),
      password: 'Secure!123',
      userType: 'agent'
    });

    const property = await createProperty(request, auth, {
      title: 'South East District Family Home',
      description: 'Spacious yard with borehole and solar backup',
      price: 950000,
      address: 'Plot 45, Tlokweng Road',
      city: 'Gaborone',
      state: 'South East District',
      zipCode: '0010',
      propertyType: 'house',
      listingType: 'sale',
      bedrooms: 4,
      bathrooms: 3,
      latitude: -24.6285,
      longitude: 25.9235,
      features: ['Solar geyser', 'Staff quarters', 'Double garage']
    });

    expect(property.status).toBe('active');
    expect(property.latitude).toBeCloseTo(-24.6285, 3);
    expect(property.longitude).toBeCloseTo(25.9235, 3);
    const authHeaders = { Authorization: `Bearer ${auth.token}` };

    const updateResponse = await request.put(`/api/properties/${property.id}`, {
      headers: authHeaders,
      data: {
        price: 975000,
        bedrooms: 5,
        latitude: -24.6286,
        longitude: 25.9239,
        status: 'active'
      }
    });
    expect(updateResponse).toBeOK();
    const updated = await updateResponse.json();
    expect(Number(updated.price)).toBe(975000);
    expect(updated.bedrooms).toBe(5);
    expect(updated.latitude).toBeCloseTo(-24.6286, 3);
    expect(updated.longitude).toBeCloseTo(25.9239, 3);

    const unpublishResponse = await request.put(`/api/properties/${property.id}`, {
      headers: authHeaders,
      data: {
        status: 'inactive'
      }
    });
    expect(unpublishResponse).toBeOK();
    const unpublished = await unpublishResponse.json();
    expect(unpublished.status).toBe('inactive');
  });
});
