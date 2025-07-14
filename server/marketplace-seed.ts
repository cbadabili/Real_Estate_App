
import { db } from "./db";
import { 
  service_categories, 
  marketplace_providers, 
  artisan_skills, 
  training_programs,
  building_materials,
  project_requests
} from "@shared/schema";

export async function seedMarketplace() {
  console.log("Seeding marketplace data...");

  // Check if marketplace data already exists
  try {
    const existingProviders = await db.select().from(marketplace_providers).limit(1);
    
    if (existingProviders.length > 0) {
      console.log("✅ Marketplace data already exists, skipping seeding...");
      return;
    }
  } catch (error) {
    console.log("No existing marketplace data found, proceeding with seeding...");
  }

  // Service Categories
  const categories = [
    // Transaction Lifecycle
    { name: "Real Estate Agents", journey_type: "transaction", icon: "🏠", description: "Licensed real estate professionals", sort_order: 1 },
    { name: "Property Lawyers", journey_type: "transaction", icon: "⚖️", description: "Legal services for property transactions", sort_order: 2 },
    { name: "Mortgage Brokers", journey_type: "transaction", icon: "💰", description: "Financing and mortgage services", sort_order: 3 },
    { name: "Property Valuers", journey_type: "transaction", icon: "📊", description: "Property valuation and assessment", sort_order: 4 },
    { name: "Insurance Brokers", journey_type: "transaction", icon: "🛡️", description: "Property and homeowner insurance", sort_order: 5 },

    // Development Lifecycle
    { name: "Architects", journey_type: "development", icon: "📐", description: "Building design and architectural services", sort_order: 6 },
    { name: "Construction Companies", journey_type: "development", icon: "🏗️", description: "General construction and building services", sort_order: 7 },
    { name: "Project Managers", journey_type: "development", icon: "👷", description: "Construction project management", sort_order: 8 },
    { name: "Structural Engineers", journey_type: "development", icon: "🔧", description: "Structural engineering and design", sort_order: 9 },
    { name: "Quantity Surveyors", journey_type: "development", icon: "📋", description: "Cost estimation and project surveying", sort_order: 10 },

    // Ownership Lifecycle
    { name: "Property Managers", journey_type: "ownership", icon: "🏢", description: "Property maintenance and management", sort_order: 11 },
    { name: "Maintenance Services", journey_type: "ownership", icon: "🔧", description: "General maintenance and repairs", sort_order: 12 },
    { name: "Cleaning Services", journey_type: "ownership", icon: "🧹", description: "Professional cleaning services", sort_order: 13 },
    { name: "Security Services", journey_type: "ownership", icon: "🔒", description: "Property security and monitoring", sort_order: 14 },
    { name: "Landscaping", journey_type: "ownership", icon: "🌱", description: "Garden and landscape services", sort_order: 15 },

    // Skills & Training
    { name: "Construction Training", journey_type: "skills", icon: "👷‍♂️", description: "Construction and building skills training", sort_order: 16 },
    { name: "Real Estate Training", journey_type: "skills", icon: "🏠", description: "Real estate professional training", sort_order: 17 },
    { name: "Technical Skills", journey_type: "skills", icon: "🔧", description: "Technical and trade skills training", sort_order: 18 },
    { name: "Business Skills", journey_type: "skills", icon: "💼", description: "Business and entrepreneurship training", sort_order: 19 },
    { name: "Safety Training", journey_type: "skills", icon: "⚠️", description: "Workplace safety and compliance training", sort_order: 20 },
  ];

  const insertedCategories = await db.insert(service_categories).values(categories).returning();
  console.log(`Inserted ${insertedCategories.length} service categories`);

  // Marketplace Providers
  const providers = [
    // Professional Services
    {
      user_id: 1,
      provider_type: "professional",
      business_name: "Botswana Prime Properties",
      category_id: insertedCategories.find(c => c.name === "Real Estate Agents")?.id,
      specializations: JSON.stringify(["Residential Sales", "Commercial Properties", "Investment Properties"]),
      service_areas: JSON.stringify(["Gaborone", "Tlokweng", "Phakalane"]),
      contact_person: "Thabo Motlhabi",
      phone: "72123456",
      email: "info@bwprimeproperties.bw",
      whatsapp: "72123456",
      website: "https://bwprimeproperties.bw",
      description: "Leading real estate agency in Botswana with over 15 years of experience in residential and commercial property sales.",
      years_experience: 15,
      is_verified: true,
      is_featured: true,
      reac_certified: true,
      business_address: "Plot 12345, CBD, Gaborone",
      operating_hours: JSON.stringify({"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00", "saturday": "09:00-14:00", "sunday": "closed"}),
      service_radius: 50,
      rating: 4.8,
      review_count: 127,
      projects_completed: 450,
      response_time: 2,
      availability_status: "available"
    },

    // Supplier
    {
      user_id: 2,
      provider_type: "supplier",
      business_name: "Kalahari Building Supplies",
      category_id: insertedCategories.find(c => c.name === "Construction Companies")?.id,
      specializations: JSON.stringify(["Cement", "Bricks", "Roofing Materials", "Plumbing Supplies"]),
      service_areas: JSON.stringify(["Gaborone", "Francistown", "Maun"]),
      contact_person: "Mpho Kgathi",
      phone: "71234567",
      email: "orders@kalaharibuild.bw",
      description: "Comprehensive building materials supplier serving contractors and individuals across Botswana.",
      years_experience: 10,
      is_verified: true,
      is_featured: true,
      business_address: "Plot 67890, Industrial Area, Gaborone",
      operating_hours: JSON.stringify({"monday": "07:00-17:00", "tuesday": "07:00-17:00", "wednesday": "07:00-17:00", "thursday": "07:00-17:00", "friday": "07:00-17:00", "saturday": "08:00-14:00", "sunday": "closed"}),
      service_radius: 200,
      rating: 4.5,
      review_count: 89,
      projects_completed: 300,
      response_time: 4,
      availability_status: "available"
    },

    // Artisan/Trade
    {
      user_id: 3,
      provider_type: "artisan",
      business_name: "Botswana Master Builders",
      category_id: insertedCategories.find(c => c.name === "Construction Companies")?.id,
      specializations: JSON.stringify(["Bricklaying", "Plastering", "Tiling", "Roofing"]),
      service_areas: JSON.stringify(["Gaborone", "Lobatse", "Mochudi"]),
      contact_person: "Tebogo Seretse",
      phone: "73345678",
      email: "projects@masterbuilders.bw",
      description: "Expert construction team specializing in residential building and renovations with traditional and modern techniques.",
      years_experience: 12,
      is_verified: true,
      business_address: "Extension 2, Gaborone",
      operating_hours: JSON.stringify({"monday": "06:00-17:00", "tuesday": "06:00-17:00", "wednesday": "06:00-17:00", "thursday": "06:00-17:00", "friday": "06:00-17:00", "saturday": "07:00-15:00", "sunday": "closed"}),
      service_radius: 100,
      rating: 4.7,
      review_count: 56,
      projects_completed: 180,
      response_time: 3,
      availability_status: "available"
    },

    // Training Provider
    {
      user_id: 4,
      provider_type: "trainer",
      business_name: "Botswana Skills Academy",
      category_id: insertedCategories.find(c => c.name === "Construction Training")?.id,
      specializations: JSON.stringify(["Construction Skills", "Safety Training", "Equipment Operation", "Business Skills"]),
      service_areas: JSON.stringify(["Gaborone", "Francistown", "Maun", "Kasane"]),
      contact_person: "Dr. Kefilwe Mogami",
      phone: "74456789",
      email: "training@skillsacademy.bw",
      website: "https://skillsacademy.bw",
      description: "Leading skills training institution offering certified programs in construction, real estate, and technical skills.",
      years_experience: 8,
      is_verified: true,
      is_featured: true,
      business_address: "Plot 54321, Broadhurst, Gaborone",
      operating_hours: JSON.stringify({"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00", "saturday": "09:00-13:00", "sunday": "closed"}),
      service_radius: 500,
      rating: 4.9,
      review_count: 234,
      projects_completed: 1200,
      response_time: 1,
      availability_status: "available"
    }
  ];

  const insertedProviders = await db.insert(marketplace_providers).values(providers).returning();
  console.log(`Inserted ${insertedProviders.length} marketplace providers`);

  // Training Programs
  const trainingPrograms = [
    {
      provider_id: insertedProviders.find(p => p.business_name === "Botswana Skills Academy")?.id,
      program_name: "Construction Project Management",
      description: "Comprehensive course covering project planning, budgeting, scheduling, and team management for construction projects.",
      category: "construction",
      duration_hours: 80,
      duration_weeks: 10,
      price: 350000, // 3500 BWP in thebe
      max_participants: 25,
      prerequisites: "Basic construction knowledge or 2+ years experience",
      learning_outcomes: JSON.stringify([
        "Project planning and scheduling",
        "Budget management and cost control",
        "Team leadership and communication",
        "Quality control and safety management",
        "Risk assessment and mitigation"
      ]),
      provides_certificate: true,
      certificate_type: "Project Management Certificate",
      accreditation_body: "Botswana Qualifications Authority",
      schedule_type: "fixed",
      start_date: "2024-02-01",
      end_date: "2024-04-15",
      location: "Gaborone Skills Center",
      delivery_method: "in_person",
      status: "active"
    },
    {
      provider_id: insertedProviders.find(p => p.business_name === "Botswana Skills Academy")?.id,
      program_name: "Real Estate Sales Certification",
      description: "Professional training for aspiring real estate agents covering sales techniques, legal requirements, and market analysis.",
      category: "real_estate",
      duration_hours: 60,
      duration_weeks: 8,
      price: 250000, // 2500 BWP in thebe
      max_participants: 30,
      prerequisites: "Grade 12 certificate and good communication skills",
      learning_outcomes: JSON.stringify([
        "Real estate law and regulations",
        "Property valuation techniques",
        "Sales and negotiation skills",
        "Market analysis and research",
        "Customer relationship management"
      ]),
      provides_certificate: true,
      certificate_type: "Real Estate Sales Certificate",
      accreditation_body: "Real Estate Agents Council of Botswana",
      schedule_type: "fixed",
      start_date: "2024-03-01",
      end_date: "2024-04-30",
      location: "Francistown Training Center",
      delivery_method: "hybrid",
      status: "active"
    }
  ];

  const insertedPrograms = await db.insert(training_programs).values(trainingPrograms).returning();
  console.log(`Inserted ${insertedPrograms.length} training programs`);

  // Building Materials
  const materials = [
    {
      supplier_id: insertedProviders.find(p => p.business_name === "Kalahari Building Supplies")?.id,
      product_name: "Portland Cement - 50kg",
      product_description: "High-quality Portland cement suitable for all construction projects. Grade 42.5N.",
      category: "cement",
      brand: "Botswana Cement",
      specifications: JSON.stringify({
        "weight": "50kg",
        "grade": "42.5N",
        "compressive_strength": "42.5 MPa",
        "setting_time": "Initial: 45min, Final: 10hr"
      }),
      unit_price: 8500, // 85 BWP in thebe
      unit_type: "bag",
      bulk_pricing: JSON.stringify([
        {"quantity": 50, "price": 8000},
        {"quantity": 100, "price": 7500},
        {"quantity": 500, "price": 7000}
      ]),
      stock_quantity: 500,
      minimum_order: 10,
      lead_time_days: 1,
      status: "available"
    },
    {
      supplier_id: insertedProviders.find(p => p.business_name === "Kalahari Building Supplies")?.id,
      product_name: "Clay Bricks - Standard",
      product_description: "High-quality clay bricks for residential and commercial construction. Fired at optimal temperature.",
      category: "bricks",
      brand: "Botswana Bricks",
      specifications: JSON.stringify({
        "dimensions": "230mm x 110mm x 76mm",
        "weight": "3.5kg",
        "compressive_strength": "15 MPa",
        "water_absorption": "< 15%"
      }),
      unit_price: 150, // 1.50 BWP in thebe
      unit_type: "piece",
      bulk_pricing: JSON.stringify([
        {"quantity": 1000, "price": 140},
        {"quantity": 5000, "price": 135},
        {"quantity": 10000, "price": 130}
      ]),
      stock_quantity: 50000,
      minimum_order: 500,
      lead_time_days: 2,
      status: "available"
    }
  ];

  const insertedMaterials = await db.insert(building_materials).values(materials).returning();
  console.log(`Inserted ${insertedMaterials.length} building materials`);

  console.log("Marketplace seeding completed!");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMarketplace()
    .then(() => {
      console.log("Marketplace seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Marketplace seeding failed:", error);
      process.exit(1);
    });
}
