import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onReset: () => void
}

export default function ThankYouScreen({ onReset }: Props) {
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(onReset, 8000)
    return () => clearTimeout(timer)
  }, [onReset])

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-hotel-bg to-white px-8">
      <div className="text-7xl mb-6">💪</div>
      <h1 className="text-4xl font-bold text-hotel-primary mb-4">{t('thankyou.title')}</h1>
      <p className="text-xl text-gray-600 mb-2">{t('thankyou.subtitle')}</p>
      <p className="text-2xl font-semibold text-hotel-gold mt-4">{t('thankyou.enjoy')}</p>
      <p className="text-sm text-gray-400 mt-8">{t('thankyou.redirect')}</p>
    </div>
  )
}
