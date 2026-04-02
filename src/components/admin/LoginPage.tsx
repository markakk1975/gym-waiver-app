import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'

interface Props {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: Props) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(t('admin.login_error'))
    } else {
      onLogin()
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-hotel-primary mb-6 text-center">
          🏋️ {t('admin.login_title')}
        </h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input
          type="email"
          placeholder={t('admin.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
        />
        <input
          type="password"
          placeholder={t('admin.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
        />
        <button
          type="submit"
          className="w-full bg-hotel-primary text-white py-3 rounded-xl font-semibold hover:bg-hotel-primary-light transition-colors"
        >
          {t('admin.login')}
        </button>
      </form>
    </div>
  )
}
