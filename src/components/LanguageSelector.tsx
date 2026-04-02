import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'es', flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'de', flag: '\u{1F1E9}\u{1F1EA}' },
]

export default function LanguageSelector() {
  const { i18n } = useTranslation()

  return (
    <div className="flex gap-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={(e) => { e.stopPropagation(); i18n.changeLanguage(lang.code) }}
          className={`text-2xl p-2 rounded-xl transition-all ${
            i18n.language === lang.code
              ? 'bg-white shadow-md scale-110 border-2 border-hotel-primary'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  )
}
