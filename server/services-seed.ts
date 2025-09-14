
import { db } from "./db";
import { serviceProviders, serviceAds, serviceReviews } from "../shared/services-schema";

export async function seedServices() {
  console.log('Seeding services...');

  // Check if service providers already exist
  const existingProviders = await db.select().from(serviceProviders).limit(1);
  if (existingProviders.length > 0) {
    console.log('✅ Service providers already exist, skipping...');
    return;
  }

  // Sample service providers data
  const sampleProviders = [
    {
      companyName: 'Elite Property Solutions',
      serviceCategory: 'Real Estate Agent',
      description: 'Professional real estate services in Gaborone and surrounding areas',
      contactEmail: 'info@eliteproperties.bw',
      contactPhone: '+267 71 234 567',
      city: 'Gaborone',
      rating: '4.8',
      reviewCount: 127,
      verified: true,
      featured: true,
      reacCertified: true,
      dateJoined: new Date()
    },
    {
      companyName: 'Botswana Property Valuers',
      serviceCategory: 'Property Valuer',
      description: 'Certified property valuation services across Botswana',
      contactEmail: 'valuations@bwvaluers.bw',
      contactPhone: '+267 72 345 678',
      city: 'Francistown',
      rating: '4.9',
      reviewCount: 89,
      verified: true,
      featured: false,
      reacCertified: true,
      dateJoined: new Date()
    },
    {
      companyName: 'Legal Conveyancing Services',
      serviceCategory: 'Conveyancer',
      description: 'Property transfer and legal services',
      contactEmail: 'legal@conveyancing.bw',
      contactPhone: '+267 73 456 789',
      city: 'Gaborone',
      rating: '4.7',
      reviewCount: 156,
      verified: true,
      featured: true,
      reacCertified: false,
      dateJoined: new Date()
    }
  ];

  // Insert service providers
  await db.insert(serviceProviders).values(sampleProviders);

  console.log('✅ Services seeded successfully');
}
