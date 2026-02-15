import { useState, useEffect } from 'react';
import { ExternalLink, Database, RefreshCw, Globe, CheckCircle, Info } from 'lucide-react';
import { DataSource } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export function DataSourcesView() {
  const { language, t } = useLanguage();
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('display_order');

      if (error) throw error;
      if (data) setSources(data);
    } catch (error) {
      console.error('Error loading data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getName = (source: DataSource) => {
    return language === 'km' ? source.name_km : language === 'en' ? source.name_en : source.name_zh;
  };

  const getContentType = (source: DataSource) => {
    return language === 'km' ? source.content_type_km : language === 'en' ? source.content_type_en : source.content_type_zh;
  };

  const getUpdateFrequency = (source: DataSource) => {
    return language === 'km' ? source.update_frequency_km : language === 'en' ? source.update_frequency_en : source.update_frequency_zh;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-3">
          <Database className="w-8 h-8" />
          <h1 className="text-3xl font-bold">{t('dataSources')}</h1>
        </div>
        <p className="text-green-100 text-lg mb-6">
          {t('dataSourcesDescription')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{sources.length}</div>
            <div className="text-sm text-green-100">{t('officialSources')}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-green-100">{t('verified')}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{t('regular')}</div>
            <div className="text-sm text-green-100">{t('updates')}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('officialDataSources')}</h2>
          <p className="text-gray-600">{t('officialDataSourcesDescription')}</p>
        </div>

        <div className="space-y-4">
          {sources.map((source, index) => (
            <div
              key={source.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{getName(source)}</h3>
                        {source.acronym && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded">
                            {source.acronym}
                          </span>
                        )}
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Globe className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium mr-2">{t('website')}:</span>
                          <a
                            href={`https://${source.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
                          >
                            <span>{source.website}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="flex items-start text-sm text-gray-600">
                          <Info className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium mr-2">{t('contentType')}:</span>
                            <span>{getContentType(source)}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <RefreshCw className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium mr-2">{t('updateFrequency')}:</span>
                          <span>{getUpdateFrequency(source)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          {t('official')}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {t('verified')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://${source.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
                >
                  <span className="text-sm font-medium">{t('visit')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('aboutDataSources')}</h3>
            <p className="text-gray-700 mb-4">
              {t('dataSourcesNote')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">{t('officialGovernment')}</div>
                  <div className="text-sm text-gray-600">{t('officialGovernmentDesc')}</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">{t('regularlyUpdated')}</div>
                  <div className="text-sm text-gray-600">{t('regularlyUpdatedDesc')}</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">{t('standardizedFormat')}</div>
                  <div className="text-sm text-gray-600">{t('standardizedFormatDesc')}</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">{t('openAccess')}</div>
                  <div className="text-sm text-gray-600">{t('openAccessDesc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
