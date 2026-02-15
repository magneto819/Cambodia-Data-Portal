import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { Search, Filter, Download, Calendar, Database, Tag, TrendingUp, ExternalLink } from 'lucide-react';

interface Dataset {
  id: string;
  title_en: string;
  title_km: string;
  title_zh: string;
  description_en: string;
  description_km: string;
  description_zh: string;
  category: string;
  subcategory: string;
  tags: string[];
  data_source: string;
  update_frequency: string;
  last_updated: string;
  format: string;
  license: string;
  file_url: string;
  api_endpoint: string;
  start_year: number;
  end_year: number;
  province_level: boolean;
  district_level: boolean;
  download_count: number;
  view_count: number;
  featured: boolean;
}

interface ThematicCategory {
  id: string;
  slug: string;
  name_en: string;
  name_km: string;
  name_zh: string;
  description_en: string;
  description_km: string;
  description_zh: string;
  icon: string;
  color: string;
}

export function DataCatalogView() {
  const { language, t } = useLanguage();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [categories, setCategories] = useState<ThematicCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [yearRange, setYearRange] = useState<[number, number]>([2015, 2024]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [datasetsResult, categoriesResult] = await Promise.all([
        supabase.from('data_catalog').select('*').order('featured', { ascending: false }).order('title_en'),
        supabase.from('thematic_categories').select('*').order('display_order')
      ]);

      if (datasetsResult.data) setDatasets(datasetsResult.data);
      if (categoriesResult.data) setCategories(categoriesResult.data);
    } catch (error) {
      console.error('Error loading data catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDatasets = datasets.filter(dataset => {
    const query = searchQuery.toLowerCase();
    const title = language === 'km' ? dataset.title_km : language === 'zh' ? dataset.title_zh : dataset.title_en;
    const description = language === 'km' ? dataset.description_km : language === 'zh' ? dataset.description_zh : dataset.description_en;

    const matchesSearch = !searchQuery ||
      title.toLowerCase().includes(query) ||
      description?.toLowerCase().includes(query) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(query));

    const matchesCategory = selectedCategory === 'all' || dataset.category === selectedCategory;
    const matchesFormat = selectedFormat === 'all' || dataset.format.toLowerCase().includes(selectedFormat.toLowerCase());
    const matchesYear = dataset.end_year >= yearRange[0] && dataset.start_year <= yearRange[1];

    return matchesSearch && matchesCategory && matchesFormat && matchesYear;
  });

  const formats = Array.from(new Set(datasets.flatMap(d => d.format.split(',').map(f => f.trim()))));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-3">
          <Database className="w-8 h-8" />
          <h1 className="text-3xl font-bold">{t('dataCatalog')}</h1>
        </div>
        <p className="text-blue-100 text-lg">{t('dataCatalogDescription')}</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{datasets.length}</div>
            <div className="text-sm text-blue-100">{t('totalDatasets')}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-blue-100">{t('categories')}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{formats.length}</div>
            <div className="text-sm text-blue-100">{t('formats')}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-blue-100">{t('openData')}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('searchDatasets')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>{t('filters')}</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('category')}</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('allCategories')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {language === 'km' ? cat.name_km : language === 'zh' ? cat.name_zh : cat.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('format')}</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('allFormats')}</option>
                {formats.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('yearRange')}: {yearRange[0]} - {yearRange[1]}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="2010"
                  max="2024"
                  value={yearRange[0]}
                  onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="2010"
                  max="2024"
                  value={yearRange[1]}
                  onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 text-sm text-gray-600">
          {t('showing')} {filteredDatasets.length} {t('of')} {datasets.length} {t('datasets')}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDatasets.map(dataset => {
            const title = language === 'km' ? dataset.title_km : language === 'zh' ? dataset.title_zh : dataset.title_en;
            const description = language === 'km' ? dataset.description_km : language === 'zh' ? dataset.description_zh : dataset.description_en;
            const category = categories.find(c => c.slug === dataset.category);
            const categoryName = category ? (language === 'km' ? category.name_km : language === 'zh' ? category.name_zh : category.name_en) : dataset.category;

            return (
              <div key={dataset.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {dataset.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                          {t('featured')}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        {categoryName}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Database className="w-4 h-4 mr-2" />
                    <span className="font-medium mr-2">{t('source')}:</span>
                    {dataset.data_source}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium mr-2">{t('coverage')}:</span>
                    {dataset.start_year} - {dataset.end_year}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="font-medium mr-2">{t('updateFrequency')}:</span>
                    {dataset.update_frequency}
                  </div>
                </div>

                {dataset.tags && dataset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.tags.map(tag => (
                      <span key={tag} className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {dataset.download_count}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      {dataset.format}
                    </span>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <span className="text-sm font-medium">{t('viewDataset')}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('noDatasets')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
