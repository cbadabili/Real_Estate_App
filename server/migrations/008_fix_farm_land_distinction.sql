
-- Fix farm and land_plot property type distinction
-- Ensure farms are properly categorized as 'farm' and plots as 'land_plot'

-- Update any 'land' entries to 'land_plot' for consistency
UPDATE properties 
SET property_type = 'land_plot' 
WHERE property_type = 'land' AND (
  title NOT LIKE '%farm%' AND 
  title NOT LIKE '%Farm%' AND 
  description NOT LIKE '%farm%' AND 
  description NOT LIKE '%Farm%' AND
  description NOT LIKE '%agricultural%' AND
  description NOT LIKE '%livestock%' AND
  description NOT LIKE '%crop%'
);

-- Update properties that should be farms based on content
UPDATE properties 
SET property_type = 'farm' 
WHERE (
  title LIKE '%farm%' OR 
  title LIKE '%Farm%' OR 
  description LIKE '%farm%' OR 
  description LIKE '%Farm%' OR
  description LIKE '%agricultural%' OR
  description LIKE '%livestock%' OR
  description LIKE '%crop%' OR
  description LIKE '%cattle%' OR
  description LIKE '%grazing%'
) AND property_type IN ('land', 'land_plot', 'plot');

-- Ensure consistent property type values
UPDATE properties 
SET property_type = 'land_plot' 
WHERE property_type IN ('plot', 'land_for_development', 'development_land', 'vacant_land');

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_type_title ON properties(property_type, title);
