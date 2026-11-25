import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function SchemeFinder() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const examples = [t('examples.0'), t('examples.1'), t('examples.2')]

  function handleSubmit(event) {
    event.preventDefault()
    if (query.trim()) setSubmitted(true)
  }

  function selectExample(example) {
    setQuery(example)
    setSubmitted(false)
  }

  return (
    <section className="finder-card" aria-labelledby="finder-title">
      <div className="section-heading">
        <span className="section-icon" aria-hidden="true">01</span>
        <div><h2 id="finder-title">{t('tellUs')}</h2><p>{t('tellHelp')}</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="situation">{t('situationLabel')}</label>
        <textarea id="situation" value={query} onChange={(event) => { setQuery(event.target.value); setSubmitted(false) }} placeholder={t('placeholder')} rows="4" />
        <div className="form-actions">
          <span className="input-hint">{t('inputHint')}</span>
          <button className="primary-button" type="submit">{t('findButton')} <span aria-hidden="true">→</span></button>
        </div>
      </form>
      <div className="examples">
        <p>{t('tryExample')}</p>
        <div className="example-list">
          {examples.map((example) => <button type="button" key={example} onClick={() => selectExample(example)}>{example}</button>)}
        </div>
      </div>
      {submitted && <div className="demo-message" role="status" aria-live="polite">
        <span className="demo-check" aria-hidden="true">✓</span>
        <p><strong>{t('demoTitle')}</strong><span>{t('demoText')}</span></p>
      </div>}
    </section>
  )
}

export default SchemeFinder
