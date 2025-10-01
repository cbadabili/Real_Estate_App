import { db } from "./db";
import { serviceProviders } from "../shared/services-schema";

type ServiceProviderInsert = typeof serviceProviders.$inferInsert;

type RawProvider = {
  companyName: string;
  serviceCategory: string;
  description?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  phoneNumber?: string;
  email?: string;
  websiteUrl?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  rating?: number | string;
  reviewCount?: number | string;
  verified?: boolean;
  featured?: boolean;
  reacCertified?: boolean;
  dateJoined?: Date | string;
};

export async function seedServices() {
  console.log('Seeding services...');

  // Check if service providers already exist
  const existingProviders = await db.select().from(serviceProviders).limit(1);
  if (existingProviders.length > 0) {
    console.log('✅ Service providers already exist, skipping...');
    return;
  }

  // Sample service providers data
  const sampleProviders: RawProvider[] = [
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
    },
    {
      companyName: "ProFix Maintenance",
      serviceCategory: "Maintenance",
      contactPerson: "Thabo Marumo",
      phoneNumber: "72098765",
      email: "thabo@profix.bw",
      description: "Comprehensive property maintenance including garden, pool, and security services.",
      address: "Plot 789, Maun",
      city: "Maun",
      rating: 4.5,
      verified: true,
      featured: false,
      dateJoined: new Date('2023-03-01'),
    },
    {
      companyName: "Botswana Architectural Solutions",
      serviceCategory: "Architectural Services",
      contactPerson: "Dr. Keabetswe Moeti",
      phoneNumber: "72555666",
      email: "info@bwarchitects.bw",
      websiteUrl: "https://bwarchitects.bw",
      description: "Professional architectural services specializing in residential and commercial building design with focus on sustainable architecture for Botswana's climate.",
      address: "Plot 1234, CBD Square",
      city: "Gaborone",
      rating: 4.9,
      verified: true,
      featured: true,
      reacCertified: true,
      dateJoined: new Date('2022-01-15'),
    },
    {
      companyName: "Premier Quantity Surveyors",
      serviceCategory: "Quantity Surveying",
      contactPerson: "Mpho Sebego",
      phoneNumber: "71777888",
      email: "mpho@premierqs.bw",
      websiteUrl: "https://premierqs.bw",
      description: "Expert quantity surveying services providing accurate cost estimation, project management, and contract administration for construction projects across Botswana.",
      address: "Plot 567, Industrial Area",
      city: "Francistown",
      rating: 4.7,
      verified: true,
      featured: false,
      reacCertified: false,
      dateJoined: new Date('2022-06-20'),
    },
    {
      companyName: "Structural Engineering Consultants BW",
      serviceCategory: "Structural Engineering",
      contactPerson: "Eng. Goitse Modise",
      phoneNumber: "73999000",
      email: "goitse@structuraleng.bw",
      websiteUrl: "https://structuraleng.bw",
      description: "Professional structural engineering services including structural analysis, foundation design, and building assessment for residential and commercial projects.",
      address: "Plot 890, Extension 6",
      city: "Gaborone",
      rating: 4.8,
      verified: true,
      featured: true,
      reacCertified: false,
      dateJoined: new Date('2022-03-10'),
    }
  ];

  // Insert service providers
  const normalizedProviders: ServiceProviderInsert[] = sampleProviders.map(provider => {
    const ratingRaw = typeof provider.rating === 'string'
      ? Number.parseFloat(provider.rating)
      : typeof provider.rating === 'number'
        ? provider.rating
        : undefined;

    const ratingValue = typeof ratingRaw === 'number' && Number.isFinite(ratingRaw) ? ratingRaw : undefined;

    const reviewCountRaw = typeof provider.reviewCount === 'string'
      ? Number.parseInt(provider.reviewCount, 10)
      : typeof provider.reviewCount === 'number'
        ? provider.reviewCount
        : undefined;

    const reviewCountValue = typeof reviewCountRaw === 'number' && Number.isFinite(reviewCountRaw) ? reviewCountRaw : undefined;

    const dateJoined = provider.dateJoined instanceof Date
      ? provider.dateJoined
      : provider.dateJoined
        ? new Date(provider.dateJoined)
        : new Date();

    return {
      companyName: provider.companyName,
      serviceCategory: provider.serviceCategory,
      description: provider.description ?? null,
      contactPerson: provider.contactPerson ?? null,
      phoneNumber: provider.contactPhone ?? provider.phoneNumber ?? null,
      email: provider.contactEmail ?? provider.email ?? null,
      websiteUrl: provider.websiteUrl ?? null,
      logoUrl: provider.logoUrl ?? null,
      address: provider.address ?? null,
      city: provider.city ?? null,
      rating: ratingValue,
      reviewCount: reviewCountValue,
      verified: Boolean(provider.verified),
      featured: Boolean(provider.featured),
      reacCertified: Boolean(provider.reacCertified),
      dateJoined,
    } satisfies ServiceProviderInsert;
  });

  await db.insert(serviceProviders).values(normalizedProviders);

  console.log('✅ Services seeded successfully');
}