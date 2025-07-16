import { db } from "./db";
import { users, service_categories, marketplace_providers } from "@shared/schema";
import { eq } from "drizzle-orm";
import { seedServices } from './services-seed';
import { seedMarketplace } from './marketplace-seed';
import { seedRentals } from './rental-seed';

export class SeedManager {
  async seedUsers() {
    console.log('Seeding users...');

    // Check if users already exist
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log('✅ Users already exist, skipping...');
      return;
    }

    const testUsers = [
      {
        username: "admin",
        email: "admin@beedab.bw",
        password: "$2b$10$hash", // In real app, hash this properly
        firstName: "Admin",
        lastName: "User",
        userType: "admin",
        role: "admin",
        isVerified: true,
        isActive: true
      },
      {
        username: "thabo_agent",
        email: "thabo@bwprimeproperties.bw",
        password: "$2b$10$hash",
        firstName: "Thabo",
        lastName: "Motlhabi",
        userType: "agent",
        role: "user",
        isVerified: true,
        isActive: true,
        reacNumber: "REAC001"
      },
      {
        username: "mpho_supplier",
        email: "mpho@kalaharibuild.bw",
        password: "$2b$10$hash",
        firstName: "Mpho",
        lastName: "Kgathi",
        userType: "seller",
        role: "user",
        isVerified: true,
        isActive: true
      },
      {
        username: "tebogo_builder",
        email: "tebogo@masterbuilders.bw",
        password: "$2b$10$hash",
        firstName: "Tebogo",
        lastName: "Seretse",
        userType: "seller",
        role: "user",
        isVerified: true,
        isActive: true
      },
      {
        username: "kefilwe_trainer",
        email: "kefilwe@skillsacademy.bw",
        password: "$2b$10$hash",
        firstName: "Kefilwe",
        lastName: "Mogami",
        userType: "seller",
        role: "user",
        isVerified: true,
        isActive: true
      }
    ];

    const insertedUsers = await db.insert(users).values(testUsers).returning();
    console.log(`✅ Inserted ${insertedUsers.length} users`);
  }

  async seedServiceCategories() {
    console.log('Seeding service categories...');

    const existingCategories = await db.select().from(service_categories).limit(1);
    if (existingCategories.length > 0) {
      console.log('✅ Service categories already exist, skipping...');
      return;
    }

    const categories = [
      { name: "Real Estate Agents", journey_type: "transaction", icon: "🏠", description: "Licensed real estate professionals", sort_order: 1 },
      { name: "Property Lawyers", journey_type: "transaction", icon: "⚖️", description: "Legal services for property transactions", sort_order: 2 },
      { name: "Mortgage Brokers", journey_type: "transaction", icon: "💰", description: "Financing and mortgage services", sort_order: 3 },
      { name: "Property Valuers", journey_type: "transaction", icon: "📊", description: "Property valuation and assessment", sort_order: 4 },
      { name: "Insurance Brokers", journey_type: "transaction", icon: "🛡️", description: "Property and homeowner insurance", sort_order: 5 },
      { name: "Architects", journey_type: "development", icon: "📐", description: "Building design and architectural services", sort_order: 6 },
      { name: "Construction Companies", journey_type: "development", icon: "🏗️", description: "General construction and building services", sort_order: 7 },
      { name: "Project Managers", journey_type: "development", icon: "👷", description: "Construction project management", sort_order: 8 },
      { name: "Structural Engineers", journey_type: "development", icon: "🔧", description: "Structural engineering and design", sort_order: 9 },
      { name: "Quantity Surveyors", journey_type: "development", icon: "📋", description: "Cost estimation and project surveying", sort_order: 10 },
      { name: "Property Managers", journey_type: "ownership", icon: "🏢", description: "Property maintenance and management", sort_order: 11 },
      { name: "Maintenance Services", journey_type: "ownership", icon: "🔧", description: "General maintenance and repairs", sort_order: 12 },
      { name: "Cleaning Services", journey_type: "ownership", icon: "🧹", description: "Professional cleaning services", sort_order: 13 },
      { name: "Security Services", journey_type: "ownership", icon: "🔒", description: "Property security and monitoring", sort_order: 14 },
      { name: "Landscaping", journey_type: "ownership", icon: "🌱", description: "Garden and landscape services", sort_order: 15 },
      { name: "Construction Training", journey_type: "skills", icon: "👷‍♂️", description: "Construction and building skills training", sort_order: 16 },
      { name: "Real Estate Training", journey_type: "skills", icon: "🏠", description: "Real estate professional training", sort_order: 17 },
      { name: "Technical Skills", journey_type: "skills", icon: "🔧", description: "Technical and trade skills training", sort_order: 18 },
      { name: "Business Skills", journey_type: "skills", icon: "💼", description: "Business and entrepreneurship training", sort_order: 19 },
      { name: "Safety Training", journey_type: "skills", icon: "⚠️", description: "Workplace safety and compliance training", sort_order: 20 }
    ];

    const insertedCategories = await db.insert(service_categories).values(categories).returning();
    console.log(`✅ Inserted ${insertedCategories.length} service categories`);
  }

  async seedMarketplaceProviders() {
    console.log('Seeding marketplace providers...');

    const existingProviders = await db.select().from(marketplace_providers).limit(1);
    if (existingProviders.length > 0) {
      console.log('✅ Marketplace providers already exist, skipping...');
      return;
    }

    // Get required data
    const allUsers = await db.select().from(users);
    const allCategories = await db.select().from(service_categories);

    if (allUsers.length === 0 || allCategories.length === 0) {
      throw new Error('Users and service categories must be seeded first');
    }

    const reAgentCategory = allCategories.find(c => c.name === "Real Estate Agents");
    const constructionCategory = allCategories.find(c => c.name === "Construction Companies");
    const trainingCategory = allCategories.find(c => c.name === "Construction Training");

    const providers = [
      {
        user_id: allUsers.find(u => u.username === "thabo_agent")?.id,
        provider_type: "professional",
        business_name: "Botswana Prime Properties",
        category_id: reAgentCategory?.id,
        specializations: JSON.stringify(["Residential Sales", "Commercial Properties", "Investment Properties"]),
        service_areas: JSON.stringify(["Gaborone", "Tlokweng", "Phakalane"]),
        contact_person: "Thabo Motlhabi",
        phone: "72123456",
        email: "info@bwprimeproperties.bw",
        whatsapp: "72123456",
        website: "https://bwprimeproperties.bw",
        description: "Leading real estate agency in Botswana with over 15 years of experience in residential and commercial property sales.",
        years_experience: 15,
        is_verified: 1,
        is_featured: 1,
        reac_certified: 1,
        business_address: "Plot 12345, CBD, Gaborone",
        operating_hours: JSON.stringify({"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00", "saturday": "09:00-14:00", "sunday": "closed"}),
        service_radius: 50,
        rating: 4.8,
        review_count: 127,
        projects_completed: 450,
        response_time: 2,
        availability_status: "available",
        minimum_project_size: 50000,
        maximum_project_size: 5000000,
        hourly_rate: 15000,
        emergency_services: 1,
        warranty_period: 12,
        payment_terms: JSON.stringify(["50% upfront", "50% on completion"]),
        payment_methods: JSON.stringify(["Cash", "Bank Transfer", "Orange Money"]),
        portfolio_images: JSON.stringify(["/images/portfolio/bw-prime-1.jpg", "/images/portfolio/bw-prime-2.jpg"]),
        certifications: JSON.stringify(["REAC Certified", "BQA Approved"]),
        languages_spoken: JSON.stringify(["English", "Setswana"]),
        team_size: 8
      },
      {
        user_id: allUsers.find(u => u.username === "mpho_supplier")?.id,
        provider_type: "supplier",
        business_name: "Kalahari Building Supplies",
        category_id: constructionCategory?.id,
        specializations: JSON.stringify(["Cement", "Bricks", "Roofing Materials", "Plumbing Supplies"]),
        service_areas: JSON.stringify(["Gaborone", "Francistown", "Maun"]),
        contact_person: "Mpho Kgathi",
        phone: "71234567",
        email: "orders@kalaharibuild.bw",
        description: "Comprehensive building materials supplier serving contractors and individuals across Botswana.",
        years_experience: 10,
        is_verified: 1,
        is_featured: 1,
        business_address: "Plot 67890, Industrial Area, Gaborone",
        operating_hours: JSON.stringify({"monday": "07:00-17:00", "tuesday": "07:00-17:00", "wednesday": "07:00-17:00", "thursday": "07:00-17:00", "friday": "07:00-17:00", "saturday": "08:00-14:00", "sunday": "closed"}),
        service_radius: 200,
        rating: 4.5,
        review_count: 89,
        projects_completed: 300,
        response_time: 4,
        availability_status: "available",
        minimum_project_size: 10000,
        maximum_project_size: 2000000,
        daily_rate: 50000,
        emergency_services: 1,
        warranty_period: 6,
        payment_terms: JSON.stringify(["30% deposit", "70% on delivery"]),
        payment_methods: JSON.stringify(["Cash", "Bank Transfer", "Credit Card"]),
        portfolio_images: JSON.stringify(["/images/portfolio/kalahari-1.jpg", "/images/portfolio/kalahari-2.jpg"]),
        certifications: JSON.stringify(["ISO 9001", "Building Materials Council Certified"]),
        languages_spoken: JSON.stringify(["English", "Setswana", "Afrikaans"]),
        team_size: 15
      }
    ];

    const insertedProviders = await db.insert(marketplace_providers).values(providers).returning();
    console.log(`✅ Inserted ${insertedProviders.length} marketplace providers`);
  }

  async seedAll() {
    console.log('🌱 Starting complete database seeding...');

    try {
      await this.seedUsers();
      await this.seedServiceCategories();
      await this.seedMarketplaceProviders();

  // Seed services
  await seedServices(db);

  // Seed marketplace
  await seedMarketplace(db);

  // Seed rentals
  await seedRentals();

      console.log('✅ All seeding completed successfully');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }
}

export const seedManager = new SeedManager();