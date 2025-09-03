
-- Standardize all property type references to use consistent Land/Plot terminology

-- Update properties table - consolidate plot/land references
UPDATE properties 
SET property_type = 'land_plot' 
WHERE property_type IN ('land', 'plot', 'land_for_development', 'development_land', 'vacant_land', 'mmatseta');

-- Update rental listings if any exist
UPDATE rentals 
SET property_type = 'land_plot' 
WHERE property_type IN ('land', 'plot', 'land_for_development', 'development_land', 'vacant_land', 'mmatseta');

-- Update any other references to use standardized terminology
UPDATE service_categories 
SET name = REPLACE(REPLACE(name, 'Plot', 'Land/Plot'), 'Land Services', 'Land/Plot Services')
WHERE name LIKE '%Plot%' OR name LIKE '%Land%';

-- Add index for better query performance on the standardized property types
CREATE INDEX IF NOT EXISTS idx_properties_standardized_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_rentals_standardized_type ON rentals(property_type);

-- Update marketplace provider descriptions to use consistent terminology
UPDATE marketplace_providers 
SET description = REPLACE(REPLACE(description, 'plot', 'land/plot'), 'land', 'land/plot')
WHERE description LIKE '%plot%' OR description LIKE '%land%' AND provider_type = 'professional';
