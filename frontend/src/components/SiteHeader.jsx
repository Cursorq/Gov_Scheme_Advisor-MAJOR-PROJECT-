import { useTranslation } from 'react-i18next'

function SiteHeader() {
  const { t, i18n } = useTranslation()

  return (
    <header className="site-header">
      <a className="brand" href="#main-content" aria-label={t('brand')}>
        <span className="brand-mark" aria-hidden="true">स</span>
        <span className="brand-copy"><strong>{t('brand')}</strong><small>{t('tagline')}</small></span>
      </a>
      <div className="header-actions">
        <span className="prototype-label"><span className="prototype-dot" />{t('prototype')}</span>
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
