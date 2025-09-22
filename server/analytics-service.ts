
import { db } from './db';
import { users, properties, inquiries, appointments } from '../shared/schema';
import { sql, eq, gte, lte, and, count, desc, asc } from 'drizzle-orm';

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
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    const [totalUsers] = await db
      .select({ count: count() })
      .from(users);

    const [activeUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        gte(users.lastLoginAt, startTimestamp),
        lte(users.lastLoginAt, endTimestamp)
      ));

    const [newUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        gte(users.createdAt, startTimestamp),
        lte(users.createdAt, endTimestamp)
      ));

    // Calculate retention rate (users who logged in this period and last period)
    const lastPeriodStart = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()));
    const lastPeriodTimestamp = Math.floor(lastPeriodStart.getTime() / 1000);

    const [retainedUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        gte(users.lastLoginAt, startTimestamp),
        gte(users.createdAt, lastPeriodTimestamp),
        lte(users.createdAt, startTimestamp)
      ));

    const retentionRate = newUsers.count > 0 ? (retainedUsers.count / newUsers.count) * 100 : 0;

    return {
      totalUsers: totalUsers.count,
      activeUsers: activeUsers.count,
      newUsers: newUsers.count,
      retentionRate: Math.round(retentionRate * 10) / 10,
      avgSessionDuration: 0 // To be implemented with session tracking
    };
  }

  // Property Performance Metrics
  async getPropertyMetrics(startDate: Date, endDate: Date) {
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

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
        gte(properties.createdAt, startTimestamp),
        lte(properties.createdAt, endTimestamp)
      ));

    const [totalInquiries] = await db
      .select({ count: count() })
      .from(inquiries)
      .where(and(
        gte(inquiries.createdAt, startTimestamp),
        lte(inquiries.createdAt, endTimestamp)
      ));

    const [totalAppointments] = await db
      .select({ count: count() })
      .from(appointments)
      .where(and(
        gte(appointments.createdAt, startTimestamp),
        lte(appointments.createdAt, endTimestamp)
      ));

    const viewsPerListing = activeListings.count > 0 
      ? Math.round((totalViews.totalViews || 0) / activeListings.count)
      : 0;

    const inquiryRate = totalViews.totalViews > 0 
      ? Math.round((totalInquiries.count / (totalViews.totalViews || 1)) * 100 * 10) / 10
      : 0;

    const conversionToViewing = totalInquiries.count > 0
      ? Math.round((totalAppointments.count / totalInquiries.count) * 100 * 10) / 10
      : 0;

    return {
      totalListings: totalListings.count,
      activeListings: activeListings.count,
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
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startTimestamp = Math.floor(startDate.getTime() / 1000);

    const dailyStats = await db
      .select({
        date: sql<string>`DATE(datetime(${users.createdAt}, 'unixepoch'))`,
        registrations: count()
      })
      .from(users)
      .where(gte(users.createdAt, startTimestamp))
      .groupBy(sql`DATE(datetime(${users.createdAt}, 'unixepoch'))`)
      .orderBy(asc(sql`DATE(datetime(${users.createdAt}, 'unixepoch'))`));

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
