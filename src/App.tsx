import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import WelcomeScreen from './components/WelcomeScreen'
import WaiverForm from './components/WaiverForm'
import ThankYouScreen from './components/ThankYouScreen'
import AdminPage from './pages/AdminPage'

type Screen = 'welcome' | 'waiver' | 'thankyou'

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const { i18n } = useTranslation()

  // Simple path-based routing
  const isAdmin = window.location.pathname.startsWith('/admin')

  const resetToWelcome = useCallback(() => {
    setScreen('welcome')
    i18n.changeLanguage('es')
  }, [i18n])

  if (isAdmin) return <AdminPage />

  return (
    <div className="h-full w-full overflow-hidden">
      {screen === 'welcome' && (
        <WelcomeScreen onStart={() => setScreen('waiver')} />
      )}
      {screen === 'waiver' && (
        <WaiverForm
          onSuccess={() => setScreen('thankyou')}
          onBack={resetToWelcome}
        />
      )}
      {screen === 'thankyou' && (
        <ThankYouScreen onReset={resetToWelcome} />
      )}
    </div>
  )
}
