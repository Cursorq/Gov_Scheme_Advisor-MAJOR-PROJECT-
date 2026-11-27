import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { submitFeedback } from '../../services/assistantApi.js'

function SchemeResults({ answer, schemes, sessionId, demoMode, onRestart }) {
  const { t, i18n } = useTranslation()
  const [feedbackState, setFeedbackState] = useState('')

  async function sendFeedback(rating) {
    if (demoMode || !sessionId) {
      setFeedbackState('preview')
      return
    }
    setFeedbackState('sending')
    try {
      await submitFeedback({ sessionId, rating, language: i18n.language })
      setFeedbackState('sent')
    } catch {
      setFeedbackState('failed')
    }
  }

  return (
    <section className="results-section" aria-labelledby="results-title">
      <div className="results-heading">
        <div><p className="step-kicker">{t('stepResults')}</p><h1 id="results-title">{t('resultsTitle')}</h1><p>{t('resultsIntro')}</p></div>
        <button className="secondary-button" type="button" onClick={onRestart}>{t('startOver')}</button>
      </div>
      {answer && <div className="answer-panel"><div className="answer-label">{t('advisorSummary')}</div><div className="markdown-body"><ReactMarkdown>{answer}</ReactMarkdown></div></div>}
      <div className="scheme-list">
        {schemes.map((scheme) => <article className="scheme-card" key={scheme.id}>
          <div className="scheme-card-top"><div><span className="scheme-category">{scheme.isDemo ? t('fictionalDemo') : (scheme.category ? t(`categories.${scheme.category}`, { defaultValue: scheme.category }) : t('scheme'))}</span><h2>{scheme.name || t(scheme.nameKey)}</h2></div><span className={`status-badge ${scheme.status}`}>{t(`statuses.${scheme.status}`)}</span></div>
          {(scheme.summary || scheme.summaryKey) && <p className="scheme-summary">{scheme.summary || t(scheme.summaryKey)}</p>}
          {scheme.criteria?.length > 0 && <div className="criteria-list">
            <h3>{t('eligibilityExplanation')}</h3>
            {scheme.criteria.map((criterion) => <div className="criterion-row" key={criterion.key || criterion.label}><span className={`criterion-status ${criterion.status}`}>{t(`statuses.${criterion.status}`)}</span><span>{criterion.label ? t(`criteria.${criterion.label}`) : criterion.description}</span></div>)}
          </div>}
          {scheme.benefits?.length > 0 && <div className="benefits-preview"><h3>{t('benefits')}</h3><ul>{scheme.benefits.slice(0, 3).map((benefit) => <li key={benefit}>{benefit.startsWith('demo') ? t(benefit) : t('benefitFallback', { benefit })}</li>)}</ul></div>}
          <div className="scheme-card-footer"><span>{scheme.isDemo ? t('demoSourceNote') : t('sourceProvided')}</span><Link className="detail-link" to={`/schemes/${encodeURIComponent(scheme.id)}`} state={{ scheme }}>{t('viewDetails')} <span aria-hidden="true">→</span></Link></div>
        </article>)}
      </div>
      {schemes.length === 0 && <div className="empty-state">{t('noSchemes')}</div>}
      <p className="advisory-note">{t('advisory')}</p>
      <section className="feedback-card" aria-labelledby="feedback-title">
        <h2 id="feedback-title">{t('feedbackQuestion')}</h2>
        {feedbackState ? <p role="status">{t(`feedback.${feedbackState}`)}</p> : <div className="feedback-actions"><button className="secondary-button" type="button" onClick={() => sendFeedback('helpful')}>{t('feedbackYes')}</button><button className="secondary-button" type="button" onClick={() => sendFeedback('not_helpful')}>{t('feedbackNo')}</button></div>}
      </section>
    </section>
  )
}

export default SchemeResults
