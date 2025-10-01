
import { db } from "./db";
import { users, properties, inquiries, appointments } from "../shared/schema";
import { sql, eq, gte, lte, and, count, desc, asc } from "drizzle-orm";
import { daysAgo } from "./db/date-utils";

export interface BusinessMetrics {
  userEngagement: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    retentionRate: number;
    avgSessionDuration: number;
  };
  revenue: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    averageRevenuePerUser: number;
    conversionRate: number;
  };
  properties: {
    totalListings: number;
    activeListings: number;
    viewsPerListing: number;
    inquiryRate: number;
    conversionToViewing: number;
  };
  performance: {
    avgResponseTime: number;
    errorRate: number;
    uptime: number;
    searchSuccessRate: number;
  };
}

export class AnalyticsService {
  private metrics: Map<string, any> = new Map();
  private startTime = Date.now();

  // User Engagement Metrics
  async getUserEngagementMetrics(startDate: Date, endDate: Date) {
    const [totalUsers] = await db
      .select({ count: count() })
      .from(users);

    const [activeUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        gte(users.lastLoginAt, startDate),
        lte(users.lastLoginAt, endDate)
      ));

    const [newUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        gte(users.createdAt, startDate),
        lte(users.createdAt, endDate)
      ));

    // Calculate retention rate (users who logged in this period and last period)
    const lastPeriodStart = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()));

    const [retainedUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        gte(users.lastLoginAt, startDate),
        gte(users.createdAt, lastPeriodStart),
        lte(users.createdAt, startDate)
      ));

    const totalUsersCount = Number(totalUsers?.count ?? 0);
    const activeUsersCount = Number(activeUsers?.count ?? 0);
    const newUsersCount = Number(newUsers?.count ?? 0);
    const retainedUsersCount = Number(retainedUsers?.count ?? 0);

    const retentionRate = newUsersCount > 0 ? (retainedUsersCount / newUsersCount) * 100 : 0;

    return {
      totalUsers: totalUsersCount,
      activeUsers: activeUsersCount,
      newUsers: newUsersCount,
      retentionRate: Math.round(retentionRate * 10) / 10,
      avgSessionDuration: 0 // To be implemented with session tracking
    };
  }

  // Property Performance Metrics
  async getPropertyMetrics(startDate: Date, endDate: Date) {
    const [totalListings] = await db
      .select({ count: count() })
      .from(properties);

    const [activeListings] = await db
      .select({ count: count() })
      .from(properties)
      .where(eq(properties.status, 'active'));

    const [totalViews] = await db
      .select({ totalViews: sql<number>`SUM(${properties.views})` })
      .from(properties)
      .where(and(
        gte(properties.createdAt, startDate),
        lte(properties.createdAt, endDate)
      ));

    const [totalInquiries] = await db
      .select({ count: count() })
      .from(inquiries)
      .where(and(
        gte(inquiries.createdAt, startDate),
        lte(inquiries.createdAt, endDate)
      ));

    const [totalAppointments] = await db
      .select({ count: count() })
      .from(appointments)
      .where(and(
        gte(appointments.createdAt, startDate),
        lte(appointments.createdAt, endDate)
      ));

    const activeListingsCount = Number(activeListings?.count ?? 0);
    const totalInquiriesCount = Number(totalInquiries?.count ?? 0);
    const totalAppointmentsCount = Number(totalAppointments?.count ?? 0);
    const totalViewsValue = Number(totalViews?.totalViews ?? 0);

    const viewsPerListing = activeListingsCount > 0
      ? Math.round(totalViewsValue / activeListingsCount)
      : 0;

    const inquiryRate = totalViewsValue > 0
      ? Math.round((totalInquiriesCount / Math.max(totalViewsValue, 1)) * 100 * 10) / 10
      : 0;

    const conversionToViewing = totalInquiriesCount > 0
      ? Math.round((totalAppointmentsCount / totalInquiriesCount) * 100 * 10) / 10
      : 0;

    return {
      totalListings: Number(totalListings?.count ?? 0),
      activeListings: activeListingsCount,
      viewsPerListing,
      inquiryRate,
      conversionToViewing
    };
  }

  // Performance Tracking
  recordResponseTime(endpoint: string, duration: number) {
    const key = `response_time_${endpoint}`;
    const existing = this.metrics.get(key) || [];
    existing.push({ timestamp: Date.now(), duration });
    
    // Keep only last 1000 entries per endpoint
    if (existing.length > 1000) {
      existing.shift();
    }
    
    this.metrics.set(key, existing);
  }

  recordError(endpoint: string, errorType: string) {
    const key = `errors_${endpoint}`;
    const existing = this.metrics.get(key) || [];
    existing.push({ timestamp: Date.now(), errorType });
    
    if (existing.length > 1000) {
      existing.shift();
    }
    
    this.metrics.set(key, existing);
  }

  getPerformanceMetrics() {
    const allResponseTimes = [];
    const allErrors = [];
    
    for (const [key, value] of this.metrics) {
      if (key.startsWith('response_time_')) {
        allResponseTimes.push(...value);
      } else if (key.startsWith('errors_')) {
        allErrors.push(...value);
      }
    }

    const avgResponseTime = allResponseTimes.length > 0
      ? allResponseTimes.reduce((sum, entry) => sum + entry.duration, 0) / allResponseTimes.length
      : 0;

    const totalRequests = allResponseTimes.length + allErrors.length;
    const errorRate = totalRequests > 0 ? (allErrors.length / totalRequests) * 100 : 0;
    const uptime = ((Date.now() - this.startTime) / (Date.now() - this.startTime + 1000)) * 100; // Simplified uptime

    return {
      avgResponseTime: Math.round(avgResponseTime),
      errorRate: Math.round(errorRate * 10) / 10,
      uptime: Math.round(uptime * 10) / 10,
      searchSuccessRate: 95.5 // Placeholder - implement based on search metrics
    };
  }

  // Top performing properties
  async getTopPerformingProperties(limit: number = 10) {
    return await db
      .select({
        id: properties.id,
        title: properties.title,
        views: properties.views,
        price: properties.price,
        location: properties.city
      })
      .from(properties)
      .where(eq(properties.status, 'active'))
      .orderBy(desc(properties.views))
      .limit(limit);
  }

  // User activity trends
  async getUserActivityTrends(days: number = 30) {
    const startDate = daysAgo(days);
    const dayExpression = sql`DATE(${users.createdAt})`;
    const dailyStats = await db
      .select({
        date: sql<string>`to_char(${users.createdAt}, 'YYYY-MM-DD')`,
        registrations: count()
      })
      .from(users)
      .where(gte(users.createdAt, startDate))
      .groupBy(dayExpression)
      .orderBy(asc(dayExpression));

    return dailyStats;
  }

  async getComprehensiveMetrics(startDate: Date, endDate: Date): Promise<BusinessMetrics> {
    const [userEngagement, propertyMetrics, performanceMetrics] = await Promise.all([
      this.getUserEngagementMetrics(startDate, endDate),
      this.getPropertyMetrics(startDate, endDate),
      this.getPerformanceMetrics()
    ]);

    return {
      userEngagement,
      revenue: {
        totalRevenue: 0, // Implement with billing system
        monthlyRecurringRevenue: 0,
        averageRevenuePerUser: 0,
        conversionRate: 0
      },
      properties: propertyMetrics,
      performance: performanceMetrics
    };
  }
}

export const analyticsService = new AnalyticsService();
