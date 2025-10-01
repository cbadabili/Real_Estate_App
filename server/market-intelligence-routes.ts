
import type { Express } from "express";
import { storage } from "./storage";

export function registerMarketIntelligenceRoutes(app: Express) {
  // Get market intelligence data
  app.get('/api/market-intelligence', async (_req, res) => {
    try {
      // Get real property data from database
      const properties = await storage.getProperties();
      
      if (properties.length === 0) {
        return res.json({
          averagePrice: 0,
          priceChange: 0,
          salesVolume: 0,
          averageDaysOnMarket: 0,
          inventoryLevel: 'No Data'
        });
      }

      // Calculate real metrics
      const totalValue = properties.reduce((sum, p) => sum + Number(p.price ?? 0), 0);
      const averagePrice = Math.round(totalValue / properties.length);
      
      // Calculate price trends (compare recent vs older listings)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const recentProperties = properties.filter(p => {
        const createdAt = p.createdAt ? new Date(p.createdAt) : null;
        return createdAt ? createdAt >= thirtyDaysAgo : false;
      });
      const olderProperties = properties.filter(p => {
        const createdAt = p.createdAt ? new Date(p.createdAt) : null;
        return createdAt ? createdAt < thirtyDaysAgo : false;
      });

      let priceChange = 0;
      if (recentProperties.length > 0 && olderProperties.length > 0) {
        const recentAvg = recentProperties.reduce((sum, p) => sum + Number(p.price ?? 0), 0) / recentProperties.length;
        const olderAvg = olderProperties.reduce((sum, p) => sum + Number(p.price ?? 0), 0) / olderProperties.length;
        priceChange = ((recentAvg - olderAvg) / olderAvg) * 100;
      }

      // Calculate average days on market
      const propertiesWithDates = properties.filter(p => p.createdAt);
      const averageDaysOnMarket = propertiesWithDates.length > 0
        ? Math.round(propertiesWithDates.reduce((sum, p) => {
            const createdAt = p.createdAt ? new Date(p.createdAt) : null;
            const daysListed = createdAt ? (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) : 0;
            return sum + daysListed;
          }, 0) / propertiesWithDates.length)
        : 0;

      // Determine inventory level
      let inventoryLevel = 'Moderate';
      if (properties.length < 50) inventoryLevel = 'Low';
      else if (properties.length > 200) inventoryLevel = 'High';

      res.json({
        averagePrice,
        priceChange: Math.round(priceChange * 10) / 10,
        salesVolume: properties.length,
        averageDaysOnMarket,
        inventoryLevel
      });
    } catch (error) {
      console.error('Market intelligence error:', error);
      res.status(500).json({ error: 'Failed to fetch market data' });
    }
  });

  // Get neighborhood analytics
  app.get('/api/market-intelligence/neighborhoods', async (_req, res) => {
    try {
      const properties = await storage.getProperties();
      
      // Group by location/neighborhood
      const neighborhoods = properties.reduce((acc, property) => {
        const area = property.city || property.state || 'Unknown';
        if (!acc[area]) {
          acc[area] = {
            name: area,
            properties: [],
            averagePrice: 0,
            totalListings: 0
          };
        }
        acc[area].properties.push(property);
        return acc;
      }, {} as Record<string, any>);

      // Calculate metrics for each neighborhood
      const neighborhoodData = Object.values(neighborhoods).map((area: any) => {
        const totalValue = area.properties.reduce((sum: number, p: any) => sum + Number(p.price ?? 0), 0);
        return {
          name: area.name,
          averagePrice: Math.round(totalValue / area.properties.length),
          totalListings: area.properties.length,
          priceRange: {
            min: Math.min(...area.properties.map((p: any) => Number(p.price ?? 0))),
            max: Math.max(...area.properties.map((p: any) => Number(p.price ?? 0)))
          }
        };
      }).sort((a, b) => b.totalListings - a.totalListings);

      res.json(neighborhoodData);
    } catch (error) {
      console.error('Neighborhood analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch neighborhood data' });
    }
  });
}
