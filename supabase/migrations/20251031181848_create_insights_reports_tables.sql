/*
  # Create Data Insights and Reports Tables

  ## Overview
  This migration creates tables for storing AI-generated insights, custom reports,
  and official report documents for Cambodia's data portal.

  ## 1. New Tables

  ### data_insights
  Stores AI-generated data summaries and trend analysis
  - `id` (uuid, primary key)
  - `insight_type` (text) - summary, trend, comparison, forecast
  - `title_km` (text)
  - `title_en` (text)
  - `title_zh` (text)
  - `content_km` (text) - Main insight content
  - `content_en` (text)
  - `content_zh` (text)
  - `indicator_types` (text[]) - Array of related indicators
  - `time_period_start` (date)
  - `time_period_end` (date)
  - `key_findings_km` (text[]) - Array of key findings
  - `key_findings_en` (text[])
  - `key_findings_zh` (text[])
  - `confidence_score` (decimal) - AI confidence level
  - `data_sources` (text[]) - Source references
  - `is_featured` (boolean) - Show on homepage
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### official_reports
  Stores official government and institutional reports
  - `id` (uuid, primary key)
  - `title_km` (text)
  - `title_en` (text)
  - `title_zh` (text)
  - `description_km` (text)
  - `description_en` (text)
  - `description_zh` (text)
  - `report_type` (text) - census, survey, economic, social, industry
  - `publisher_km` (text) - Publishing organization
  - `publisher_en` (text)
  - `publisher_zh` (text)
  - `publication_date` (date)
  - `year_covered` (integer) - Year the report covers
  - `file_url` (text) - Link to PDF or document
  - `file_size` (text) - File size in MB
  - `language` (text) - Document language
  - `tags` (text[]) - Search tags
  - `download_count` (integer) - Track popularity
  - `is_featured` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### custom_reports
  Stores user-generated custom reports
  - `id` (uuid, primary key)
  - `report_name` (text)
  - `selected_indicators` (jsonb) - Indicator selections
  - `time_range_start` (date)
  - `time_range_end` (date)
  - `filters` (jsonb) - Province, sector filters
  - `chart_types` (text[]) - Visualization types
  - `generated_at` (timestamptz)
  - `format` (text) - pdf, excel, csv
  - `user_id` (uuid, nullable) - For logged-in users
  - `created_at` (timestamptz)

  ## 2. Security
  All tables have RLS enabled with public read access.

  ## 3. Indexes
  Performance indexes on commonly queried fields.
*/

-- Create data_insights table
CREATE TABLE IF NOT EXISTS data_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type text NOT NULL,
  title_km text NOT NULL,
  title_en text NOT NULL,
  title_zh text NOT NULL,
  content_km text NOT NULL,
  content_en text NOT NULL,
  content_zh text NOT NULL,
  indicator_types text[] DEFAULT '{}',
  time_period_start date,
  time_period_end date,
  key_findings_km text[] DEFAULT '{}',
  key_findings_en text[] DEFAULT '{}',
  key_findings_zh text[] DEFAULT '{}',
  confidence_score decimal DEFAULT 0.0,
  data_sources text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create official_reports table
CREATE TABLE IF NOT EXISTS official_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_km text NOT NULL,
  title_en text NOT NULL,
  title_zh text NOT NULL,
  description_km text NOT NULL,
  description_en text NOT NULL,
  description_zh text NOT NULL,
  report_type text NOT NULL,
  publisher_km text NOT NULL,
  publisher_en text NOT NULL,
  publisher_zh text NOT NULL,
  publication_date date NOT NULL,
  year_covered integer,
  file_url text NOT NULL,
  file_size text,
  language text NOT NULL,
  tags text[] DEFAULT '{}',
  download_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create custom_reports table
CREATE TABLE IF NOT EXISTS custom_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_name text NOT NULL,
  selected_indicators jsonb NOT NULL,
  time_range_start date NOT NULL,
  time_range_end date NOT NULL,
  filters jsonb DEFAULT '{}',
  chart_types text[] DEFAULT '{}',
  generated_at timestamptz DEFAULT now(),
  format text DEFAULT 'pdf',
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE data_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view data insights"
  ON data_insights FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view official reports"
  ON official_reports FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view custom reports"
  ON custom_reports FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create custom reports"
  ON custom_reports FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_insights_type ON data_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_insights_featured ON data_insights(is_featured);
CREATE INDEX IF NOT EXISTS idx_insights_time ON data_insights(time_period_start, time_period_end);

CREATE INDEX IF NOT EXISTS idx_reports_type ON official_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_year ON official_reports(year_covered);
CREATE INDEX IF NOT EXISTS idx_reports_featured ON official_reports(is_featured);
CREATE INDEX IF NOT EXISTS idx_reports_tags ON official_reports USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_custom_reports_date ON custom_reports(generated_at);

-- Insert sample data insights
INSERT INTO data_insights (
  insight_type, title_km, title_en, title_zh,
  content_km, content_en, content_zh,
  indicator_types, time_period_start, time_period_end,
  key_findings_km, key_findings_en, key_findings_zh,
  confidence_score, data_sources, is_featured
) VALUES
(
  'trend',
  'សេដ្ឋកិច្ចកម្ពុជាបន្តរីកចម្រើនក្នុងឆ្នាំ 2023',
  'Cambodia Economy Continues Growth in 2023',
  '2023年柬埔寨经济持续增长',
  'សេដ្ឋកិច្ចកម្ពុជាបានកត់ត្រាកំណើន 5.5% ក្នុងឆ្នាំ 2023 ដែលជាការងើបឡើងពីប៉ះពាល់នៃជំងឺកូវីដ-19។ វិស័យទេសចរណ៍ និងឧស្សាហកម្មសំណង់បានចាប់ផ្តើមស្ទះយ៉ាងខ្លាំង។',
  'Cambodia economy recorded 5.5% growth in 2023, marking a strong recovery from COVID-19 impacts. Tourism and construction sectors showed robust momentum.',
  '柬埔寨经济在2023年录得5.5%的增长，标志着从新冠疫情影响中强劲复苏。旅游业和建筑业显示出强劲势头。',
  ARRAY['gdp', 'growth', 'tourism', 'construction'],
  '2023-01-01', '2023-12-31',
  ARRAY['កំណើនសេដ្ឋកិច្ច 5.5%', 'វិស័យទេសចរណ៍កើនឡើង 35%', 'ការវិនិយោគបរទេសកើនឡើង 12%'],
  ARRAY['5.5% GDP growth', '35% increase in tourism', '12% rise in foreign investment'],
  ARRAY['GDP增长5.5%', '旅游业增长35%', '外国投资增长12%'],
  0.92,
  ARRAY['Ministry of Economy and Finance', 'National Bank of Cambodia'],
  true
),
(
  'summary',
  'ការវិភាគប្រជាជនកម្ពុជា 2020-2023',
  'Cambodia Population Analysis 2020-2023',
  '柬埔寨人口分析 2020-2023',
  'ប្រជាជនកម្ពុជាបានកើនឡើងដល់ 16.9 លាននាក់ក្នុងឆ្នាំ 2023។ អត្រាកំណើនប្រជាជនស្ថិតនៅត្រឹម 1.2% ប្រចាំឆ្នាំ។',
  'Cambodia population reached 16.9 million in 2023. Population growth rate stands at 1.2% annually.',
  '2023年柬埔寨人口达到1690万。人口年增长率为1.2%。',
  ARRAY['population', 'demographics'],
  '2020-01-01', '2023-12-31',
  ARRAY['ប្រជាជន 16.9 លាននាក់', 'អត្រាកំណើន 1.2%', '65% នៅតំបន់ជនបទ'],
  ARRAY['16.9 million population', '1.2% growth rate', '65% in rural areas'],
  ARRAY['人口1690万', '增长率1.2%', '65%在农村地区'],
  0.95,
  ARRAY['National Institute of Statistics'],
  true
);

-- Insert sample official reports
INSERT INTO official_reports (
  title_km, title_en, title_zh,
  description_km, description_en, description_zh,
  report_type, publisher_km, publisher_en, publisher_zh,
  publication_date, year_covered, file_url, file_size, language, tags, is_featured
) VALUES
(
  'របាយការណ៍ជំរឿនសេដ្ឋកិច្ច 2022',
  'Economic Census Report 2022',
  '经济普查报告 2022',
  'របាយការណ៍ជំរឿនសេដ្ឋកិច្ចលើកទី 4 របស់កម្ពុជា',
  'Fourth Economic Census of Cambodia',
  '柬埔寨第四次经济普查',
  'census',
  'វិទ្យាស្ថានជាតិស្ថិតិ',
  'National Institute of Statistics',
  '国家统计局',
  '2023-06-15', 2022,
  '#', '15.2 MB', 'km',
  ARRAY['census', 'economy', 'business'],
  true
),
(
  'ការស្ទង់មតិទំនុកចិត្តអាជីវកម្ម 2024',
  'Business Confidence Survey 2024',
  '商业信心调查 2024',
  'ការវាយតម្លៃទំនុកចិត្តរបស់អាជីវករកម្ពុជា',
  'Assessment of Cambodian business sentiment',
  '柬埔寨商业信心评估',
  'survey',
  'សភាពាណិជ្ជកម្មកម្ពុជា',
  'Cambodia Chamber of Commerce',
  '柬埔寨商会',
  '2024-03-20', 2024,
  '#', '8.5 MB', 'en',
  ARRAY['survey', 'business', 'confidence'],
  true
),
(
  'របាយការណ៍ពាណិជ្ជកម្មប្រចាំឆ្នាំ 2023',
  'Annual Trade Report 2023',
  '年度贸易报告 2023',
  'ទិន្នន័យពាណិជ្ជកម្មនាំចូល-នាំចេញ',
  'Import-Export trade data',
  '进出口贸易数据',
  'economic',
  'ក្រសួងពាណិជ្ជកម្ម',
  'Ministry of Commerce',
  '商务部',
  '2024-02-10', 2023,
  '#', '12.7 MB', 'km',
  ARRAY['trade', 'export', 'import'],
  true
);
