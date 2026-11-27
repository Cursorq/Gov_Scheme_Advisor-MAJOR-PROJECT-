import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getScheme } from '../../services/assistantApi.js'
import { demoProfile, evaluateDemoScheme } from '../../data/demoData.js'

function SchemeDetailPage() {
  const { t } = useTranslation()
  const { schemeId } = useParams()
  const location = useLocation()
  const [remoteResult, setRemoteResult] = useState(null)

  useEffect(() => {
    let active = true
    if (location.state?.scheme || schemeId === 'efgp') return undefined

    getScheme(schemeId)
      .then((data) => { if (active) setRemoteResult({ id: schemeId, data }) })
      .catch(() => { if (active) setRemoteResult({ id: schemeId, error: true }) })
    return () => { active = false }
  }, [location.key, location.state, schemeId])

  const scheme = location.state?.scheme || (schemeId === 'efgp' ? evaluateDemoScheme(demoProfile) : remoteResult?.id === schemeId ? remoteResult.data : null)
  const error = remoteResult?.id === schemeId && remoteResult.error
  const name = scheme?.name || (scheme?.nameKey ? t(scheme.nameKey) : '')
  const items = (list) => list?.map((item) => item.startsWith('demo') ? t(item) : t('listItemFallback', { item }))

  return (
    <main className="page-content detail-page" id="main-content">
      <Link className="back-link" to="/">← {t('backToAdvisor')}</Link>
      {error && <div className="error-banner" role="alert">{t('detailUnavailable')}</div>}
      {!scheme && !error && <p className="loading-line">{t('working')}</p>}
      {scheme && <>
        <div className="detail-header">
          <span className="scheme-category">{scheme.isDemo ? t('fictionalDemo') : (scheme.category ? t(`categories.${scheme.category}`, { defaultValue: scheme.category }) : t('scheme'))}</span>
          <h1>{name}</h1>
          <p>{scheme.summary || (scheme.summaryKey ? t(scheme.summaryKey) : '')}</p>
          <span className={`status-badge ${scheme.status}`}>{t(`statuses.${scheme.status}`)}</span>
        </div>
        {scheme.isDemo && <div className="fictional-warning"><strong>{t('fictionalTitle')}</strong><span>{t('fictionalText')}</span></div>}
        {scheme.criteria?.length > 0 && <section className="detail-block"><h2>{t('eligibilityExplanation')}</h2><div className="detail-criteria">{scheme.criteria.map((criterion) => <div className="criterion-row" key={criterion.key || criterion.label}><span className={`criterion-status ${criterion.status}`}>{t(`statuses.${criterion.status}`)}</span><span>{criterion.label ? t(`criteria.${criterion.label}`) : criterion.description}</span></div>)}</div></section>}
        {scheme.benefits?.length > 0 && <section className="detail-block"><h2>{t('benefits')}</h2><ul className="detail-list">{items(scheme.benefits).map((item) => <li key={item}>{item}</li>)}</ul></section>}
        {scheme.documents?.length > 0 && <section className="detail-block"><h2>{t('documentsRequired')}</h2><ul className="detail-list">{items(scheme.documents).map((item) => <li key={item}>{item}</li>)}</ul></section>}
        <section className="detail-block source-block"><h2>{t('officialSource')}</h2>{scheme.isDemo ? <p>{t('demoSourceNote')}</p> : scheme.official_url ? <a href={scheme.official_url} target="_blank" rel="noreferrer">{scheme.official_source || scheme.official_url} ↗</a> : <p>{t('noSourceAvailable')}</p>}</section>
        <p className="advisory-note">{t('advisory')}</p>
      </>}
    </main>
  )
}

export default SchemeDetailPage
