import { test, expect } from '@playwright/test';
import { createProperty, registerUser, uniqueEmail } from './utils/api';

test.describe('Anonymous discovery experience', () => {
  test('searching by district with filters surfaces seeded listing metadata', async ({ request }) => {
    const auth = await registerUser(request, {
      email: uniqueEmail('agent'),
      password: 'Secure!123',
      userType: 'agent'
    });

    const seededProperty = await createProperty(request, auth, {
      title: 'Playwright Verified Tlokweng Home',
      description: '3 bedroom semi-detached with secure parking',
      price: "5800",
      address: 'Plot 100 Tlokweng',
      city: 'Tlokweng',
      state: 'South East District',
      zipCode: '0000',
      propertyType: 'house',
      listingType: 'rent',
      bedrooms: 3,
      bathrooms: 2,
      latitude: -24.6282,
      longitude: 25.9231,
      features: ['Fibre ready', 'Stand-alone cottage'],
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80']
    });

    const searchStart = Date.now();
    const response = await request.get('/api/properties', {
      params: {
        city: 'Tlokweng',
        minBedrooms: 3,
        maxPrice: 6000,
        propertyType: 'house',
        sortBy: 'price',
        sortOrder: 'asc',
        status: 'active',
        limit: 10,
        offset: 0
      }
    });
    const elapsed = Date.now() - searchStart;

    expect(response).toBeOK();
    expect(elapsed, 'Search response should be fast enough for smoke budget').toBeLessThanOrEqual(5000);

    const listings = await response.json();
    expect(Array.isArray(listings), 'Search response should return array').toBe(true);
    const match = listings.find((listing: any) => listing.id === seededProperty.id);
    expect(match, 'Seeded property should be returned within filtered results').toBeTruthy();

    expect(match.city).toBe('Tlokweng');
    expect(match.propertyType).toBe('house');
    expect(match.bedrooms).toBeGreaterThanOrEqual(3);
    expect(Number(match.price)).toBeLessThanOrEqual(6000);
    expect(match.latitude).toBeCloseTo(-24.6282, 3);
    expect(match.longitude).toBeCloseTo(25.9231, 3);
  });

  test('property details require authentication for marketplace contact', async ({ request }) => {
    const unauthResponse = await request.post('/api/providers/1/contact', {
      data: {
        message: 'Interested in your architectural services',
        contact_preference: 'email'
      }
    });

    expect(unauthResponse.status(), 'Contact actions should be gated by auth').toBe(401);
  });
});
