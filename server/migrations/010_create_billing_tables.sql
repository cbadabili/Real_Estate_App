
-- Create plans table
CREATE TABLE plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_bwp INTEGER NOT NULL DEFAULT 0,
  interval TEXT NOT NULL DEFAULT 'monthly',
  features TEXT NOT NULL DEFAULT '{}',
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
  updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL DEFAULT 'pending',
  starts_at INTEGER NOT NULL,
  ends_at INTEGER,
  next_billing_date INTEGER,
  created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
  updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);

-- Create entitlements table
CREATE TABLE entitlements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
  feature_key TEXT NOT NULL,
  feature_value INTEGER NOT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER,
  created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
  updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);

-- Create payments table
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  subscription_id INTEGER REFERENCES subscriptions(id),
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  amount_bwp INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
  updated_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);

-- Create hero_slots table
CREATE TABLE hero_slots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  starts_at INTEGER NOT NULL,
  ends_at INTEGER NOT NULL,
  position INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
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
