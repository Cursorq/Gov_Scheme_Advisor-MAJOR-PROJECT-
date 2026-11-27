import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

function ChatPanel({ messages, onSend, busy, file, onFileChange, onRemoveFile, onPreview, error, onReset, message, onMessageChange, quickReplies, onQuickReply }) {
  const { t } = useTranslation()
  const fileInput = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    onSend()
  }

  return (
    <section className="conversation-card" aria-labelledby="conversation-title">
      <div className="conversation-heading">
        <div><span className="live-indicator" />{t('assistantReady')}</div>
        <button className="quiet-button" type="button" onClick={onReset}>{t('newConversation')}</button>
      </div>
      <div className="message-list" aria-live="polite" aria-label={t('conversationLabel')}>
        {messages.map((message, index) => <article className={`message-row ${message.role}`} key={`${index}-${message.role}`}>
          <div className="avatar" aria-hidden="true">{message.role === 'assistant' ? 'स' : '●'}</div>
          <div className="message-content">
            <span className="message-author">{message.role === 'assistant' ? t('assistantName') : t('you')}</span>
            <div className="markdown-body"><ReactMarkdown>{message.text}</ReactMarkdown></div>
          </div>
        </article>)}
        {busy && <div className="loading-line" role="status">{t('working')}</div>}
        {quickReplies?.length > 0 && <div className="quick-replies">{quickReplies.map((reply) => <button type="button" key={reply.value} onClick={() => onQuickReply(reply.value)}>{t(reply.label)}</button>)}</div>}
      </div>
      {error && <div className="error-banner" role="alert">{error}</div>}
      {file && <div className="selected-file"><span aria-hidden="true">▤</span><span>{file.name}</span><button type="button" onClick={onRemoveFile} aria-label={t('removeFile')}>×</button></div>}
      <form className="composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="message-input">{t('messageLabel')}</label>
        <textarea id="message-input" name="message" value={message} onChange={(event) => onMessageChange(event.target.value)} placeholder={t('messagePlaceholder')} rows="3" disabled={busy} />
        <div className="composer-actions">
          <div className="composer-tools">
            <input ref={fileInput} className="sr-only" type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={onFileChange} aria-label={t('uploadFile')} />
            <button className="secondary-button attach-button" type="button" onClick={() => fileInput.current?.click()} disabled={busy}><span aria-hidden="true">＋</span>{t('uploadFile')}</button>
            <span className="file-hint">{t('fileTypes')}</span>
          </div>
          <button className="primary-button send-button" type="submit" disabled={busy}>{t('sendMessage')} <span aria-hidden="true">↑</span></button>
        </div>
      </form>
      <div className="demo-entry"><span>{t('demoPrompt')}</span><button type="button" onClick={onPreview}>{t('previewDemo')}</button></div>
    </section>
  )
}

export default ChatPanel
