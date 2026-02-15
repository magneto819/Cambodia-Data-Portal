import { DataInsight } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Lightbulb, TrendingUp, Calendar, Database } from 'lucide-react';

interface InsightCardProps {
  insight: DataInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const { language, t } = useLanguage();

  const getTitle = () => {
    return language === 'km' ? insight.title_km : language === 'en' ? insight.title_en : insight.title_zh;
  };

  const getContent = () => {
    return language === 'km' ? insight.content_km : language === 'en' ? insight.content_en : insight.content_zh;
  };

  const getKeyFindings = () => {
    return language === 'km' ? insight.key_findings_km : language === 'en' ? insight.key_findings_en : insight.key_findings_zh;
  };

  const getIconColor = () => {
    if (insight.insight_type === 'trend') return 'text-blue-600 bg-blue-50';
    if (insight.insight_type === 'summary') return 'text-green-600 bg-green-50';
    if (insight.insight_type === 'comparison') return 'text-orange-600 bg-orange-50';
    return 'text-purple-600 bg-purple-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${getIconColor()}`}>
          {insight.insight_type === 'trend' ? (
            <TrendingUp className="w-6 h-6" />
          ) : (
            <Lightbulb className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {getTitle()}
          </h3>
          {insight.time_period_start && insight.time_period_end && (
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(insight.time_period_start).getFullYear()} - {new Date(insight.time_period_end).getFullYear()}
            </div>
          )}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {getContent()}
          </p>

          {getKeyFindings().length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                {t('keyFindings')}:
              </h4>
              <ul className="space-y-2">
                {getKeyFindings().map((finding, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <Database className="w-4 h-4 mr-2" />
              <span>{insight.data_sources.join(', ')}</span>
            </div>
            <div className="text-sm font-semibold text-blue-600">
              {(insight.confidence_score * 100).toFixed(0)}% {t('confidence')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
