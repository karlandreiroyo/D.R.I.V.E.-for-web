import { useMemo, useState } from 'react'
import './ContactSupport.css'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unanswered', label: 'Unanswered' },
  { id: 'answered', label: 'Answered' },
]

const QUICK_REPLIES = [
  'Thank you for reaching out! We are looking into this and will update you shortly.',
  'Please try updating the app to the latest version and restarting your device, then let us know if it still happens.',
  'Your data is private and is only used to keep you safe on the road. You can ask us to delete it anytime.',
]

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function StatusPill({ status }) {
  const answered = status === 'Answered'
  return <span className={`cs-status ${answered ? 'is-answered' : ''}`}>{status}</span>
}

export default function ContactSupport({ tickets, onReply }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(tickets[0]?.id ?? null)
  const [drafts, setDrafts] = useState({})

  const counts = {
    all: tickets.length,
    unanswered: tickets.filter((t) => t.status === 'New').length,
    answered: tickets.filter((t) => t.status === 'Answered').length,
  }

  const visible = useMemo(() => {
    const search = query.trim().toLowerCase()
    return tickets.filter((ticket) => {
      if (filter === 'unanswered' && ticket.status !== 'New') return false
      if (filter === 'answered' && ticket.status !== 'Answered') return false
      if (!search) return true
      return [ticket.subject, ticket.name, ticket.email, ticket.message].some((field) =>
        field.toLowerCase().includes(search),
      )
    })
  }, [tickets, filter, query])

  const selected = visible.find((ticket) => ticket.id === selectedId) ?? visible[0] ?? null
  const draft = selected ? drafts[selected.id] ?? '' : ''

  function setDraft(value) {
    if (!selected) return
    setDrafts((current) => ({ ...current, [selected.id]: value }))
  }

  function handleSend(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!selected || !text) return
    onReply(selected.id, text)
    setDraft('')
  }

  return (
    <>
      <header className="dash-heading">
        <h1 className="dash-title">Contact Support</h1>
        <p className="dash-subtitle">Messages drivers sent from the app. Reply to mark them as answered.</p>
      </header>

      <div className="cs-toolbar">
        <div className="cs-tabs" role="tablist" aria-label="Filter messages">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={`cs-tab ${filter === item.id ? 'is-active' : ''}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
              <span className="cs-tab-count">{counts[item.id]}</span>
            </button>
          ))}
        </div>

        <input
          type="search"
          className="cs-search"
          placeholder="Search name, email, or message"
          aria-label="Search messages"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="cs-layout">
        <section className="dash-card cs-list" aria-label="Messages">
          {visible.length === 0 ? (
            <p className="cs-empty">No messages found.</p>
          ) : (
            visible.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                className={`cs-item ${selected?.id === ticket.id ? 'is-selected' : ''}`}
                onClick={() => setSelectedId(ticket.id)}
              >
                <span className="cs-avatar" aria-hidden="true">{initials(ticket.name)}</span>
                <span className="cs-item-body">
                  <span className="cs-item-top">
                    <span className="cs-item-subject">{ticket.subject}</span>
                    <StatusPill status={ticket.status} />
                  </span>
                  <span className="cs-item-meta">
                    {ticket.name} · {ticket.date}
                  </span>
                  <span className="cs-item-preview">{ticket.message}</span>
                </span>
              </button>
            ))
          )}
        </section>

        <section className="dash-card cs-detail" aria-label="Message details">
          {!selected ? (
            <p className="cs-empty">Select a message to read and reply.</p>
          ) : (
            <>
              <div className="cs-detail-head">
                <h2 className="cs-detail-subject">{selected.subject}</h2>
                <StatusPill status={selected.status} />
              </div>

              <div className="cs-sender">
                <span className="cs-avatar" aria-hidden="true">{initials(selected.name)}</span>
                <div>
                  <p className="cs-sender-name">{selected.name}</p>
                  <p className="cs-sender-meta">
                    {selected.email} · {selected.date}
                  </p>
                </div>
              </div>

              <p className="cs-message">{selected.message}</p>

              {selected.replies.length > 0 && (
                <div className="cs-thread">
                  <p className="cs-section-title">Your replies</p>
                  {selected.replies.map((reply, index) => (
                    <div key={index} className="cs-reply">
                      <p className="cs-reply-meta">
                        {reply.by} · {reply.date}
                      </p>
                      <p className="cs-reply-text">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <form className="cs-compose" onSubmit={handleSend}>
                <p className="cs-section-title">Reply to {selected.name.split(' ')[0]}</p>
                <div className="cs-chips">
                  {QUICK_REPLIES.map((text, index) => (
                    <button key={index} type="button" className="cs-chip" onClick={() => setDraft(text)}>
                      Quick reply {index + 1}
                    </button>
                  ))}
                </div>
                <textarea
                  className="cs-textarea"
                  placeholder="Write your reply here..."
                  aria-label="Reply message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <button type="submit" className="cs-send" disabled={!draft.trim()}>
                  Send reply
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </>
  )
}