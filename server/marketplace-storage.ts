import { 
  marketplace_providers, 
  service_categories,
  artisan_skills,
  training_programs,
  project_requests,
  project_proposals,
  marketplace_reviews,
  building_materials,
  material_orders,
  job_opportunities,
  type MarketplaceProvider,
  type ServiceCategory,
  type ArtisanSkill,
  type TrainingProgram,
  type ProjectRequest,
  type ProjectProposal,
  type MarketplaceReview,
  type BuildingMaterial,
  type MaterialOrder,
  type JobOpportunity
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like, sql, or, ilike } from "drizzle-orm";
import { marketplaceCategories, users } from "./schema";

export interface MarketplaceFilters {
  provider_type?: string;
  category_id?: number;
  service_area?: string;
  min_rating?: number;
  is_verified?: boolean;
  is_featured?: boolean;
  availability_status?: string;
  price_range?: { min: number; max: number };
  project_size_range?: { min: number; max: number };
  emergency_services?: boolean;
  team_size_min?: number;
  languages?: string[];
  limit?: number;
  offset?: number;
  sort_by?: 'rating' | 'price' | 'experience' | 'reviews' | 'name' | 'hourly_rate' | 'project_size';
  sort_order?: 'asc' | 'desc';
}

export interface ProjectFilters {
  project_type?: string;
  category_id?: number;
  city?: string;
  status?: string;
  budget_range?: { min: number; max: number };
  limit?: number;
  offset?: number;
}

export class MarketplaceStorage {
  // Service Categories
  async getServiceCategories(journey_type?: string) {
    let query = db.select().from(service_categories).where(eq(service_categories.is_active, true));

    if (journey_type) {
      query = query.where(eq(service_categories.journey_type, journey_type));
    }

    return await query.orderBy(asc(service_categories.sort_order));
  }

  async createServiceCategory(data: Omit<ServiceCategory, 'id' | 'created_at'>) {
    const [category] = await db.insert(service_categories).values(data).returning();
    return category;
  }

  // Marketplace Providers
  async getMarketplaceProviders(filters: MarketplaceFilters = {}) {
    let query = db.select().from(marketplace_providers);
    const conditions = [eq(marketplace_providers.status, 'active')];

    if (filters.provider_type) {
      conditions.push(eq(marketplace_providers.provider_type, filters.provider_type));
    }
    if (filters.category_id) {
      conditions.push(eq(marketplace_providers.category_id, filters.category_id));
    }
    if (filters.is_verified !== undefined) {
      conditions.push(eq(marketplace_providers.is_verified, filters.is_verified));
    }
    if (filters.is_featured !== undefined) {
      conditions.push(eq(marketplace_providers.is_featured, filters.is_featured));
    }
    if (filters.availability_status) {
      conditions.push(eq(marketplace_providers.availability_status, filters.availability_status));
    }
    if (filters.min_rating) {
      conditions.push(sql`${marketplace_providers.rating} >= ${filters.min_rating}`);
    }
    if (filters.service_area) {
      conditions.push(like(marketplace_providers.service_areas, `%${filters.service_area}%`));
    }
    if (filters.project_size_range) {
      if (filters.project_size_range.min) {
        conditions.push(sql`${marketplace_providers.minimum_project_size} <= ${filters.project_size_range.min}`);
      }
      if (filters.project_size_range.max) {
        conditions.push(sql`${marketplace_providers.maximum_project_size} >= ${filters.project_size_range.max}`);
      }
    }
    if (filters.emergency_services !== undefined) {
      conditions.push(eq(marketplace_providers.emergency_services, filters.emergency_services));
    }
    if (filters.team_size_min) {
      conditions.push(sql`${marketplace_providers.team_size} >= ${filters.team_size_min}`);
    }
    if (filters.languages && filters.languages.length > 0) {
      const languageConditions = filters.languages.map(lang => 
        like(marketplace_providers.languages_spoken, `%${lang}%`)
      );
      conditions.push(or(...languageConditions));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Sorting
    if (filters.sort_by) {
      const direction = filters.sort_order === 'desc' ? desc : asc;
      switch (filters.sort_by) {
        case 'rating':
          query = query.orderBy(direction(marketplace_providers.rating));
          break;
        case 'experience':
          query = query.orderBy(direction(marketplace_providers.years_experience));
          break;
        case 'reviews':
          query = query.orderBy(direction(marketplace_providers.review_count));
          break;
        case 'name':
          query = query.orderBy(direction(marketplace_providers.business_name));
          break;
        case 'hourly_rate':
          query = query.orderBy(direction(marketplace_providers.hourly_rate));
          break;
        case 'project_size':
          query = query.orderBy(direction(marketplace_providers.minimum_project_size));
          break;
      }
    } else {
      query = query.orderBy(desc(marketplace_providers.is_featured), desc(marketplace_providers.rating));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  async getMarketplaceProvider(id: number) {
    const [provider] = await db
      .select()
      .from(marketplace_providers)
      .where(eq(marketplace_providers.id, id));
    return provider;
  }

  async createMarketplaceProvider(data: Omit<MarketplaceProvider, 'id' | 'created_at' | 'updated_at'>) {
    const [provider] = await db.insert(marketplace_providers).values(data).returning();
    return provider;
  }

  async updateMarketplaceProvider(id: number, data: Partial<MarketplaceProvider>) {
    const [provider] = await db
      .update(marketplace_providers)
      .set({ ...data, updated_at: Date.now() })
      .where(eq(marketplace_providers.id, id))
      .returning();
    return provider;
  }

  // Artisan Skills
  async getArtisanSkills(provider_id: number) {
    return await db
      .select()
      .from(artisan_skills)
      .where(eq(artisan_skills.provider_id, provider_id))
      .orderBy(asc(artisan_skills.skill_name));
  }

  async createArtisanSkill(data: Omit<ArtisanSkill, 'id' | 'created_at'>) {
    const [skill] = await db.insert(artisan_skills).values(data).returning();
    return skill;
  }

  // Training Programs
  async getTrainingPrograms(filters: { category?: string; provider_id?: number; status?: string } = {}) {
    let query = db.select().from(training_programs);
    const conditions = [];

    if (filters.category) {
      conditions.push(eq(training_programs.category, filters.category));
    }
    if (filters.provider_id) {
      conditions.push(eq(training_programs.provider_id, filters.provider_id));
    }
    if (filters.status) {
      conditions.push(eq(training_programs.status, filters.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(training_programs.created_at));
  }

  async createTrainingProgram(data: Omit<TrainingProgram, 'id' | 'created_at' | 'updated_at'>) {
    const [program] = await db.insert(training_programs).values(data).returning();
    return program;
  }

  // Project Requests
  async getProjectRequests(filters: ProjectFilters = {}) {
    let query = db.select().from(project_requests);
    const conditions = [];

    if (filters.project_type) {
      conditions.push(eq(project_requests.project_type, filters.project_type));
    }
    if (filters.category_id) {
      conditions.push(eq(project_requests.category_id, filters.category_id));
    }
    if (filters.city) {
      conditions.push(eq(project_requests.project_city, filters.city));
    }
    if (filters.status) {
      conditions.push(eq(project_requests.status, filters.status));
    }
    if (filters.budget_range) {
      if (filters.budget_range.min) {
        conditions.push(sql`${project_requests.budget_min} >= ${filters.budget_range.min}`);
      }
      if (filters.budget_range.max) {
        conditions.push(sql`${project_requests.budget_max} <= ${filters.budget_range.max}`);
      }
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(desc(project_requests.created_at));
  }

  async createProjectRequest(data: Omit<ProjectRequest, 'id' | 'created_at' | 'updated_at'>) {
    const [request] = await db.insert(project_requests).values(data).returning();
    return request;
  }

  // Project Proposals
  async getProjectProposals(project_id: number) {
    return await db
      .select()
      .from(project_proposals)
      .where(eq(project_proposals.project_id, project_id))
      .orderBy(desc(project_proposals.created_at));
  }

  async createProjectProposal(data: Omit<ProjectProposal, 'id' | 'created_at' | 'updated_at'>) {
    const [proposal] = await db.insert(project_proposals).values(data).returning();

    // Update project proposals count
    await db
      .update(project_requests)
      .set({ proposals_count: sql`${project_requests.proposals_count} + 1` })
      .where(eq(project_requests.id, data.project_id));

    return proposal;
  }

  // Marketplace Reviews
  async getMarketplaceReviews(provider_id: number) {
    return await db
      .select()
      .from(marketplace_reviews)
      .where(and(
        eq(marketplace_reviews.provider_id, provider_id),
        eq(marketplace_reviews.status, 'active')
      ))
      .orderBy(desc(marketplace_reviews.created_at));
  }

  async createMarketplaceReview(data: Omit<MarketplaceReview, 'id' | 'created_at'>) {
    const [review] = await db.insert(marketplace_reviews).values(data).returning();

    // Update provider rating and review count
    const reviews = await this.getMarketplaceReviews(data.provider_id);
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await db
      .update(marketplace_providers)
      .set({
        rating: avgRating,
        review_count: reviews.length
      })
      .where(eq(marketplace_providers.id, data.provider_id));

    return review;
  }

  // Building Materials
  async getBuildingMaterials(filters: { category?: string; supplier_id?: number; status?: string } = {}) {
    let query = db.select().from(building_materials);
    const conditions = [];

    if (filters.category) {
      conditions.push(eq(building_materials.category, filters.category));
    }
    if (filters.supplier_id) {
      conditions.push(eq(building_materials.supplier_id, filters.supplier_id));
    }
    if (filters.status) {
      conditions.push(eq(building_materials.status, filters.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(building_materials.created_at));
  }

  async createBuildingMaterial(data: Omit<BuildingMaterial, 'id' | 'created_at' | 'updated_at'>) {
    const [material] = await db.insert(building_materials).values(data).returning();
    return material;
  }

  // Material Orders
  async getMaterialOrders(filters: { customer_id?: number; supplier_id?: number; status?: string } = {}) {
    let query = db.select().from(material_orders);
    const conditions = [];

    if (filters.customer_id) {
      conditions.push(eq(material_orders.customer_id, filters.customer_id));
    }
    if (filters.supplier_id) {
      conditions.push(eq(material_orders.supplier_id, filters.supplier_id));
    }
    if (filters.status) {
      conditions.push(eq(material_orders.status, filters.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(material_orders.created_at));
  }

  async createMaterialOrder(data: Omit<MaterialOrder, 'id' | 'created_at' | 'updated_at'>) {
    const [order] = await db.insert(material_orders).values(data).returning();
    return order;
  }

  // Job Opportunities
  async getJobOpportunities(filters: { category?: string; employer_id?: number; status?: string } = {}) {
    let query = db.select().from(job_opportunities);
    const conditions = [];

    if (filters.category) {
      conditions.push(eq(job_opportunities.category, filters.category));
    }
    if (filters.employer_id) {
      conditions.push(eq(job_opportunities.employer_id, filters.employer_id));
    }
    if (filters.status) {
      conditions.push(eq(job_opportunities.status, filters.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(job_opportunities.created_at));
  }

  async createJobOpportunity(data: Omit<JobOpportunity, 'id' | 'created_at' | 'updated_at'>) {
    const [job] = await db.insert(job_opportunities).values(data).returning();
    return job;
  }

  // Search across all marketplace entities
  async searchMarketplace(query: string, type?: string) {
    const searchTerm = `%${query}%`;

    if (type === 'providers' || !type) {
      const providers = await db
        .select()
        .from(marketplace_providers)
        .where(
          and(
            eq(marketplace_providers.status, 'active'),
            or(
              like(marketplace_providers.business_name, searchTerm),
              like(marketplace_providers.description, searchTerm),
              like(marketplace_providers.specializations, searchTerm)
            )
          )
        )
        .limit(10);

      if (type === 'providers') return providers;
    }

    if (type === 'materials' || !type) {
      const materials = await db
        .select()
        .from(building_materials)
        .where(
          and(
            eq(building_materials.status, 'available'),
            or(
              like(building_materials.product_name, searchTerm),
              like(building_materials.product_description, searchTerm),
              like(building_materials.category, searchTerm)
            )
          )
        )
        .limit(10);

      if (type === 'materials') return materials;
    }

    if (type === 'training' || !type) {
      const training = await db
        .select()
        .from(training_programs)
        .where(
          and(
            eq(training_programs.status, 'active'),
            or(
              like(training_programs.program_name, searchTerm),
              like(training_programs.description, searchTerm),
              like(training_programs.category, searchTerm)
            )
          )
        )
        .limit(10);

      if (type === 'training') return training;
    }

    // Return combined results if no specific type
    return {
      providers: await this.searchMarketplace(query, 'providers'),
      materials: await this.searchMarketplace(query, 'materials'),
      training: await this.searchMarketplace(query, 'training')
    };
  }
}

export const marketplaceStorage = new MarketplaceStorage();

export async function getCategories() {
  return db.select().from(marketplaceCategories);
}

export async function getProviders(filters: {
  category?: string;
  location?: string;
  search?: string;
  page: number;
  limit: number;
}) {
  let query = db.select({
    id: marketplace_providers.id,
    business_name: marketplace_providers.business_name,
    business_description: marketplace_providers.description,
    service_area: marketplace_providers.service_areas,
    hourly_rate: marketplace_providers.hourly_rate,
    rating: marketplace_providers.rating,
    review_count: marketplace_providers.review_count,
    phone: marketplace_providers.phone,
    email: marketplace_providers.email,
    website: marketplace_providers.website,
    specialties: marketplace_providers.specializations,
    is_verified: marketplace_providers.is_verified,
    category: marketplaceCategories.name
  })
  .from(marketplace_providers)
  .leftJoin(marketplaceCategories, eq(marketplace_providers.category_id, marketplaceCategories.id));

  if (filters.category) {
    query = query.where(eq(marketplaceCategories.type, filters.category));
  }

  if (filters.location) {
    query = query.where(ilike(marketplace_providers.service_areas, `%${filters.location}%`));
  }

  if (filters.search) {
    query = query.where(
      or(
        ilike(marketplace_providers.business_name, `%${filters.search}%`),
        ilike(marketplace_providers.description, `%${filters.search}%`)
      )
    );
  }

  const offset = (filters.page - 1) * filters.limit;
  return query.limit(filters.limit).offset(offset);
}

export async function createProvider(data: {
  user_id: number;
  business_name: string;
  business_description: string;
  category_id: string;
  service_area: string;
  hourly_rate: number;
  phone: string;
  email: string;
  website?: string;
  specialties?: string[];
}) {
  const [provider] = await db.insert(marketplace_providers).values({
    userId: data.user_id,
    businessName: data.business_name,
    businessDescription: data.business_description,
    categoryId: parseInt(data.category_id),
    serviceArea: data.service_area,
    hourlyRate: data.hourly_rate,
    phone: data.phone,
    email: data.email,
    website: data.website,
    specialties: data.specialties,
    isVerified: false,
    rating: 0,
    reviewCount: 0
  }).returning();

  return provider;
}

export async function getProviderById(id: number) {
  const [provider] = await db.select({
    id: marketplace_providers.id,
    user_id: marketplace_providers.userId,
    business_name: marketplace_providers.business_name,
    business_description: marketplace_providers.description,
    service_area: marketplace_providers.service_areas,
    hourly_rate: marketplace_providers.hourly_rate,
    rating: marketplace_providers.rating,
    review_count: marketplace_providers.review_count,
    phone: marketplace_providers.phone,
    email: marketplace_providers.email,
    website: marketplace_providers.website,
    specialties: marketplace_providers.specializations,
    is_verified: marketplace_providers.is_verified,
    category: marketplaceCategories.name,
    category_type: marketplaceCategories.type
  })
  .from(marketplace_providers)
  .leftJoin(marketplaceCategories, eq(marketplace_providers.category_id, marketplaceCategories.id))
  .where(eq(marketplace_providers.id, id));

  return provider;
}

export async function updateProvider(id: number, data: Partial<{
  business_name: string;
  business_description: string;
  service_area: string;
  hourly_rate: number;
  phone: string;
  email: string;
  website: string;
  specialties: string[];
}>) {
  const updateData: any = {};

  if (data.business_name) updateData.businessName = data.business_name;
  if (data.business_description) updateData.businessDescription = data.business_description;
  if (data.service_area) updateData.serviceArea = data.service_area;
  if (data.hourly_rate) updateData.hourlyRate = data.hourly_rate;
  if (data.phone) updateData.phone = data.phone;
  if (data.email) updateData.email = data.email;
  if (data.website) updateData.website = data.website;
  if (data.specialties) updateData.specialties = data.specialties;

  const [provider] = await db.update(marketplace_providers)
    .set(updateData)
    .where(eq(marketplace_providers.id, id))
    .returning();

  return provider;
}

export async function createProviderReview(data: {
  provider_id: number;
  user_id: number;
  rating: number;
  comment: string;
  service_type?: string;
}) {
  const [review] = await db.insert(marketplace_reviews).values({
    providerId: data.provider_id,
    userId: data.user_id,
    rating: data.rating,
    comment: data.comment,
    serviceType: data.service_type
  }).returning();

  // Update provider's average rating
  const reviews = await db.select({ rating: marketplace_reviews.rating })
    .from(marketplace_reviews)
    .where(eq(marketplace_reviews.providerId, data.provider_id));

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await db.update(marketplace_providers)
    .set({ 
      rating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviews.length
    })
    .where(eq(marketplace_providers.id, data.provider_id));

  return review;
}

export async function getProviderReviews(providerId: number, options: {
  page: number;
  limit: number;
}) {
  const offset = (options.page - 1) * options.limit;

  return db.select({
    id: marketplace_reviews.id,
    rating: marketplace_reviews.rating,
    comment: marketplace_reviews.comment,
    service_type: marketplace_reviews.serviceType,
    created_at: marketplace_reviews.createdAt,
    user_name: users.username
  })
  .from(marketplace_reviews)
  .leftJoin(users, eq(marketplace_reviews.userId, users.id))
  .where(eq(marketplace_reviews.providerId, providerId))
  .orderBy(desc(marketplace_reviews.createdAt))
  .limit(options.limit)
  .offset(offset);
}