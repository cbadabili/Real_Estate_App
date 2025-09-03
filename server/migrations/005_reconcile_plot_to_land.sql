
-- Reconcile all property type references from 'plot' to 'land' and add Mmatseta support
-- Update properties table
UPDATE properties 
SET property_type = 'land' 
WHERE property_type IN ('plot', 'plot/land', 'Plot/Land', 'Plot');

-- Ensure Mmatseta properties are categorized as land type
UPDATE properties 
SET property_type = 'land' 
WHERE property_type IN ('Mmatseta', 'mmatseta', 'MMATSETA') OR title LIKE '%Mmatseta%' OR address LIKE '%Mmatseta%';

-- Update rental listings if any exist
UPDATE rentals 
SET property_type = 'land' 
WHERE property_type IN ('plot', 'plot/land', 'Plot/Land', 'Plot');

UPDATE rentals 
SET property_type = 'land' 
WHERE property_type IN ('Mmatseta', 'mmatseta', 'MMATSETA') OR title LIKE '%Mmatseta%' OR title LIKE '%Mmatseta%';

-- Update any marketplace service categories
UPDATE service_categories 
SET name = REPLACE(name, 'Plot', 'Plot/Land')
WHERE name LIKE '%Plot%';

-- Update any other references in service descriptions
UPDATE marketplace_providers 
SET description = REPLACE(description, 'plot', 'land')
WHERE description LIKE '%plot%';

-- Add index for property_type for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_rentals_property_type ON rentals(property_type);

-- Insert valid property types reference for future use (only if they don't exist)
INSERT INTO service_categories (name, journey_type, description, created_at) 
SELECT 'Plot/Land Services', 'property', 'Services related to land and plot transactions', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Plot/Land Services');

INSERT INTO service_categories (name, journey_type, description, created_at) 
SELECT 'Mmatseta Services', 'property', 'Services for traditional Botswana land allocation system', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Mmatseta Services');
