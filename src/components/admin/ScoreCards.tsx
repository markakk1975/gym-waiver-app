import { useTranslation } from 'react-i18next'
import type { FeedbackStats } from '../../lib/types'

interface Props {
  stats: FeedbackStats | null
}

export default function ScoreCards({ stats }: Props) {
  const { t } = useTranslation()

  if (!stats) return null

  const cards = [
    { label: t('admin.total_responses'), value: stats.total_responses, emoji: '📊', format: (v: number) => String(v) },
    { label: t('admin.avg_overall'), value: stats.avg_overall, emoji: '⭐', format: (v: number) => v?.toFixed(1) ?? '-' },
    { label: t('feedback.rating_apartamento'), value: stats.avg_apartamento, emoji: '🏨', format: (v: number) => v?.toFixed(1) ?? '-' },
    { label: t('feedback.rating_restaurantes'), value: stats.avg_restaurantes, emoji: '🍽️', format: (v: number) => v?.toFixed(1) ?? '-' },
    { label: t('feedback.rating_animacion'), value: stats.avg_animacion, emoji: '🎭', format: (v: number) => v?.toFixed(1) ?? '-' },
    { label: t('feedback.rating_recepcion'), value: stats.avg_recepcion, emoji: '👋', format: (v: number) => v?.toFixed(1) ?? '-' },
    { label: t('feedback.rating_instalaciones'), value: stats.avg_instalaciones, emoji: '🏊', format: (v: number) => v?.toFixed(1) ?? '-' },
    { label: t('feedback.rating_housekeeping'), value: stats.avg_housekeeping, emoji: '🧹', format: (v: number) => v?.toFixed(1) ?? '-' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{card.emoji}</div>
          <div className="text-2xl sm:text-3xl font-bold text-hotel-primary">{card.format(card.value)}</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  )
}
