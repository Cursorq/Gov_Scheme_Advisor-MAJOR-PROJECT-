import { useTranslation } from 'react-i18next'

function PageIntro() {
  const { t } = useTranslation()

  return (
    <section className="page-intro">
      <div className="eyebrow"><span className="tricolor" aria-hidden="true" />{t('eyebrow')}</div>
      <h1>{t('headline')}</h1>
      <p>{t('intro')}</p>
    </section>
  )
}

export default PageIntro
