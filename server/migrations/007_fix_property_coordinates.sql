
-- Fix missing property coordinates with Botswana city defaults
-- This migration ensures all properties have valid latitude/longitude values

UPDATE properties 
SET 
  latitude = CASE 
    WHEN city LIKE '%Francistown%' THEN -21.1670 + (RANDOM() * 0.02 - 0.01)
    WHEN city LIKE '%Kasane%' THEN -17.8145 + (RANDOM() * 0.02 - 0.01)
    WHEN city LIKE '%Maun%' THEN -20.0028 + (RANDOM() * 0.02 - 0.01)
    WHEN city LIKE '%Palapye%' THEN -22.5500 + (RANDOM() * 0.02 - 0.01)
    WHEN city LIKE '%Serowe%' THEN -22.3833 + (RANDOM() * 0.02 - 0.01)
    ELSE -24.6282 + (RANDOM() * 0.02 - 0.01) -- Default to Gaborone
  END,
  longitude = CASE 
    WHEN city LIKE '%Francistown%' THEN 27.5084 + (RANDOM() * 0.02 - 0.01)
    WHEN city LIKE '%Kasane%' THEN 25.1503 + (RANDOM() * 0.02 - 0.01)
    WHEN city LIKE '%Maun%' THEN 23.4162 + (RANDOM() * 0.02 - 0.01)
    WHEN city LIKE '%Palapye%' THEN 26.8167 + (RANDOM() * 0.02 - 0.01)
    WHEN city LIKE '%Serowe%' THEN 26.7167 + (RANDOM() * 0.02 - 0.01)
    ELSE 25.9231 + (RANDOM() * 0.02 - 0.01) -- Default to Gaborone
  END
WHERE latitude IS NULL OR longitude IS NULL OR latitude = '0' OR longitude = '0' OR latitude = '' OR longitude = '';

-- Update properties with invalid coordinates (outside Botswana bounds)
UPDATE properties 
SET 
  latitude = -24.6282 + (RANDOM() * 0.02 - 0.01),
  longitude = 25.9231 + (RANDOM() * 0.02 - 0.01)
WHERE 
  (latitude IS NOT NULL AND latitude != '' AND latitude::NUMERIC < -26.5) OR 
  (latitude IS NOT NULL AND latitude != '' AND latitude::NUMERIC > -17.5) OR 
  (longitude IS NOT NULL AND longitude != '' AND longitude::NUMERIC < 20.0) OR 
  (longitude IS NOT NULL AND longitude != '' AND longitude::NUMERIC > 29.5);
