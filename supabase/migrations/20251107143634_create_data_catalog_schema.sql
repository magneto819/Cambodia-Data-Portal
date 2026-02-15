/*
  # Create Data Catalog and Thematic Datasets Schema

  1. New Tables
    - `data_catalog`
      - `id` (uuid, primary key)
      - `title_en`, `title_km`, `title_zh` (text) - Dataset titles in 3 languages
      - `description_en`, `description_km`, `description_zh` (text) - Descriptions
      - `category` (text) - Main category (economy, education, health, etc.)
      - `subcategory` (text) - Subcategory
      - `tags` (text[]) - Array of searchable tags
      - `data_source` (text) - Source organization
      - `update_frequency` (text) - How often data is updated
      - `last_updated` (timestamptz) - Last update date
      - `format` (text) - Data format (CSV, JSON, Excel, etc.)
      - `license` (text) - Open Data License type
      - `file_url` (text) - URL to download/access data
      - `api_endpoint` (text) - API endpoint if available
      - `start_year` (integer) - Data coverage start year
      - `end_year` (integer) - Data coverage end year
      - `province_level` (boolean) - Whether data is available at province level
      - `district_level` (boolean) - Whether data is available at district level
      - `download_count` (integer) - Number of downloads
      - `view_count` (integer) - Number of views
      - `featured` (boolean) - Whether to feature this dataset
      - `is_active` (boolean) - Whether dataset is active
      - `created_at`, `updated_at` (timestamptz)
      
    - `thematic_categories`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `name_en`, `name_km`, `name_zh` (text) - Category names
      - `description_en`, `description_km`, `description_zh` (text)
      - `icon` (text) - Icon identifier
      - `color` (text) - Theme color
      - `display_order` (integer)
      - `is_active` (boolean)
      - `created_at`, `updated_at` (timestamptz)

    - `dataset_metrics`
      - `id` (uuid, primary key)
      - `dataset_id` (uuid, foreign key)
      - `year` (integer)
      - `province_code` (text) - Optional province filter
      - `metric_name` (text)
      - `metric_value` (numeric)
      - `unit` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

-- Create data_catalog table
CREATE TABLE IF NOT EXISTS data_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_km text NOT NULL,
  title_zh text NOT NULL,
  description_en text,
  description_km text,
  description_zh text,
  category text NOT NULL,
  subcategory text,
  tags text[] DEFAULT '{}',
  data_source text NOT NULL,
  update_frequency text,
  last_updated timestamptz DEFAULT now(),
  format text NOT NULL,
  license text DEFAULT 'Open Data',
  file_url text,
  api_endpoint text,
  start_year integer,
  end_year integer,
  province_level boolean DEFAULT false,
  district_level boolean DEFAULT false,
  download_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create thematic_categories table
CREATE TABLE IF NOT EXISTS thematic_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_km text NOT NULL,
  name_zh text NOT NULL,
  description_en text,
  description_km text,
  description_zh text,
  icon text,
  color text DEFAULT 'blue',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dataset_metrics table
CREATE TABLE IF NOT EXISTS dataset_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES data_catalog(id) ON DELETE CASCADE,
  year integer NOT NULL,
  province_code text,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  unit text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE data_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE thematic_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for data_catalog (public read)
CREATE POLICY "Anyone can view active datasets"
  ON data_catalog FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert datasets"
  ON data_catalog FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update datasets"
  ON data_catalog FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for thematic_categories (public read)
CREATE POLICY "Anyone can view active categories"
  ON thematic_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories"
  ON thematic_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for dataset_metrics (public read)
CREATE POLICY "Anyone can view dataset metrics"
  ON dataset_metrics FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage metrics"
  ON dataset_metrics FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_data_catalog_category ON data_catalog(category);
CREATE INDEX IF NOT EXISTS idx_data_catalog_tags ON data_catalog USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_data_catalog_featured ON data_catalog(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_dataset_metrics_dataset ON dataset_metrics(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_metrics_year ON dataset_metrics(year);

-- Insert thematic categories
INSERT INTO thematic_categories (slug, name_en, name_km, name_zh, description_en, description_km, description_zh, icon, color, display_order)
VALUES 
  ('macro-economy', 'Macro Economy', 'សេដ្ឋកិច្ចម៉ាក្រូ', '宏观经济', 'GDP, CPI, Trade, Foreign Investment', 'ផលិតផលក្នុងស្រុកសរុប និងពាណិជ្ជកម្ម', 'GDP、消费者物价指数、贸易、外商投资', 'TrendingUp', 'blue', 1),
  ('investment-industry', 'Investment & Industry', 'វិនិយោគនិងឧស្សាហកម្ម', '投资与产业', 'Economic zones, FDI, Industry statistics', 'តំបន់សេដ្ឋកិច្ច និងស្ថិតិឧស្សាហកម្ម', '经济特区、外商直接投资、行业统计', 'Building2', 'green', 2),
  ('education-labor', 'Education & Labor', 'ការអប់រំនិងកម្លាំងពលកម្ម', '教育与劳动力', 'Universities, Employment, Skills', 'សាកលវិទ្យាល័យ និងការងារ', '高校、就业、技能', 'GraduationCap', 'purple', 3),
  ('population-social', 'Population & Social', 'ប្រជាជននិងសង្គម', '人口与社会', 'Census, Urbanization, Income, Poverty', 'ជំរឿនប្រជាជន និងកម្រិតរស់នៅ', '人口普查、城市化、收入、贫困', 'Users', 'orange', 4),
  ('infrastructure', 'Infrastructure', 'ហេដ្ឋារចនាសម្ព័ន្ធ', '基础设施', 'Roads, Airports, Power, Water', 'ផ្លូវ អាកាសយានដ្ឋាន អគ្គិសនី', '公路、机场、电力、水利', 'Construction', 'red', 5),
  ('environment-energy', 'Environment & Energy', 'បរិស្ថាននិងថាមពល', '环境与能源', 'Renewable energy, Emissions, Forests', 'ថាមពលកកើតឡើងវិញ និងព្រៃឈើ', '可再生能源、排放、森林', 'Leaf', 'teal', 6),
  ('digital-economy', 'Digital Economy', 'សេដ្ឋកិច្ចឌីជីថល', '数字经济', 'E-commerce, Internet, Mobile payments', 'ពាណិជ្ជកម្មអេឡិចត្រូនិក និងអ៊ីនធឺណិត', '电子商务、互联网、移动支付', 'Smartphone', 'indigo', 7),
  ('health', 'Health', 'សុខភាព', '卫生健康', 'Healthcare facilities, Disease statistics', 'មជ្ឈមណ្ឌលសុខភាព និងជម្ងឺ', '医疗设施、疾病统计', 'Heart', 'pink', 8)
ON CONFLICT (slug) DO NOTHING;