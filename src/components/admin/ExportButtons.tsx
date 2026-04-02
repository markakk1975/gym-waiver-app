import { useTranslation } from 'react-i18next'
import type { DailySummary } from '../../lib/types'

interface Props {
  data: DailySummary[]
}

export default function ExportButtons({ data }: Props) {
  const { t } = useTranslation()

  function exportCSV() {
    if (data.length === 0) return
    const headers = ['Fecha', 'Respuestas', 'Apartamento', 'Restaurantes', 'Animacion', 'Recepcion', 'Instalaciones', 'Housekeeping', 'Media General']
    const rows = data.map((d) =>
      [d.day, d.total_responses, d.avg_apartamento, d.avg_restaurantes, d.avg_animacion, d.avg_recepcion, d.avg_instalaciones, d.avg_housekeeping, d.avg_overall].join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feedback-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportPDF() {
    window.print()
  }

  return (
    <div className="flex gap-2 sm:gap-3">
      <button
        onClick={exportCSV}
        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
      >
        📥 {t('admin.export_csv')}
      </button>
      <button
        onClick={exportPDF}
        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition-colors"
      >
        📄 {t('admin.export_pdf')}
      </button>
    </div>
  )
}
