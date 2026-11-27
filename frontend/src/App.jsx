import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import PageIntro from './components/PageIntro.jsx'
import SchemeFinder from './features/scheme-finder/SchemeFinder.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import LoginPage from './features/auth/LoginPage.jsx'

function SchemeHome() {
  const { t } = useTranslation()

  return (
    <main className="page-content" id="main-content">
      <PageIntro />
      <div className="content-grid">
        <SchemeFinder />
        <HowItWorks />
      </div>
      <section className="service-note" aria-label={t('serviceTitle')}>
        <span className="service-note-icon" aria-hidden="true">i</span>
        <p><strong>{t('serviceTitle')}</strong><span>{t('serviceText')}</span></p>
      </section>
    </main>
  )
}

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language === 'hi' ? 'hi' : 'en'
  }, [i18n.language])

  return (
    <div className="app-shell">
      <SiteHeader />
      <Routes>
        <Route path="/" element={<SchemeHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}

export default App
