import { test, expect } from '@playwright/test';
import { createProperty, registerUser, saveFavorite, unsaveFavorite, scheduleViewing } from './utils/api';

const uniqueEmail = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;

test.describe('Buyer engagement journeys', () => {
  test('buyer can save listings, schedule viewings, and manage state', async ({ request }) => {
    const agent = await registerUser(request, {
      email: uniqueEmail('agent'),
      password: 'Secure!123',
      userType: 'agent'
    });

    const property = await createProperty(request, agent, {
      title: 'Francistown Garden Apartment',
      price: 4800,
      address: 'Plot 12, Satellite, Francistown',
      city: 'Francistown',
      state: 'North East District',
      zipCode: '0020',
      propertyType: 'apartment',
      listingType: 'rent',
      bedrooms: 2,
      bathrooms: 1,
      latitude: -21.159,
      longitude: 27.514
    });

    const buyer = await registerUser(request, {
      email: uniqueEmail('buyer'),
      password: 'Secure!123',
      userType: 'buyer'
    });

    await saveFavorite(request, buyer, property.id);

    const authHeaders = { Authorization: `Bearer ${buyer.token}` };

    const favoritesResponse = await request.get(`/api/users/${buyer.userId}/saved-properties`, {
      headers: authHeaders
    });
    expect(favoritesResponse).toBeOK();
    const favorites = await favoritesResponse.json();
    expect(Array.isArray(favorites)).toBe(true);
    expect(
      favorites.some((fav: any) => Number(fav.propertyId ?? fav.id) === Number(property.id))
    ).toBe(true);

    const viewingResponse = await scheduleViewing(
      request,
      buyer,
      property.id,
      new Date(Date.now() + 86400000).toISOString()
    );
    expect(viewingResponse).toBeOK();
    const viewing = await viewingResponse.json();
    expect(viewing.propertyId ?? viewing.property_id).toBe(property.id);
    expect(new Date(viewing.appointmentDate ?? viewing.appointment_date).getTime()).toBeGreaterThan(Date.now());

    await unsaveFavorite(request, buyer, property.id);
    const afterUnsave = await request.get(`/api/users/${buyer.userId}/saved-properties`, {
      headers: authHeaders
    });
    expect(afterUnsave).toBeOK();
    const updatedFavorites = await afterUnsave.json();
    expect(Array.isArray(updatedFavorites)).toBe(true);
    expect(
      updatedFavorites.some(
        (fav: any) => Number(fav.propertyId ?? fav.id) === Number(property.id)
      )
    ).toBe(false);
  });
});
