import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageSelector'

interface Props {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: Props) {
  const { t } = useTranslation()

  return (
    <div
      className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-hotel-bg to-white px-8 cursor-pointer"
      onClick={onStart}
    >
      <div className="mb-6 sm:mb-8">
        <LanguageSelector />
      </div>

      <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🏋️</div>

      <h1 className="text-3xl sm:text-4xl font-bold text-hotel-primary mb-2 text-center">
        {t('welcome.title')}
      </h1>
      <p className="text-lg sm:text-xl text-gray-500 mb-2 text-center">
        {t('welcome.subtitle')}
      </p>

      <div className="mt-6 sm:mt-8 bg-hotel-primary text-white text-xl sm:text-2xl font-semibold px-8 sm:px-12 py-4 sm:py-5 rounded-2xl shadow-lg animate-pulse">
        {t('welcome.tap')} 👆
      </div>
    </div>
  )
}
