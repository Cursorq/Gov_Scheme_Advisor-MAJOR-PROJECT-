import { useTranslation } from 'react-i18next'

const fields = [
  { key: 'age', label: 'profile.age', type: 'number' },
  { key: 'gender', label: 'profile.gender', options: ['female', 'male', 'other', 'unknown'] },
  { key: 'state', label: 'profile.state' },
  { key: 'category', label: 'profile.category', options: ['general', 'obc', 'sc', 'st', 'ews', 'unknown'] },
  { key: 'occupation', label: 'profile.occupation' },
  { key: 'income', label: 'profile.income', type: 'number' },
  { key: 'education', label: 'profile.education', options: ['undergraduate', 'vocational', 'postgraduate', 'school', 'other', 'unknown'] },
  { key: 'purpose', label: 'profile.purpose', options: ['education', 'health', 'business', 'housing', 'agriculture', 'other', 'unknown'] },
  { key: 'citizenship', label: 'profile.citizenship', options: ['citizen', 'nonCitizen', 'unknown'] },
  { key: 'academicStanding', label: 'profile.academicStanding', options: ['passed', 'notPassed', 'unknown'] },
  { key: 'academicScore', label: 'profile.academicScore', type: 'number' },
  { key: 'otherGrant', label: 'profile.otherGrant', options: ['yes', 'no', 'unknown'] },
]

function ProfileReview({ profile, onChange, onConfirm, onBack, busy, error }) {
  const { t } = useTranslation()

  return (
    <section className="flow-card" aria-labelledby="profile-title">
      <div className="flow-heading">
        <span className="step-number">02</span>
        <div><p className="step-kicker">{t('stepProfile')}</p><h1 id="profile-title">{t('profileTitle')}</h1><p>{t('profileIntro')}</p></div>
      </div>
      <div className="profile-grid">
        {fields.map((field) => <label className="profile-field" key={field.key}>
          <span>{t(field.label)}</span>
          {field.options ? <select value={profile[field.key] || 'unknown'} onChange={(event) => onChange(field.key, event.target.value)}>
            {field.options.map((option) => <option key={option} value={option}>{t(`options.${option}`)}</option>)}
          </select> : <input type={field.type || 'text'} min={field.type === 'number' ? '0' : undefined} value={profile[field.key] || ''} onChange={(event) => onChange(field.key, event.target.value)} />}
        </label>)}
      </div>
      <div className="privacy-note"><span aria-hidden="true">i</span>{t('profilePrivacy')}</div>
      {error && <div className="error-banner" role="alert">{error}</div>}
      <div className="flow-actions">
        <button className="secondary-button" type="button" onClick={onBack}>{t('backToChat')}</button>
        <button className="primary-button" type="button" onClick={onConfirm} disabled={busy}>{busy ? t('working') : t('confirmProfile')} <span aria-hidden="true">→</span></button>
      </div>
    </section>
  )
}

export default ProfileReview
