import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function SignupPage() {
  const { t } = useTranslation()
  const [notice, setNotice] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setNotice(true)
  }

  return (
    <main className="login-page" id="main-content">
      <section className="login-card" aria-labelledby="signup-title">
        <div className="login-heading">
          <span className="section-icon" aria-hidden="true">＋</span>
          <div><h1 id="signup-title">{t('signupTitle')}</h1><p>{t('signupIntro')}</p></div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="full-name">{t('nameLabel')}</label>
          <input id="full-name" name="name" type="text" autoComplete="name" placeholder={t('namePlaceholder')} required />
          <label htmlFor="email">{t('emailLabel')}</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder={t('emailPlaceholder')} required />
          <label htmlFor="password">{t('passwordLabel')}</label>
          <input id="password" name="password" type="password" autoComplete="new-password" placeholder={t('passwordPlaceholder')} minLength="8" required />
          <p className="password-hint">{t('passwordHint')}</p>
          <button className="primary-button login-submit" type="submit">{t('signupButton')} <span aria-hidden="true">→</span></button>
        </form>
        {notice && <div className="login-notice" role="status" aria-live="polite">{t('signupDemoNotice')}</div>}
        <p className="auth-switch">{t('haveAccount')} <Link to="/login">{t('loginLink')}</Link></p>
        <p className="login-help">{t('signupHelp')}</p>
      </section>
    </main>
  )
}

export default SignupPage
