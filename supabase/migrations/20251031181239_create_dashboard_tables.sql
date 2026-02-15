/*
  # Create Dashboard Data Tables

  ## Overview
  This migration creates comprehensive tables for storing economic, social, and financial indicators
  for Cambodia's Interactive Dashboards system. The schema supports multi-dimensional analysis
  across time, geography, and sectors.

  ## 1. New Tables

  ### macro_economic_indicators
  Stores macroeconomic data including GDP, inflation, exchange rates, and fiscal budget
  - `id` (uuid, primary key)
  - `indicator_type` (text) - GDP, inflation, exchange_rate, fiscal_budget
  - `year` (integer) - Year of data
  - `quarter` (integer, nullable) - Quarter if applicable
  - `month` (integer, nullable) - Month if applicable
  - `value` (decimal) - Numeric value
  - `unit` (text) - Unit of measurement (USD, percent, KHR, etc.)
  - `province_id` (uuid, nullable) - Links to provinces for regional data
  - `source` (text) - Data source reference
  - `notes_km` (text) - Notes in Khmer
  - `notes_en` (text) - Notes in English
  - `notes_zh` (text) - Notes in Chinese
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### population_indicators
  Stores population and labor force data
  - `id` (uuid, primary key)
  - `indicator_type` (text) - population, employment_rate, migration, age_structure
  - `year` (integer)
  - `province_id` (uuid, nullable)
  - `age_group` (text, nullable) - 0-14, 15-64, 65+, etc.
  - `gender` (text, nullable) - male, female, total
  - `value` (decimal)
  - `unit` (text)
  - `source` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### industry_indicators
  Stores industrial sector data
  - `id` (uuid, primary key)
  - `indicator_type` (text) - manufacturing, agriculture, construction, tourism
  - `sector_name_km` (text)
  - `sector_name_en` (text)
  - `sector_name_zh` (text)
  - `year` (integer)
  - `quarter` (integer, nullable)
  - `province_id` (uuid, nullable)
  - `value` (decimal)
  - `unit` (text)
  - `source` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### trade_indicators
  Stores international trade data
  - `id` (uuid, primary key)
  - `indicator_type` (text) - export, import, trade_balance
  - `year` (integer)
  - `month` (integer, nullable)
  - `partner_country` (text, nullable) - Trading partner
  - `product_category_km` (text, nullable)
  - `product_category_en` (text, nullable)
  - `product_category_zh` (text, nullable)
  - `value` (decimal) - Value in USD
  - `unit` (text)
  - `source` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### finance_indicators
  Stores financial system data
  - `id` (uuid, primary key)
  - `indicator_type` (text) - money_supply, credit, foreign_reserves, interest_rate
  - `year` (integer)
  - `month` (integer, nullable)
  - `value` (decimal)
  - `unit` (text)
  - `source` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### social_indicators
  Stores social development data
  - `id` (uuid, primary key)
  - `indicator_type` (text) - education, poverty, health, infrastructure
  - `year` (integer)
  - `province_id` (uuid, nullable)
  - `category_km` (text)
  - `category_en` (text)
  - `category_zh` (text)
  - `value` (decimal)
  - `unit` (text)
  - `source` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Security
  All tables have RLS enabled with public read access for displaying data.

  ## 3. Indexes
  Indexes are created on commonly queried columns for performance:
  - indicator_type, year, province_id for all tables
  - Additional indexes for filtering and sorting
*/

-- Create macro_economic_indicators table
CREATE TABLE IF NOT EXISTS macro_economic_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_type text NOT NULL,
  year integer NOT NULL,
  quarter integer,
  month integer,
  value decimal NOT NULL,
  unit text NOT NULL,
  province_id uuid REFERENCES provinces(id),
  source text,
  notes_km text,
  notes_en text,
  notes_zh text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create population_indicators table
CREATE TABLE IF NOT EXISTS population_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_type text NOT NULL,
  year integer NOT NULL,
  province_id uuid REFERENCES provinces(id),
  age_group text,
  gender text,
  value decimal NOT NULL,
  unit text NOT NULL,
  source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create industry_indicators table
CREATE TABLE IF NOT EXISTS industry_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_type text NOT NULL,
  sector_name_km text NOT NULL,
  sector_name_en text NOT NULL,
  sector_name_zh text NOT NULL,
  year integer NOT NULL,
  quarter integer,
  province_id uuid REFERENCES provinces(id),
  value decimal NOT NULL,
  unit text NOT NULL,
  source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trade_indicators table
CREATE TABLE IF NOT EXISTS trade_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_type text NOT NULL,
  year integer NOT NULL,
  month integer,
  partner_country text,
  product_category_km text,
  product_category_en text,
  product_category_zh text,
  value decimal NOT NULL,
  unit text NOT NULL,
  source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create finance_indicators table
CREATE TABLE IF NOT EXISTS finance_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_type text NOT NULL,
  year integer NOT NULL,
  month integer,
  value decimal NOT NULL,
  unit text NOT NULL,
  source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_indicators table
CREATE TABLE IF NOT EXISTS social_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_type text NOT NULL,
  year integer NOT NULL,
  province_id uuid REFERENCES provinces(id),
  category_km text NOT NULL,
  category_en text NOT NULL,
  category_zh text NOT NULL,
  value decimal NOT NULL,
  unit text NOT NULL,
  source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE macro_economic_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE population_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_indicators ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view macro economic indicators"
  ON macro_economic_indicators FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view population indicators"
  ON population_indicators FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view industry indicators"
  ON industry_indicators FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view trade indicators"
  ON trade_indicators FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view finance indicators"
  ON finance_indicators FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view social indicators"
  ON social_indicators FOR SELECT
  TO anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_macro_indicators_type_year ON macro_economic_indicators(indicator_type, year);
CREATE INDEX IF NOT EXISTS idx_macro_indicators_province ON macro_economic_indicators(province_id);

CREATE INDEX IF NOT EXISTS idx_population_type_year ON population_indicators(indicator_type, year);
CREATE INDEX IF NOT EXISTS idx_population_province ON population_indicators(province_id);

CREATE INDEX IF NOT EXISTS idx_industry_type_year ON industry_indicators(indicator_type, year);
CREATE INDEX IF NOT EXISTS idx_industry_province ON industry_indicators(province_id);

CREATE INDEX IF NOT EXISTS idx_trade_type_year ON trade_indicators(indicator_type, year);
CREATE INDEX IF NOT EXISTS idx_trade_partner ON trade_indicators(partner_country);

CREATE INDEX IF NOT EXISTS idx_finance_type_year ON finance_indicators(indicator_type, year);

CREATE INDEX IF NOT EXISTS idx_social_type_year ON social_indicators(indicator_type, year);
CREATE INDEX IF NOT EXISTS idx_social_province ON social_indicators(province_id);