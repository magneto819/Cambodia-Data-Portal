/*
  # Add Data Sources Table

  1. New Tables
    - `data_sources`
      - `id` (uuid, primary key)
      - `name_km` (text) - Source name in Khmer
      - `name_en` (text) - Source name in English
      - `name_zh` (text) - Source name in Chinese
      - `website` (text) - Official website URL
      - `content_type_km` (text) - Content types in Khmer
      - `content_type_en` (text) - Content types in English
      - `content_type_zh` (text) - Content types in Chinese
      - `update_frequency_km` (text) - Update frequency in Khmer
      - `update_frequency_en` (text) - Update frequency in English
      - `update_frequency_zh` (text) - Update frequency in Chinese
      - `acronym` (text) - Short acronym
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on data_sources table
    - Add policy for public read access

  3. Data
    - Insert all data sources from the provided list
*/

-- Create data_sources table
CREATE TABLE IF NOT EXISTS data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_km text NOT NULL,
  name_en text NOT NULL,
  name_zh text NOT NULL,
  website text NOT NULL,
  content_type_km text NOT NULL,
  content_type_en text NOT NULL,
  content_type_zh text NOT NULL,
  update_frequency_km text NOT NULL,
  update_frequency_en text NOT NULL,
  update_frequency_zh text NOT NULL,
  acronym text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can view data sources"
  ON data_sources FOR SELECT
  TO anon
  USING (true);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_data_sources_order ON data_sources(display_order);

-- Insert data sources
INSERT INTO data_sources (name_km, name_en, name_zh, website, content_type_km, content_type_en, content_type_zh, update_frequency_km, update_frequency_en, update_frequency_zh, acronym, display_order) VALUES
(
  'វិទ្យាស្ថានជាតិស្ថិតិ',
  'National Institute of Statistics',
  '柬埔寨国家统计局',
  'nis.gov.kh',
  'ប្រជាជន, សេដ្ឋកិច្ច, ការស្ទង់មតិសង្គម, របាយការណ៍ស្ថិតិប្រចាំឆ្នាំ',
  'Population, Economy, Social Surveys, Annual Statistical Reports',
  '人口、经济、社会调查、统计年鉴',
  'ប្រចាំឆ្នាំ/ប្រចាំរដូវកាល',
  'Annual/Seasonal',
  '年度/季度',
  'NIS',
  1
),
(
  'ក្រសួងសេដ្ឋកិច្ចនិងហិរញ្ញវត្ថុ',
  'Ministry of Economy and Finance',
  '经济与财政部',
  'mef.gov.kh / data.mef.gov.kh',
  'គោលនយោបាយហិរញ្ញវត្ថុ, ថវិកាជាតិ, ការវិនិយោគសាធារណៈ',
  'Fiscal Policy, National Budget, Public Investment',
  '财政预算、经济政策、公共投资',
  'ប្រចាំខែ',
  'Monthly',
  '月度',
  'MEF',
  2
),
(
  'ធនាគារជាតិ',
  'National Bank of Cambodia',
  '国家银行',
  'nbc.org.kh',
  'អត្រាប្តូរប្រាក់, អត្រាការប្រាក់, អត្រាកម្ចី',
  'Exchange Rates, Interest Rates, Loan Rates',
  '货币膨胀、利率、汇率、信贷',
  'ប្រចាំខែ',
  'Monthly',
  '月度',
  'NBC',
  3
),
(
  'ក្រសួងពាណិជ្ជកម្ម',
  'Ministry of Commerce',
  '商务部',
  'moc.gov.kh',
  'ពាណិជ្ជកម្ម, ការចុះបញ្ជីក្រុមហ៊ុន, ទិន្នន័យនាំចេញនាំចូល',
  'Trade, Company Registration, Export-Import Data',
  '贸易、公司注册、出口数据',
  'ប្រចាំខែ',
  'Monthly',
  '月度',
  'MoC',
  4
),
(
  'ធនាគារពិភពលោក',
  'World Bank',
  '世界银行',
  'data.worldbank.org',
  'ផលិតផលក្នុងស្រុកសរុប, សូចនាករអប់រំ, សូចនាករអភិវឌ្ឍន៍',
  'GDP, Education Indicators, Development Indicators',
  'GDP、贫困率、教育指标',
  'ជាក់ស្តែង',
  'Real-time',
  '实时',
  'World Bank',
  5
),
(
  'ធនាគារអភិវឌ្ឍន៍អាស៊ី',
  'Asian Development Bank',
  '亚洲开发银行',
  'data.adb.org',
  'សូចនាករសង្គម-សេដ្ឋកិច្ច',
  'Socio-Economic Indicators',
  '经济社会指标',
  'ប្រចាំរដូវកាល',
  'Quarterly',
  '季度',
  'ADB',
  6
),
(
  'IMF Data',
  'IMF Data',
  'IMF数据',
  'data.imf.org',
  'ទិន្នន័យហិរញ្ញវត្ថុនិងធនាគារអន្តរជាតិ',
  'International Finance and Banking Data',
  '宏观金融与外汇储备',
  'ប្រចាំរដូវកាល',
  'Quarterly',
  '季度',
  'IMF Data',
  7
),
(
  'EuroCham Cambodia',
  'EuroCham Cambodia',
  '欧洲商会柬埔寨',
  'eurocham-cambodia.org',
  'របាយការណ៍អាជីវកម្មនិងឧស្សាហកម្ម',
  'Business and Industry Reports',
  '商业信心与行业报告',
  'ប្រចាំឆ្នាំ',
  'Annual',
  '年度',
  'EuroCham',
  8
),
(
  'AmCham Cambodia',
  'AmCham Cambodia',
  '美国商会柬埔寨',
  'amchamcambodia.net',
  'ការស្ទង់មតិបរិយាកាសអាជីវកម្មនិងការវិនិយោគ',
  'Business Environment and Investment Surveys',
  '营商环境与投资调查',
  'ប្រចាំឆ្នាំ',
  'Annual',
  '年度',
  'AmCham',
  9
)
ON CONFLICT DO NOTHING;