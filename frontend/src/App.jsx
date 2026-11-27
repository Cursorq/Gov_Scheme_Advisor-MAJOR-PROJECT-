import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import AdvisorPage from './features/advisor/AdvisorPage.jsx'
import SchemeDetailPage from './features/schemes/SchemeDetailPage.jsx'

function App() {
  const { i18n, t } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language === 'hi' ? 'hi' : 'en'
  }, [i18n.language])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">{t('skipToMain')}</a>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<AdvisorPage />} />
        <Route path="/schemes/:schemeId" element={<SchemeDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}

export default App
