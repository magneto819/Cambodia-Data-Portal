export interface Province {
  id: string;
  code: string;
  name_km: string;
  name_en: string;
  capital: string;
  area_km2: number;
  population: number;
  density: number;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: string;
  province_id: string;
  code: string;
  name_km: string;
  name_en: string;
  area_km2: number;
  population: number;
  created_at: string;
  updated_at: string;
}

export interface Commune {
  id: string;
  district_id: string;
  code: string;
  name_km: string;
  name_en: string;
  type: 'commune' | 'sangkat';
  population: number;
  created_at: string;
  updated_at: string;
}

export interface Village {
  id: string;
  commune_id: string;
  code: string;
  name_km: string;
  name_en: string;
  population: number;
  households: number;
  created_at: string;
  updated_at: string;
}

export interface Demographics {
  id: string;
  entity_type: 'province' | 'district' | 'commune' | 'village';
  entity_id: string;
  year: number;
  male_population: number;
  female_population: number;
  households: number;
  literacy_rate: number;
  created_at: string;
  updated_at: string;
}

export type Language = 'km' | 'en' | 'zh';

export type MapLayer = 'gdp' | 'population' | 'education' | 'healthcare' | 'investment' | 'infrastructure';

export type MapVisualization = 'standard' | 'heatmap' | 'cluster';

export interface MapFilterState {
  layer: MapLayer;
  visualization: MapVisualization;
  yearRange: [number, number];
  populationRange?: [number, number];
  industryType?: string;
  showLabels: boolean;
}

export interface ProvinceData extends Province {
  gdp?: number;
  gdpGrowth?: number;
  educationIndex?: number;
  healthcareIndex?: number;
  investmentAmount?: number;
  infrastructureScore?: number;
  coordinates?: [number, number];
}

export interface DataPoint {
  id: string;
  provinceId: string;
  lat: number;
  lng: number;
  value: number;
  type: string;
  name: string;
  metadata?: Record<string, any>;
}

export interface DataSource {
  id: string;
  name_km: string;
  name_en: string;
  name_zh: string;
  website: string;
  content_type_km: string;
  content_type_en: string;
  content_type_zh: string;
  update_frequency_km: string;
  update_frequency_en: string;
  update_frequency_zh: string;
  acronym: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MacroEconomicIndicator {
  id: string;
  indicator_type: string;
  year: number;
  quarter?: number;
  month?: number;
  value: number;
  unit: string;
  province_id?: string;
  source?: string;
  notes_km?: string;
  notes_en?: string;
  notes_zh?: string;
  created_at: string;
  updated_at: string;
}

export interface PopulationIndicator {
  id: string;
  indicator_type: string;
  year: number;
  province_id?: string;
  age_group?: string;
  gender?: string;
  value: number;
  unit: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface IndustryIndicator {
  id: string;
  indicator_type: string;
  sector_name_km: string;
  sector_name_en: string;
  sector_name_zh: string;
  year: number;
  quarter?: number;
  province_id?: string;
  value: number;
  unit: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface TradeIndicator {
  id: string;
  indicator_type: string;
  year: number;
  month?: number;
  partner_country?: string;
  product_category_km?: string;
  product_category_en?: string;
  product_category_zh?: string;
  value: number;
  unit: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceIndicator {
  id: string;
  indicator_type: string;
  year: number;
  month?: number;
  value: number;
  unit: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialIndicator {
  id: string;
  indicator_type: string;
  year: number;
  province_id?: string;
  category_km: string;
  category_en: string;
  category_zh: string;
  value: number;
  unit: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export type DashboardType = 'macro' | 'population' | 'industry' | 'trade' | 'finance' | 'social';

export interface DataInsight {
  id: string;
  insight_type: string;
  title_km: string;
  title_en: string;
  title_zh: string;
  content_km: string;
  content_en: string;
  content_zh: string;
  indicator_types: string[];
  time_period_start?: string;
  time_period_end?: string;
  key_findings_km: string[];
  key_findings_en: string[];
  key_findings_zh: string[];
  confidence_score: number;
  data_sources: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface OfficialReport {
  id: string;
  title_km: string;
  title_en: string;
  title_zh: string;
  description_km: string;
  description_en: string;
  description_zh: string;
  report_type: string;
  publisher_km: string;
  publisher_en: string;
  publisher_zh: string;
  publication_date: string;
  year_covered?: number;
  file_url: string;
  file_size?: string;
  language: string;
  tags: string[];
  download_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
