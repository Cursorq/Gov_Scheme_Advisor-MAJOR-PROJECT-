import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChatPanel from './ChatPanel.jsx'
import ProfileReview from './ProfileReview.jsx'
import SchemeResults from '../schemes/SchemeResults.jsx'
import { demoProfile, evaluateDemoScheme } from '../../data/demoData.js'
import { confirmProfile, sendMessage } from '../../services/assistantApi.js'

function AdvisorPage() {
  const { t, i18n } = useTranslation()
  const [step, setStep] = useState('conversation')
  const [messages, setMessages] = useState(() => [{ role: 'assistant', text: t('welcomeMessage') }])
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [profile, setProfile] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [schemes, setSchemes] = useState([])
  const [answer, setAnswer] = useState('')
  const [quickReplies, setQuickReplies] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [demoMode, setDemoMode] = useState(false)

  function appendMessage(role, text) {
    if (text) setMessages((current) => [...current, { role, text }])
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0]
    event.target.value = ''
    if (!selected) return

    const validType = /\.(pdf|txt)$/i.test(selected.name)
    if (!validType) {
      setError(t('invalidFile'))
      return
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError(t('largeFile'))
      return
    }

    setError('')
    setFile(selected)
  }

  async function handleSend() {
    const trimmedMessage = message.trim()
    if ((!trimmedMessage && !file) || busy) return

    appendMessage('user', [trimmedMessage, file ? `(${t('attachedFile')}: ${file.name})` : ''].filter(Boolean).join('\n'))
    setDemoMode(false)
    setMessage('')
    setError('')
    setQuickReplies([])
    setBusy(true)

    try {
      const response = await sendMessage({ message: trimmedMessage, sessionId, language: i18n.language, file })
      setFile(null)
      if (response.session_id) setSessionId(response.session_id)
      if (response.message || response.question) appendMessage('assistant', response.message || response.question)

      if (response.stage === 'follow_up') {
        setQuickReplies((response.quick_replies || []).map((text) => ({ value: text, label: text })))
      } else if (response.stage === 'profile_confirmation') {
        setProfile(response.profile || response.attributes || {})
        setStep('profile')
      } else if (response.stage === 'recommendations') {
        setSchemes(response.schemes || [])
        setAnswer(response.answer || '')
        setStep('results')
      }
    } catch {
      setError(t('apiUnavailable'))
    } finally {
      setBusy(false)
    }
  }

  function startPreview() {
    setDemoMode(true)
    setStep('conversation')
    setProfile(null)
    setSchemes([])
    setAnswer('')
    setFile(null)
    setSessionId(null)
    setMessage('')
    setQuickReplies([
      { value: 'passed', label: 'demoReplyPassed' },
      { value: 'unknown', label: 'demoReplyUnknown' },
    ])
    setMessages([
      { role: 'assistant', text: t('welcomeMessage') },
      { role: 'user', text: t('demoQuery') },
      { role: 'assistant', text: t('demoFollowUp') },
    ])
    setError('')
  }

  function handleQuickReply(value) {
    if (demoMode) {
      const scoreKnown = value === 'passed'
      const nextProfile = { ...demoProfile, academicStanding: scoreKnown ? 'passed' : 'unknown', academicScore: scoreKnown ? '62' : '' }
      setProfile(nextProfile)
      appendMessage('user', t(value === 'passed' ? 'demoReplyPassed' : 'demoReplyUnknown'))
      appendMessage('assistant', t('profileReadyMessage'))
      setQuickReplies([])
      setStep('profile')
      return
    }

    setMessage(value)
    setQuickReplies([])
    window.setTimeout(() => document.getElementById('message-input')?.form?.requestSubmit(), 0)
  }

  function updateProfile(key, value) {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  async function handleConfirmProfile() {
    if (busy || !profile) return
    setError('')
    setBusy(true)
    try {
      if (demoMode) {
        setSchemes([evaluateDemoScheme(profile)])
        setAnswer(t('demoAnswer'))
        setStep('results')
        return
      }

      const response = await confirmProfile({ sessionId, profile, language: i18n.language })
      setSchemes(response.schemes || [])
      setAnswer(response.answer || '')
      if (response.message) appendMessage('assistant', response.message)
      setStep('results')
    } catch {
      setError(t('apiUnavailable'))
    } finally {
      setBusy(false)
    }
  }

  function resetConversation() {
    setStep('conversation')
    setMessages([{ role: 'assistant', text: t('welcomeMessage') }])
    setMessage('')
    setFile(null)
    setProfile(null)
    setSessionId(null)
    setSchemes([])
    setAnswer('')
    setQuickReplies([])
    setError('')
    setDemoMode(false)
  }

  return (
    <main className="page-content advisor-page" id="main-content">
      <div className="page-intro">
        <div className="eyebrow"><span className="tricolor" aria-hidden="true" />{t('eyebrow')}</div>
        <h1>{t('headline')}</h1>
        <p>{t('intro')}</p>
      </div>
      {step === 'conversation' && <ChatPanel
        messages={messages} onSend={handleSend} busy={busy} file={file} onFileChange={handleFileChange}
        onRemoveFile={() => setFile(null)} onPreview={startPreview} error={error} onReset={resetConversation}
        message={message} onMessageChange={setMessage} quickReplies={quickReplies} onQuickReply={handleQuickReply}
      />}
      {step === 'profile' && <ProfileReview profile={profile} onChange={updateProfile} onConfirm={handleConfirmProfile} onBack={() => setStep('conversation')} busy={busy} error={error} />}
      {step === 'results' && <SchemeResults answer={answer} schemes={schemes} sessionId={sessionId} demoMode={demoMode} onRestart={resetConversation} />}
      <section className="service-note" aria-label={t('serviceTitle')}>
        <span className="service-note-icon" aria-hidden="true">i</span>
        <p><strong>{t('serviceTitle')}</strong><span>{t('serviceText')}</span></p>
      </section>
    </main>
  )
}

export default AdvisorPage
