import { useTranslation } from 'react-i18next'

function SiteFooter() {
  const { t } = useTranslation()

  return (
    <footer className="site-footer">
      <span>{t('footer')}</span>
      <span>{t('footerNote')}</span>
    </footer>
  )
}

export default SiteFooter
