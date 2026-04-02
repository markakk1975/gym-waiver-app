import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import LoginPage from '../components/admin/LoginPage'
import Dashboard from '../components/admin/Dashboard'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session)
      setChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setAuthenticated(false)
  }

  if (checking) {
    return <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>
  }

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />
  }

  return <Dashboard onLogout={handleLogout} />
}
