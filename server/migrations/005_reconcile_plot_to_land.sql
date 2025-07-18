
-- Reconcile all property type references from 'plot' to 'land'
-- Update properties table
UPDATE properties 
SET property_type = 'land' 
WHERE property_type IN ('plot', 'plot/land', 'Plot/Land', 'Plot');

-- Update rental listings if any exist
UPDATE rental_listings 
SET property_type = 'land' 
WHERE property_type IN ('plot', 'plot/land', 'Plot/Land', 'Plot');

-- Update any marketplace service categories
UPDATE service_categories 
SET name = REPLACE(name, 'Plot', 'Land')
WHERE name LIKE '%Plot%';

-- Update any other references in service descriptions
UPDATE marketplace_providers 
SET description = REPLACE(description, 'plot', 'land')
WHERE description LIKE '%plot%';

-- Add index for property_type for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_rental_listings_property_type ON rental_listings(property_type);
