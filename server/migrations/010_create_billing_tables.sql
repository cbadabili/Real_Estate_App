
-- Create plans table
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_bwp INTEGER NOT NULL DEFAULT 0,
  interval TEXT NOT NULL DEFAULT 'monthly',
  features TEXT NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT,
  updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL DEFAULT 'pending',
  starts_at BIGINT NOT NULL,
  ends_at BIGINT,
  next_billing_date BIGINT,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT,
  updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT
);

-- Create entitlements table
CREATE TABLE entitlements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
  feature_key TEXT NOT NULL,
  feature_value INTEGER NOT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at BIGINT,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT,
  updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT
);

-- Create payments table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  subscription_id INTEGER REFERENCES subscriptions(id),
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  amount_bwp INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT,
  updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT
);

-- Create hero_slots table
CREATE TABLE hero_slots (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  starts_at BIGINT NOT NULL,
  ends_at BIGINT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT
);

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_entitlements_user_id ON entitlements(user_id);
CREATE INDEX idx_entitlements_feature_key ON entitlements(feature_key);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_hero_slots_property_id ON hero_slots(property_id);
CREATE INDEX idx_hero_slots_active ON hero_slots(is_active, starts_at, ends_at);
