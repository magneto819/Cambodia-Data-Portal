import { OfficialReport } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { FileText, Download, Calendar, Building2, Tag } from 'lucide-react';

interface ReportCardProps {
  report: OfficialReport;
}

export function ReportCard({ report }: ReportCardProps) {
  const { language, t } = useLanguage();

  const getTitle = () => {
    return language === 'km' ? report.title_km : language === 'en' ? report.title_en : report.title_zh;
  };

  const getDescription = () => {
    return language === 'km' ? report.description_km : language === 'en' ? report.description_en : report.description_zh;
  };

  const getPublisher = () => {
    return language === 'km' ? report.publisher_km : language === 'en' ? report.publisher_en : report.publisher_zh;
  };

  const getReportTypeColor = () => {
    switch (report.report_type) {
      case 'census': return 'bg-blue-100 text-blue-800';
      case 'survey': return 'bg-green-100 text-green-800';
      case 'economic': return 'bg-orange-100 text-orange-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'industry': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 flex-1">
              {getTitle()}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReportTypeColor()}`}>
              {report.report_type.toUpperCase()}
            </span>
          </div>

          <p className="text-gray-600 mb-4">
            {getDescription()}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-700">
              <Building2 className="w-4 h-4 mr-2 text-gray-400" />
              <span>{getPublisher()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {new Date(report.publication_date).toLocaleDateString()}
                {report.year_covered && ` • ${t('yearCovered')}: ${report.year_covered}`}
              </span>
            </div>
          </div>

          {report.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <Tag className="w-4 h-4 text-gray-400" />
              {report.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {report.file_size && <span>{report.file_size} • </span>}
              <span className="uppercase">{report.language}</span>
              <span className="ml-2">• {report.download_count} {t('downloads')}</span>
            </div>
            <a
              href={report.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-semibold">{t('download')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
