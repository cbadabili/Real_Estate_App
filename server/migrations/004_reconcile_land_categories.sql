
-- Reconcile land property categories
-- Update any 'land for development' entries to 'land'
UPDATE properties 
SET property_type = 'land' 
WHERE property_type IN ('land for development', 'land_for_development', 'development_land');

-- Update rental listings if any exist
UPDATE rentals 
SET property_type = 'land' 
WHERE property_type IN ('land for development', 'land_for_development', 'development_land');

-- Update any service categories that might reference land development
UPDATE service_categories 
SET name = 'Land Development' 
WHERE name IN ('Land for Development', 'Development Land');
