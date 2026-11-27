import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function LoginPage() {
  const { t } = useTranslation()
  const [notice, setNotice] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setNotice(true)
  }

  return (
    <main className="login-page" id="main-content">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-heading">
          <span className="section-icon" aria-hidden="true">↪</span>
          <div><h1 id="login-title">{t('loginTitle')}</h1><p>{t('loginIntro')}</p></div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">{t('emailLabel')}</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder={t('emailPlaceholder')} required />
          <label htmlFor="password">{t('passwordLabel')}</label>
          <input id="password" name="password" type="password" autoComplete="current-password" placeholder={t('passwordPlaceholder')} required />
          <button className="primary-button login-submit" type="submit">{t('loginButton')} <span aria-hidden="true">→</span></button>
        </form>
        {notice && <div className="login-notice" role="status" aria-live="polite">{t('loginDemoNotice')}</div>}
        <p className="auth-switch">{t('noAccount')} <Link to="/signup">{t('signupLink')}</Link></p>
        <p className="login-help">{t('loginHelp')}</p>
      </section>
    </main>
  )
}

export default LoginPage
