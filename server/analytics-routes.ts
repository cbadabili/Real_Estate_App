
import { Router } from 'express';
import { authenticate } from './auth-middleware';
import { AuthService } from './auth-middleware';
import { analyticsService } from './analytics-service';

const router = Router();

// Admin-only analytics endpoints
router.get('/metrics/overview', authenticate, async (req, res) => {
  try {
    if (!req.user || !AuthService.isAdmin(req.user)) {
      return res.status(403).json({ 
        success: false,
        error: 'Admin access required' 
      });
    }

    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const metrics = await analyticsService.getComprehensiveMetrics(start, end);

    res.json({
      success: true,
      data: metrics,
      period: {
        startDate: start.toISOString(),
        endDate: end.toISOString()
      }
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics overview'
    });
  }
});

router.get('/metrics/properties/top', authenticate, async (req, res) => {
  try {
    if (!req.user || !AuthService.isAdmin(req.user)) {
      return res.status(403).json({ 
        success: false,
        error: 'Admin access required' 
      });
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const topProperties = await analyticsService.getTopPerformingProperties(limit);

    res.json({
      success: true,
      data: topProperties
    });
  } catch (error) {
    console.error('Top properties analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top properties'
    });
  }
});

router.get('/metrics/users/activity', authenticate, async (req, res) => {
  try {
    if (!req.user || !AuthService.isAdmin(req.user)) {
      return res.status(403).json({ 
        success: false,
        error: 'Admin access required' 
      });
    }

    const days = parseInt(req.query.days as string) || 30;
    const activityTrends = await analyticsService.getUserActivityTrends(days);

    res.json({
      success: true,
      data: activityTrends
    });
  } catch (error) {
    console.error('User activity analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user activity trends'
    });
  }
});

router.get('/metrics/performance', authenticate, async (req, res) => {
  try {
    if (!req.user || !AuthService.isAdmin(req.user)) {
      return res.status(403).json({ 
        success: false,
        error: 'Admin access required' 
      });
    }

    const performanceMetrics = analyticsService.getPerformanceMetrics();

    res.json({
      success: true,
      data: performanceMetrics
    });
  } catch (error) {
    console.error('Performance analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics'
    });
  }
});

// Public analytics (limited data)
router.get('/public/stats', async (_req, res) => {
  try {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date();
    
    const propertyMetrics = await analyticsService.getPropertyMetrics(startDate, endDate);

    res.json({
      success: true,
      data: {
        totalListings: propertyMetrics.totalListings,
        activeListings: propertyMetrics.activeListings
      }
    });
  } catch (error) {
    console.error('Public stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch public stats'
    });
  }
});

export default router;
