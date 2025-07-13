import { db } from "./db";
import { serviceProviders, serviceAds, serviceReviews } from "@shared/services-schema";
import { eq } from "drizzle-orm";

export async function seedServices() {
  console.log("Seeding services data...");

  // Sample service providers
  const providers = [
    // Construction Services
    {
      companyName: "Botswana Builders Ltd",
      serviceCategory: "Construction",
      contactPerson: "Kabelo Moeng",
      phoneNumber: "72556677",
      email: "projects@botswanabuilders.bw",
      websiteUrl: "https://botswanabuilders.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Leading construction company in Botswana specializing in residential and commercial buildings. REAC certified with 15+ years experience.",
      reacCertified: true,
      address: "Plot 50123, Broadhurst Industrial",
      city: "Gaborone",
      rating: "4.7",
      reviewCount: 89,
      verified: true,
      featured: true
    },
    {
      companyName: "Heritage Construction",
      serviceCategory: "Construction",
      contactPerson: "Thabo Kgathi",
      phoneNumber: "71445588",
      email: "info@heritageconst.bw",
      websiteUrl: "https://heritageconst.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Specializing in luxury residential construction and renovations across Botswana. Award-winning designs and quality craftsmanship.",
      reacCertified: false,
      address: "Plot 789, Phakalane",
      city: "Gaborone",
      rating: "4.5",
      reviewCount: 56,
      verified: true,
      featured: false
    },

    // Photography Services
    {
      companyName: "Motswana Visuals",
      serviceCategory: "Photography",
      contactPerson: "Thabo Molefi",
      phoneNumber: "72445566",
      email: "info@motswanavisuals.bw",
      websiteUrl: "https://motswanavisuals.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Professional property photography and virtual tours across Botswana. Specializing in real estate marketing with drone photography and 360° virtual tours.",
      reacCertified: true,
      address: "Plot 123, Broadhurst",
      city: "Gaborone",
      rating: "4.8",
      reviewCount: 47,
      verified: true,
      featured: true
    },
    {
      companyName: "Kalahari Photos",
      serviceCategory: "Photography",
      contactPerson: "Neo Seretse",
      phoneNumber: "71332211",
      email: "bookings@kalahariphoto.bw",
      websiteUrl: "https://kalahariphoto.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Award-winning real estate photography serving Gaborone and surrounding areas. Fast turnaround with professional editing and marketing packages.",
      reacCertified: false,
      address: "Block 6, Old Naledi",
      city: "Gaborone",
      rating: "4.6",
      reviewCount: 32,
      verified: true,
      featured: false
    },

    // Legal Services
    {
      companyName: "Mogapi & Associates",
      serviceCategory: "Legal",
      contactPerson: "Advocate Kabo Mogapi",
      phoneNumber: "3951234",
      email: "info@mogapilaw.bw",
      websiteUrl: "https://mogapilaw.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Leading property law firm in Botswana. Specializing in conveyancing, property transfers, and real estate transactions. Over 15 years of experience.",
      reacCertified: true,
      address: "Prime Plaza, CBD",
      city: "Gaborone",
      rating: "4.9",
      reviewCount: 156,
      verified: true,
      featured: true
    },
    {
      companyName: "Setlhare Legal Practice",
      serviceCategory: "Legal",
      contactPerson: "Mma Setlhare",
      phoneNumber: "2413789",
      email: "legal@setlharelaw.bw",
      websiteUrl: "https://setlharelaw.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Boutique law firm focusing on residential property law, wills, and estate planning. Personal service with competitive rates.",
      reacCertified: true,
      address: "Masa Centre",
      city: "Francistown",
      rating: "4.7",
      reviewCount: 89,
      verified: true,
      featured: false
    },

    // Moving Services
    {
      companyName: "Diamond Movers",
      serviceCategory: "Moving",
      contactPerson: "Tebogo Phiri",
      phoneNumber: "73998877",
      email: "moves@diamondmovers.bw",
      websiteUrl: "https://diamondmovers.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Professional moving services across Botswana. Residential and commercial relocations with full insurance coverage. Packing services available.",
      reacCertified: false,
      address: "Industrial Area",
      city: "Gaborone",
      rating: "4.5",
      reviewCount: 78,
      verified: true,
      featured: true
    },

    // Finance Services
    {
      companyName: "BotsBond Mortgage Brokers",
      serviceCategory: "Finance",
      contactPerson: "Lesego Tshwane",
      phoneNumber: "3951122",
      email: "enquiries@botsbond.bw",
      websiteUrl: "https://botsbond.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Leading mortgage brokers in Botswana. We help you secure the best home loan rates from all major banks. Free consultation and pre-approval services.",
      reacCertified: true,
      address: "Fairgrounds Office Park",
      city: "Gaborone",
      rating: "4.8",
      reviewCount: 234,
      verified: true,
      featured: true
    },
    {
      companyName: "PropertyFin Solutions",
      serviceCategory: "Finance",
      contactPerson: "Mpho Molefe",
      phoneNumber: "2414567",
      email: "info@propertyfin.bw",
      websiteUrl: "https://propertyfin.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Specialized property finance consultancy. Investment property loans, development finance, and bond origination services.",
      reacCertified: false,
      address: "Blue Jacket Street",
      city: "Francistown",
      rating: "4.6",
      reviewCount: 67,
      verified: true,
      featured: false
    },

    // Insurance Services
    {
      companyName: "Botswana Shield Insurance",
      serviceCategory: "Insurance",
      contactPerson: "Onalenna Moeti",
      phoneNumber: "3906789",
      email: "claims@bwshield.bw",
      websiteUrl: "https://bwshield.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Comprehensive property and homeowner insurance. Competitive rates with excellent claims service. Special packages for new homeowners.",
      reacCertified: false,
      address: "Main Mall",
      city: "Gaborone",
      rating: "4.4",
      reviewCount: 145,
      verified: true,
      featured: false
    },

    // Cleaning Services
    {
      companyName: "Sparkle Clean Botswana",
      serviceCategory: "Cleaning",
      contactPerson: "Gladys Keetile",
      phoneNumber: "74556677",
      email: "bookings@sparkleclean.bw",
      websiteUrl: "https://sparkleclean.bw",
      logoUrl: "/api/placeholder/100/100",
      description: "Professional move-in/move-out cleaning services. Deep cleaning, carpet cleaning, and post-construction cleanup. Insured and bonded.",
      reacCertified: false,
      address: "Extension 12",
      city: "Gaborone",
      rating: "4.7",
      reviewCount: 92,
      verified: true,
      featured: false
    }
  ];

  // Check if services data already exists
  try {
    const existingProviders = await db.select().from(serviceProviders).limit(1);
    
    if (existingProviders.length > 0) {
      console.log("✅ Services data already exists, skipping seeding...");
      return;
    }
  } catch (error) {
    // Table might not exist yet, continue with seeding
    console.log("No existing services data found, proceeding with seeding...");
  }

  // Insert providers
  const insertedProviders = await db.insert(serviceProviders).values(providers).returning();
  console.log(`Inserted ${insertedProviders.length} service providers`);

  // Sample contextual ads
  const ads = [
    // Photo upload trigger
    {
      providerId: insertedProviders.find(p => p.companyName === "Motswana Visuals")?.id,
      adTitle: "Professional Photos = Faster Sales",
      adCopy: "Great photos uploaded! Consider professional photography to showcase your property's best features and sell 3x faster.",
      adImageUrl: "/api/placeholder/300/200",
      targetAudience: "Seller",
      contextTrigger: "post_photo_upload",
      ctaText: "Book Photoshoot",
      ctaUrl: "/services/provider/1",
      active: true,
      priority: 5
    },
    
    // Mortgage calculation trigger
    {
      providerId: insertedProviders.find(p => p.companyName === "BotsBond Mortgage Brokers")?.id,
      adTitle: "Ready to Get Pre-Approved?",
      adCopy: "Great calculation! Our mortgage experts can help you get pre-approved and secure better rates from all major banks.",
      adImageUrl: "/api/placeholder/300/200",
      targetAudience: "Buyer",
      contextTrigger: "after_mortgage_calculation",
      ctaText: "Get Pre-Approved",
      ctaUrl: "/services/provider/5",
      active: true,
      priority: 5
    },
    
    // Property listing creation
    {
      providerId: insertedProviders.find(p => p.companyName === "Mogapi & Associates")?.id,
      adTitle: "Legal Documents Ready?",
      adCopy: "Listing created! Ensure all your legal documents are in order for a smooth sale process.",
      adImageUrl: "/api/placeholder/300/200",
      targetAudience: "Seller",
      contextTrigger: "property_listing_created",
      ctaText: "Legal Review",
      ctaUrl: "/services/provider/3",
      active: true,
      priority: 4
    },
    
    // Offer received
    {
      providerId: insertedProviders.find(p => p.companyName === "Setlhare Legal Practice")?.id,
      adTitle: "Offer Received - Legal Assistance",
      adCopy: "Congratulations on your offer! Get legal support to review terms and ensure a secure transaction.",
      adImageUrl: "/api/placeholder/300/200",
      targetAudience: "Seller",
      contextTrigger: "offer_received",
      ctaText: "Legal Support",
      ctaUrl: "/services/provider/4",
      active: true,
      priority: 5
    },
    
    // Moving day approaching
    {
      providerId: insertedProviders.find(p => p.companyName === "Diamond Movers")?.id,
      adTitle: "Moving Day Stress-Free",
      adCopy: "Sale complete! Let professional movers handle your relocation so you can focus on settling into your new home.",
      adImageUrl: "/api/placeholder/300/200",
      targetAudience: "Seller",
      contextTrigger: "sale_completed",
      ctaText: "Book Movers",
      ctaUrl: "/services/provider/5",
      active: true,
      priority: 3
    },
    
    // New homeowner
    {
      providerId: insertedProviders.find(p => p.companyName === "Botswana Shield Insurance")?.id,
      adTitle: "Protect Your New Investment",
      adCopy: "Welcome home! Secure comprehensive insurance coverage for your new property with competitive rates.",
      adImageUrl: "/api/placeholder/300/200",
      targetAudience: "Buyer",
      contextTrigger: "purchase_completed",
      ctaText: "Get Quote",
      ctaUrl: "/services/provider/7",
      active: true,
      priority: 4
    }
  ];

  // Insert ads
  const insertedAds = await db.insert(serviceAds).values(ads).returning();
  console.log(`Inserted ${insertedAds.length} contextual ads`);

  // Sample reviews
  const reviews = [
    // Motswana Visuals reviews
    {
      providerId: insertedProviders.find(p => p.companyName === "Motswana Visuals")?.id,
      rating: 5,
      review: "Outstanding professional photography! The virtual tour helped sell our house in just 2 weeks. Highly recommended.",
      reviewerName: "Tshepo M.",
      reviewerAvatar: "/api/placeholder/40/40",
      verified: true,
      helpful: 12
    },
    {
      providerId: insertedProviders.find(p => p.companyName === "Motswana Visuals")?.id,
      rating: 5,
      review: "Drone footage was amazing! Really showcased our property's location perfectly.",
      reviewerName: "Grace K.",
      reviewerAvatar: "/api/placeholder/40/40",
      verified: true,
      helpful: 8
    },
    
    // Mogapi & Associates reviews
    {
      providerId: insertedProviders.find(p => p.companyName === "Mogapi & Associates")?.id,
      rating: 5,
      review: "Excellent legal service. Made the property transfer process smooth and stress-free. Great communication throughout.",
      reviewerName: "Mothusi R.",
      reviewerAvatar: "/api/placeholder/40/40",
      verified: true,
      helpful: 15
    },
    {
      providerId: insertedProviders.find(p => p.companyName === "Mogapi & Associates")?.id,
      rating: 5,
      review: "Professional and efficient. Completed our property registration quickly with no issues.",
      reviewerName: "Kefilwe S.",
      reviewerAvatar: "/api/placeholder/40/40",
      verified: true,
      helpful: 9
    },
    
    // BotsBond reviews
    {
      providerId: insertedProviders.find(p => p.companyName === "BotsBond Mortgage Brokers")?.id,
      rating: 5,
      review: "Secured an excellent mortgage rate! The team was helpful and found options I didn't know existed.",
      reviewerName: "Phillip M.",
      reviewerAvatar: "/api/placeholder/40/40",
      verified: true,
      helpful: 18
    }
  ];

  // Insert reviews
  const insertedReviews = await db.insert(serviceReviews).values(reviews).returning();
  console.log(`Inserted ${insertedReviews.length} service reviews`);

  console.log("Services seeding completed!");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedServices()
    .then(() => {
      console.log("Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}