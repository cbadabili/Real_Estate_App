-- Create service_providers table for the services API
CREATE TABLE IF NOT EXISTS service_providers (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  contact_person TEXT,
  phone_number TEXT,
  email TEXT UNIQUE,
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  reac_certified BOOLEAN DEFAULT FALSE,
  address TEXT,
  city TEXT,
  rating REAL DEFAULT 4.5,
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create service_ads table
CREATE TABLE IF NOT EXISTS service_ads (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES service_providers(id),
  ad_title TEXT NOT NULL,
  ad_copy TEXT,
  ad_image_url TEXT,
  target_audience TEXT NOT NULL,
  context_trigger TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Learn More',
  cta_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 1,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create service_reviews table
CREATE TABLE IF NOT EXISTS service_reviews (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES service_providers(id),
  user_id INTEGER,
  rating INTEGER NOT NULL,
  review TEXT,
  reviewer_name TEXT,
  reviewer_avatar TEXT,
  verified BOOLEAN DEFAULT FALSE,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_providers_category ON service_providers(service_category);
CREATE INDEX IF NOT EXISTS idx_service_providers_city ON service_providers(city);
CREATE INDEX IF NOT EXISTS idx_service_providers_verified ON service_providers(verified);
CREATE INDEX IF NOT EXISTS idx_service_providers_featured ON service_providers(featured);
CREATE INDEX IF NOT EXISTS idx_service_ads_provider ON service_ads(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_reviews_provider ON service_reviews(provider_id);