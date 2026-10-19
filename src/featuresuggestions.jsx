import { useState } from 'react'
// Shares the list/detail layout styles with the Incident Reports page,
// plus a few extras (stage tag and dropdown) in featuresuggestions.css.
import './incidentreport.css'
import './featuresuggestions.css'

const STATUS_FILTERS = ['All', 'New', 'Answered']

function stageClass(stage) {
  return `fs-stage fs-stage--${stage.toLowerCase().replace(/\s+/g, '-')}`
}

function SuggestionDetail({ item, stages, onReply, onStageChange }) {
  const [draft, setDraft] = useState('')

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    onReply(item.id, text)
    setDraft('')
  }

  return (
    <div className="ir-detail">
      <div className="ir-detail-head">
        <h2 className="ir-detail-title">{item.subject}</h2>
        <span className={`dash-pill ${item.status === 'Answered' ? 'is-done' : ''}`}>{item.status}</span>
      </div>

      <div className="ir-detail-meta">
        <span className={stageClass(item.stage)}>{item.stage}</span>
        <span>{item.name}</span>
        <span>{item.email}</span>
        <span>{item.date}</span>
      </div>

      <div className="fs-stage-row">
        <label className="ir-section-label" htmlFor={`stage-${item.id}`}>
          Stage
        </label>
        <select
          id={`stage-${item.id}`}
          className="fs-select"
          value={item.stage}
          onChange={(event) => onStageChange(item.id, event.target.value)}
        >
          {stages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>

      <p className="ir-message">{item.message}</p>

      {item.replies.length > 0 && (
        <div className="ir-replies">
          <h3 className="ir-section-label">Replies</h3>
          {item.replies.map((reply, index) => (
            <div key={index} className="ir-reply">
              <p className="ir-reply-meta">
                {reply.by} · {reply.date}
              </p>
              <p className="ir-reply-text">{reply.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="ir-compose">
        <h3 className="ir-section-label">{item.replies.length > 0 ? 'Send another reply' : 'Reply to driver'}</h3>
        <textarea
          className="ir-textarea"
          rows={4}
          value={draft}
          placeholder={`Write a reply to ${item.name}...`}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="button" className="ir-send" disabled={!draft.trim()} onClick={handleSend}>
          Send reply
        </button>
      </div>
    </div>
  )
}

export default function FeatureSuggestions({ suggestions, stages, onReply, onStageChange }) {
  const [stageFilter, setStageFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = suggestions.filter(
    (item) =>
      (stageFilter === 'All' || item.stage === stageFilter) &&
      (statusFilter === 'All' || item.status === statusFilter),
  )

  // If the selected suggestion was filtered out, fall back to the first one in the list.
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0]

  const stageCount = (stage) => suggestions.filter((item) => item.stage === stage).length

  return (
    <>
      <header className="dash-heading">
        <h1 className="dash-title">Feature Suggestions</h1>
        <p className="dash-subtitle">Ideas drivers sent in. Reply to them and track what you plan to build.</p>
      </header>

      <div className="ir-filters">
        <div className="ir-chip-row" role="group" aria-label="Filter by stage">
          <button
            type="button"
            className={`ir-chip ${stageFilter === 'All' ? 'is-active' : ''}`}
            onClick={() => setStageFilter('All')}
          >
            All stages <span className="ir-chip-count">{suggestions.length}</span>
          </button>
          {stages.map((stage) => (
            <button
              key={stage}
              type="button"
              className={`ir-chip ${stageFilter === stage ? 'is-active' : ''}`}
              onClick={() => setStageFilter(stage)}
            >
              {stage} <span className="ir-chip-count">{stageCount(stage)}</span>
            </button>
          ))}
        </div>

        <div className="ir-chip-row" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              className={`ir-chip ${statusFilter === status ? 'is-active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <section className="ir-layout">
        <div className="dash-card ir-list">
          {filtered.length === 0 ? (
            <p className="ir-empty">No suggestions match these filters.</p>
          ) : (
            <ul className="ir-items">
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`ir-item ${selected && selected.id === item.id ? 'is-selected' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span className="ir-item-text">
                      <span className="ir-item-title">{item.subject}</span>
                      <span className="ir-item-meta">
                        {item.stage} · {item.name} · {item.date}
                      </span>
                    </span>
                    <span className={`dash-pill ${item.status === 'Answered' ? 'is-done' : ''}`}>{item.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dash-card ir-detail-card">
          {selected ? (
            <SuggestionDetail
              key={selected.id}
              item={selected}
              stages={stages}
              onReply={onReply}
              onStageChange={onStageChange}
            />
          ) : (
            <p className="ir-empty">Select a suggestion to see its details.</p>
          )}
        </div>
      </section>
    </>
  )
}