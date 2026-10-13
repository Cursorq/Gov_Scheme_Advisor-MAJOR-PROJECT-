import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const examples = [
  'I am a student from Uttarakhand',
  'I am a woman starting a small business',
  'My family income is below ₹2 lakh',
]

function App() {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.documentElement.lang = i18n.language === 'hi' ? 'hi' : 'en'
  }, [i18n.language])

  function findSchemes(event) {
    event.preventDefault()
    if (query.trim()) setSubmitted(true)
  }

  function chooseExample(example) {
    setQuery(example)
    setSubmitted(false)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label={t('brand')}>
          <span className="brand-mark" aria-hidden="true">S</span>
          <span><strong>{t('brand')}</strong><small>{t('tagline')}</small></span>
        </a>
        <div className="top-actions">
          <span className="privacy-note"><span className="status-dot" />{t('private')}</span>
          <label className="language-label" htmlFor="language">{t('language')}</label>
          <select id="language" value={i18n.language} onChange={(event) => i18n.changeLanguage(event.target.value)}>
            <option value="en">English</option><option value="hi">हिन्दी</option>
          </select>
        </div>
      </header>

      <main id="home">
        <section className="intro">
          <div className="eyebrow"><span className="tricolor" />{t('eyebrow')}</div>
          <h1>{t('headline')}<br /><span>{t('headlineAccent')}</span></h1>
          <p>{t('intro')}</p>
        </section>

        <section className="workspace" aria-label={t('finderLabel')}>
          <div className="finder-card">
            <div className="card-heading">
              <div className="step-icon" aria-hidden="true">01</div>
              <div><h2>{t('tellUs')}</h2><p>{t('tellHelp')}</p></div>
            </div>

            <form onSubmit={findSchemes}>
              <label className="sr-only" htmlFor="situation">{t('situationLabel')}</label>
              <textarea id="situation" value={query} onChange={(event) => { setQuery(event.target.value); setSubmitted(false) }} placeholder={t('placeholder')} rows="4" />
              <div className="form-bottom">
                <span className="input-hint">{t('inputHint')}</span>
                <button className="primary-button" type="submit">{t('findButton')} <span aria-hidden="true">→</span></button>
              </div>
            </form>

            <div className="examples">
              <span>{t('tryExample')}</span>
              <div className="example-list">
                {examples.map((example, index) => <button type="button" key={example} onClick={() => chooseExample(t(`examples.${index}`))}>{t(`examples.${index}`)}</button>)}
              </div>
            </div>

            {submitted && <div className="profile-preview" role="status">
              <div className="preview-title"><span className="check-icon">✓</span><div><strong>{t('profileTitle')}</strong><small>{t('profileHelp')}</small></div></div>
              <div className="attribute-list"><span>{t('student')}</span><span>{t('uttarakhand')}</span><span>{t('needsMore')}</span></div>
              <button className="text-button" type="button" onClick={() => setSubmitted(false)}>{t('editDetails')}</button>
            </div>}
          </div>

          <aside className="side-panel">
            <div className="side-top"><div className="illustration" aria-hidden="true"><span className="sun" /><span className="hill hill-one" /><span className="hill hill-two" /><span className="path" /><span className="person">●</span></div>
              <div className="aside-copy"><span className="mini-label">{t('howWorks')}</span><h2>{t('guideHeadline')}</h2><p>{t('guideText')}</p></div>
            </div>
            <div className="steps">
              <div className="step-row"><span>1</span><p>{t('stepOne')}</p></div>
              <div className="step-row"><span>2</span><p>{t('stepTwo')}</p></div>
              <div className="step-row"><span>3</span><p>{t('stepThree')}</p></div>
            </div>
            <div className="source-note"><span aria-hidden="true">↗</span><p>{t('sourceNote')}</p></div>
          </aside>
        </section>

        <section className="trust-strip" aria-label={t('featuresLabel')}>
          <div><span className="feature-icon">⌕</span><p><strong>{t('featureOne')}</strong><small>{t('featureOneText')}</small></p></div>
          <div><span className="feature-icon">✓</span><p><strong>{t('featureTwo')}</strong><small>{t('featureTwoText')}</small></p></div>
          <div><span className="feature-icon">◎</span><p><strong>{t('featureThree')}</strong><small>{t('featureThreeText')}</small></p></div>
        </section>
      </main>
      <footer><span>{t('footer')}</span><span>{t('footerNote')}</span></footer>
    </div>
  )
}

export default App
