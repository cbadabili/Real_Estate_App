
-- Reconcile all property type references from 'plot' to 'land' and add Mmatseta support
-- Update properties table
UPDATE properties 
SET property_type = 'land' 
WHERE property_type IN ('plot', 'plot/land', 'Plot/Land', 'Plot');

-- Add Mmatseta as a valid property type (traditional Botswana land allocation system)
UPDATE properties 
SET property_type = 'mmatseta' 
WHERE property_type IN ('Mmatseta', 'mmatseta', 'MMATSETA');

-- Update rental listings if any exist
UPDATE rental_listings 
SET property_type = 'land' 
WHERE property_type IN ('plot', 'plot/land', 'Plot/Land', 'Plot');

UPDATE rental_listings 
SET property_type = 'mmatseta' 
WHERE property_type IN ('Mmatseta', 'mmatseta', 'MMATSETA');

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
CREATE INDEX IF NOT EXISTS idx_rental_listings_property_type ON rental_listings(property_type);

-- Insert valid property types reference for future use
INSERT OR IGNORE INTO service_categories (name, description, created_at) VALUES 
('Plot/Land Services', 'Services related to land and plot transactions', (cast((julianday('now') - 2440587.5)*86400000 as integer))),
('Mmatseta Services', 'Services for traditional Botswana land allocation system', (cast((julianday('now') - 2440587.5)*86400000 as integer)));
