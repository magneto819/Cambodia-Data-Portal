/*
  # Cambodia Data Portal Schema

  1. New Tables
    - `provinces`
      - `id` (uuid, primary key)
      - `code` (text, unique) - Province code
      - `name_km` (text) - Khmer name
      - `name_en` (text) - English name
      - `capital` (text) - Provincial capital
      - `area_km2` (numeric) - Area in square kilometers
      - `population` (integer) - Population count
      - `density` (numeric) - Population density
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `districts`
      - `id` (uuid, primary key)
      - `province_id` (uuid, foreign key)
      - `code` (text, unique)
      - `name_km` (text)
      - `name_en` (text)
      - `area_km2` (numeric)
      - `population` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `communes`
      - `id` (uuid, primary key)
      - `district_id` (uuid, foreign key)
      - `code` (text, unique)
      - `name_km` (text)
      - `name_en` (text)
      - `type` (text) - 'commune' or 'sangkat'
      - `population` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `villages`
      - `id` (uuid, primary key)
      - `commune_id` (uuid, foreign key)
      - `code` (text, unique)
      - `name_km` (text)
      - `name_en` (text)
      - `population` (integer)
      - `households` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `demographics`
      - `id` (uuid, primary key)
      - `entity_type` (text) - 'province', 'district', 'commune', 'village'
      - `entity_id` (uuid)
      - `year` (integer)
      - `male_population` (integer)
      - `female_population` (integer)
      - `households` (integer)
      - `literacy_rate` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (data portal is public)
*/

-- Create provinces table
CREATE TABLE IF NOT EXISTS provinces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name_km text NOT NULL,
  name_en text NOT NULL,
  capital text,
  area_km2 numeric,
  population integer DEFAULT 0,
  density numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id uuid REFERENCES provinces(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  name_km text NOT NULL,
  name_en text NOT NULL,
  area_km2 numeric,
  population integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create communes table
CREATE TABLE IF NOT EXISTS communes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id uuid REFERENCES districts(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  name_km text NOT NULL,
  name_en text NOT NULL,
  type text DEFAULT 'commune',
  population integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create villages table
CREATE TABLE IF NOT EXISTS villages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commune_id uuid REFERENCES communes(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  name_km text NOT NULL,
  name_en text NOT NULL,
  population integer DEFAULT 0,
  households integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create demographics table
CREATE TABLE IF NOT EXISTS demographics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  year integer NOT NULL,
  male_population integer DEFAULT 0,
  female_population integer DEFAULT 0,
  households integer DEFAULT 0,
  literacy_rate numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(entity_type, entity_id, year)
);

-- Enable RLS
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE communes ENABLE ROW LEVEL SECURITY;
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE demographics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view provinces"
  ON provinces FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view districts"
  ON districts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view communes"
  ON communes FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view villages"
  ON villages FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view demographics"
  ON demographics FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_districts_province_id ON districts(province_id);
CREATE INDEX IF NOT EXISTS idx_communes_district_id ON communes(district_id);
CREATE INDEX IF NOT EXISTS idx_villages_commune_id ON villages(commune_id);
CREATE INDEX IF NOT EXISTS idx_demographics_entity ON demographics(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_demographics_year ON demographics(year);

-- Insert sample data for Cambodia's 25 provinces
INSERT INTO provinces (code, name_km, name_en, capital, area_km2, population) VALUES
('01', 'បន្ទាយមានជ័យ', 'Banteay Meanchey', 'Sisophon', 6679, 861883),
('02', 'បាត់ដំបង', 'Battambang', 'Battambang', 11702, 1025174),
('03', 'កំពង់ចាម', 'Kampong Cham', 'Kampong Cham', 9799, 1859126),
('04', 'កំពង់ឆ្នាំង', 'Kampong Chhnang', 'Kampong Chhnang', 5521, 532384),
('05', 'កំពង់ស្ពឺ', 'Kampong Speu', 'Chbar Mon', 7017, 871831),
('06', 'កំពង់ធំ', 'Kampong Thom', 'Kampong Thom', 13814, 699635),
('07', 'កំពត', 'Kampot', 'Kampot', 4873, 626799),
('08', 'កណ្តាល', 'Kandal', 'Ta Khmau', 3568, 1265085),
('09', 'កោះកុង', 'Koh Kong', 'Koh Kong', 11160, 124294),
('10', 'កែប', 'Kep', 'Kep', 336, 42665),
('11', 'ក្រចេះ', 'Kratie', 'Kratie', 11094, 382860),
('12', 'មណ្ឌលគិរី', 'Mondulkiri', 'Sen Monorom', 14288, 92213),
('13', 'ភ្នំពេញ', 'Phnom Penh', 'Phnom Penh', 679, 2281951),
('14', 'ព្រះវិហារ', 'Preah Vihear', 'Preah Vihear', 13788, 254165),
('15', 'ព្រៃវែង', 'Prey Veng', 'Prey Veng', 4883, 1069949),
('16', 'ពោធិ៍សាត់', 'Pursat', 'Pursat', 12692, 426027),
('17', 'រតនគិរី', 'Ratanakiri', 'Banlung', 10782, 200000),
('18', 'សៀមរាប', 'Siem Reap', 'Siem Reap', 10299, 1006512),
('19', 'ព្រះសីហនុ', 'Preah Sihanouk', 'Sihanoukville', 1938, 302318),
('20', 'ស្ទឹងត្រែង', 'Stung Treng', 'Stung Treng', 11092, 167055),
('21', 'ស្វាយរៀង', 'Svay Rieng', 'Svay Rieng', 2966, 513794),
('22', 'តាកែវ', 'Takeo', 'Takeo', 3563, 927125),
('23', 'ឧត្តរមានជ័យ', 'Oddar Meanchey', 'Samraong', 6158, 254470),
('24', 'ត្បូងឃ្មុំ', 'Tboung Khmum', 'Suong', 5250, 784236),
('25', 'បាលីន', 'Pailin', 'Pailin', 803, 80543)
ON CONFLICT (code) DO NOTHING;