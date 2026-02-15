import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import {
  TrendingUp, Building2, GraduationCap, Users, Construction,
  Leaf, Smartphone, Heart, ChevronRight, BarChart3, Database
} from 'lucide-react';

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
  display_order: number;
}

interface Dataset {
  id: string;
  title_en: string;
  title_km: string;
  title_zh: string;
  description_en: string;
  description_km: string;
  description_zh: string;
  category: string;
  format: string;
  start_year: number;
  end_year: number;
  download_count: number;
}

const iconMap: Record<string, any> = {
  'TrendingUp': TrendingUp,
  'Building2': Building2,
  'GraduationCap': GraduationCap,
  'Users': Users,
  'Construction': Construction,
  'Leaf': Leaf,
  'Smartphone': Smartphone,
  'Heart': Heart
};

const colorMap: Record<string, string> = {
  'blue': 'from-blue-500 to-blue-700',
  'green': 'from-green-500 to-green-700',
  'purple': 'from-purple-500 to-purple-700',
  'orange': 'from-orange-500 to-orange-700',
  'red': 'from-red-500 to-red-700',
  'teal': 'from-teal-500 to-teal-700',
  'indigo': 'from-indigo-500 to-indigo-700',
  'pink': 'from-pink-500 to-pink-700'
};

export function ThematicDatasetsView() {
  const { language, t } = useLanguage();
  const [categories, setCategories] = useState<ThematicCategory[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesResult, datasetsResult] = await Promise.all([
        supabase.from('thematic_categories').select('*').order('display_order'),
        supabase.from('data_catalog').select('*')
      ]);

      if (categoriesResult.data) setCategories(categoriesResult.data);
      if (datasetsResult.data) setDatasets(datasetsResult.data);
    } catch (error) {
      console.error('Error loading thematic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDatasets = (categorySlug: string) => {
    return datasets.filter(d => d.category === categorySlug);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedCategoryData = selectedCategory
    ? categories.find(c => c.slug === selectedCategory)
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-3">
          <BarChart3 className="w-8 h-8" />
          <h1 className="text-3xl font-bold">{t('thematicDatasets')}</h1>
        </div>
        <p className="text-indigo-100 text-lg">{t('thematicDatasetsDescription')}</p>
      </div>

      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => {
            const Icon = iconMap[category.icon] || Database;
            const gradient = colorMap[category.color] || colorMap['blue'];
            const categoryDatasets = getCategoryDatasets(category.slug);
            const name = language === 'km' ? category.name_km : language === 'zh' ? category.name_zh : category.name_en;
            const description = language === 'km' ? category.description_km : language === 'zh' ? category.description_zh : category.description_en;

            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
              >
                <div className={`bg-gradient-to-br ${gradient} p-6 text-white`}>
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{name}</h3>
                  <p className="text-sm opacity-90">{description}</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{categoryDatasets.length}</span> {t('datasets')}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span>{t('backToCategories')}</span>
            </button>
          </div>

          {selectedCategoryData && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start space-x-4 mb-6">
                {(() => {
                  const Icon = iconMap[selectedCategoryData.icon] || Database;
                  const gradient = colorMap[selectedCategoryData.color] || colorMap['blue'];
                  return (
                    <div className={`bg-gradient-to-br ${gradient} p-4 rounded-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {language === 'km' ? selectedCategoryData.name_km : language === 'zh' ? selectedCategoryData.name_zh : selectedCategoryData.name_en}
                  </h2>
                  <p className="text-gray-600">
                    {language === 'km' ? selectedCategoryData.description_km : language === 'zh' ? selectedCategoryData.description_zh : selectedCategoryData.description_en}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('availableDatasets')} ({getCategoryDatasets(selectedCategory).length})
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {getCategoryDatasets(selectedCategory).map(dataset => {
                    const title = language === 'km' ? dataset.title_km : language === 'zh' ? dataset.title_zh : dataset.title_en;
                    const description = language === 'km' ? dataset.description_km : language === 'zh' ? dataset.description_zh : dataset.description_en;

                    return (
                      <div key={dataset.id} className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{dataset.format}</span>
                              <span>•</span>
                              <span>{dataset.start_year} - {dataset.end_year}</span>
                              <span>•</span>
                              <span>{dataset.download_count} {t('downloads')}</span>
                            </div>
                          </div>
                          <button className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
                            {t('viewDetails')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {getCategoryDatasets(selectedCategory).length === 0 && (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{t('noDatasets')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
