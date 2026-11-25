import { useTranslation } from 'react-i18next'

function HowItWorks() {
  const { t } = useTranslation()
  const steps = [t('stepOne'), t('stepTwo'), t('stepThree')]

  return (
    <aside className="guide-card" aria-labelledby="guide-title">
      <div className="section-heading">
        <span className="section-icon" aria-hidden="true">?</span>
        <div><h2 id="guide-title">{t('howWorks')}</h2><p>{t('guideText')}</p></div>
      </div>
      <ol className="steps-list">
        {steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}
      </ol>
      <div className="source-note"><span aria-hidden="true">↗</span>{t('sourceNote')}</div>
    </aside>
  )
}

export default HowItWorks
