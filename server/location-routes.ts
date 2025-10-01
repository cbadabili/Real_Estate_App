import { Express } from 'express';
import { db } from './db';
import { districts, settlements, wards, plots } from '../shared/schema';
import { eq, or, ilike, desc, asc } from 'drizzle-orm';

export function registerLocationRoutes(app: Express) {
  // Get all districts
  app.get("/api/locations/districts", async (_req, res) => {
    try {
      const allDistricts = await db
        .select()
        .from(districts)
        .orderBy(asc(districts.name));

      res.json({
        success: true,
        data: allDistricts,
        count: allDistricts.length
      });
    } catch (error) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch districts" 
      });
    }
  });

  // Get settlements for a specific district
  app.get("/api/locations/districts/:id/settlements", async (req, res) => {
    try {
      const districtId = parseInt(req.params.id);
      
      if (isNaN(districtId) || districtId <= 0) {
        return res.status(400).json({ 
          success: false,
          error: "Invalid district ID" 
        });
      }

      // Get district info
      const [district] = await db
        .select()
        .from(districts)
        .where(eq(districts.id, districtId));

      if (!district) {
        return res.status(404).json({ 
          success: false,
          error: "District not found" 
        });
      }

      // Get settlements in the district
      const districtSettlements = await db
        .select()
        .from(settlements)
        .where(eq(settlements.district_id, districtId))
        .orderBy(desc(settlements.is_major), desc(settlements.population), asc(settlements.name));

      res.json({
        success: true,
        data: {
          district,
          settlements: districtSettlements
        },
        count: districtSettlements.length
      });
    } catch (error) {
      console.error("Error fetching district settlements:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch settlements" 
      });
    }
  });

  // Get wards for a specific settlement
  app.get("/api/locations/settlements/:id/wards", async (req, res) => {
    try {
      const settlementId = parseInt(req.params.id);
      
      if (isNaN(settlementId) || settlementId <= 0) {
        return res.status(400).json({ 
          success: false,
          error: "Invalid settlement ID" 
        });
      }

      // Get settlement info with district
      const [settlementWithDistrict] = await db
        .select({
          settlement: settlements,
          district: districts
        })
        .from(settlements)
        .innerJoin(districts, eq(settlements.district_id, districts.id))
        .where(eq(settlements.id, settlementId));

      if (!settlementWithDistrict) {
        return res.status(404).json({ 
          success: false,
          error: "Settlement not found" 
        });
      }

      // Get wards in the settlement
      const settlementWards = await db
        .select()
        .from(wards)
        .where(eq(wards.settlement_id, settlementId))
        .orderBy(asc(wards.name));

      res.json({
        success: true,
        data: {
          settlement: settlementWithDistrict.settlement,
          district: settlementWithDistrict.district,
          wards: settlementWards
        },
        count: settlementWards.length
      });
    } catch (error) {
      console.error("Error fetching settlement wards:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch wards" 
      });
    }
  });

  // Get plots/addresses for a specific ward
  app.get("/api/locations/wards/:id/plots", async (req, res) => {
    try {
      const wardId = parseInt(req.params.id);
      
      if (isNaN(wardId) || wardId <= 0) {
        return res.status(400).json({ 
          success: false,
          error: "Invalid ward ID" 
        });
      }

      // Get ward info with settlement and district
      const [wardWithHierarchy] = await db
        .select({
          ward: wards,
          settlement: settlements,
          district: districts
        })
        .from(wards)
        .innerJoin(settlements, eq(wards.settlement_id, settlements.id))
        .innerJoin(districts, eq(settlements.district_id, districts.id))
        .where(eq(wards.id, wardId));

      if (!wardWithHierarchy) {
        return res.status(404).json({ 
          success: false,
          error: "Ward not found" 
        });
      }

      // Get plots in the ward
      const wardPlots = await db
        .select()
        .from(plots)
        .where(eq(plots.ward_id, wardId))
        .orderBy(asc(plots.full_address));

      res.json({
        success: true,
        data: {
          ward: wardWithHierarchy.ward,
          settlement: wardWithHierarchy.settlement,
          district: wardWithHierarchy.district,
          plots: wardPlots
        },
        count: wardPlots.length
      });
    } catch (error) {
      console.error("Error fetching ward plots:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch plots" 
      });
    }
  });

  // Search locations across all levels
  app.get("/api/locations/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const type = req.query.type as string; // 'district', 'settlement', 'ward', 'plot'
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      if (!query || query.length < 2) {
        return res.status(400).json({ 
          success: false,
          error: "Search query must be at least 2 characters long" 
        });
      }

      const searchPattern = `%${query.toLowerCase()}%`;
      const results: any = {
        districts: [],
        settlements: [],
        wards: [],
        plots: []
      };

      // Search districts if no type specified or type is 'district'
      if (!type || type === 'district') {
        results.districts = await db
          .select()
          .from(districts)
          .where(or(
            ilike(districts.name, searchPattern),
            ilike(districts.code, searchPattern)
          ))
          .orderBy(asc(districts.name))
          .limit(limit);
      }

      // Search settlements if no type specified or type is 'settlement'
      if (!type || type === 'settlement') {
        results.settlements = await db
          .select({
            settlement: settlements,
            district: districts
          })
          .from(settlements)
          .innerJoin(districts, eq(settlements.district_id, districts.id))
          .where(ilike(settlements.name, searchPattern))
          .orderBy(desc(settlements.is_major), desc(settlements.population), asc(settlements.name))
          .limit(limit);
      }

      // Search wards if no type specified or type is 'ward'
      if (!type || type === 'ward') {
        results.wards = await db
          .select({
            ward: wards,
            settlement: settlements,
            district: districts
          })
          .from(wards)
          .innerJoin(settlements, eq(wards.settlement_id, settlements.id))
          .innerJoin(districts, eq(settlements.district_id, districts.id))
          .where(ilike(wards.name, searchPattern))
          .orderBy(asc(wards.name))
          .limit(limit);
      }

      // Search plots if no type specified or type is 'plot'
      if (!type || type === 'plot') {
        results.plots = await db
          .select({
            plot: plots,
            ward: wards,
            settlement: settlements,
            district: districts
          })
          .from(plots)
          .leftJoin(wards, eq(plots.ward_id, wards.id))
          .innerJoin(settlements, eq(plots.settlement_id, settlements.id))
          .innerJoin(districts, eq(settlements.district_id, districts.id))
          .where(or(
            ilike(plots.full_address, searchPattern),
            ilike(plots.street_name, searchPattern),
            ilike(plots.block_name, searchPattern)
          ))
          .orderBy(asc(plots.full_address))
          .limit(limit);
      }

      // Calculate total results
      const totalResults = results.districts.length + 
                          results.settlements.length + 
                          results.wards.length + 
                          results.plots.length;

      res.json({
        success: true,
        data: results,
        query,
        type: type || 'all',
        totalResults,
        limit
      });
    } catch (error) {
      console.error("Error searching locations:", error);
      res.status(500).json({ 
        success: false,
        error: "Location search failed" 
      });
    }
  });

  // Get location suggestions for autocomplete
  app.get("/api/locations/suggestions", async (req, res) => {
    try {
      const query = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (!query || query.length < 1) {
        return res.json({
          success: true,
          data: [],
          query: query || '',
          count: 0
        });
      }

      const searchPattern = `${query.toLowerCase()}%`;

      // Get suggestions from major settlements first, then districts
      const settlementSuggestions = await db
        .select({
          id: settlements.id,
          name: settlements.name,
          type: settlements.type,
          district_name: districts.name,
          population: settlements.population,
          is_major: settlements.is_major
        })
        .from(settlements)
        .innerJoin(districts, eq(settlements.district_id, districts.id))
        .where(ilike(settlements.name, searchPattern))
        .orderBy(
          desc(settlements.is_major),
          desc(settlements.population),
          asc(settlements.name)
        )
        .limit(limit);

      // Add level property manually after query  
      const suggestions: Array<{
        id: number;
        name: string;
        type: string;
        district_name: string;
        population: number | null;
        is_major: boolean | null;
        level: 'settlement' | 'district';
      }> = settlementSuggestions.map(s => ({
        ...s,
        level: 'settlement' as const
      }));

      // If we need more suggestions, add districts
      if (suggestions.length < limit) {
        const remaining = limit - suggestions.length;
        const districtResults = await db
          .select({
            id: districts.id,
            name: districts.name,
            type: districts.type,
            district_name: districts.name,
            population: districts.population
          })
          .from(districts)
          .where(ilike(districts.name, searchPattern))
          .orderBy(desc(districts.population), asc(districts.name))
          .limit(remaining);

        // Add level and is_major properties manually
        const districtSuggestions = districtResults.map(d => ({
          ...d,
          is_major: false as boolean | null,
          level: 'district' as const
        }));

        suggestions.push(...districtSuggestions);
      }

      res.json({
        success: true,
        data: suggestions,
        query,
        count: suggestions.length
      });
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch location suggestions" 
      });
    }
  });
}