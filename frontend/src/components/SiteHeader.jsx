import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function SiteHeader() {
  const { t, i18n } = useTranslation()

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label={t('brand')}>
        <span className="brand-mark" aria-hidden="true">स</span>
        <span className="brand-copy"><strong>{t('brand')}</strong><small>{t('tagline')}</small></span>
      </Link>
      <div className="header-actions">
        <span className="privacy-label"><span aria-hidden="true">●</span>{t('noAccount')}</span>
        <label className="sr-only" htmlFor="language">{t('language')}</label>
        <select id="language" value={i18n.language} onChange={(event) => i18n.changeLanguage(event.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>
    </header>
  )
}

export default SiteHeader
