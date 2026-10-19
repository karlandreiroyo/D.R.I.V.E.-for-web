import { useState } from 'react'
import './incidentreport.css'

const STATUS_FILTERS = ['All', 'New', 'Answered']

function ReportDetail({ report, onReply }) {
  const [draft, setDraft] = useState('')

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    onReply(report.id, text)
    setDraft('')
  }

  return (
    <div className="ir-detail">
      <div className="ir-detail-head">
        <h2 className="ir-detail-title">{report.subject}</h2>
        <span className={`dash-pill ${report.status === 'Answered' ? 'is-done' : ''}`}>{report.status}</span>
      </div>

      <div className="ir-detail-meta">
        <span className="ir-tag">{report.type}</span>
        <span>{report.name}</span>
        <span>{report.email}</span>
        <span>{report.date}</span>
      </div>

      <p className="ir-message">{report.message}</p>

      {report.replies.length > 0 && (
        <div className="ir-replies">
          <h3 className="ir-section-label">Replies</h3>
          {report.replies.map((reply, index) => (
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
        <h3 className="ir-section-label">{report.replies.length > 0 ? 'Send another reply' : 'Reply to driver'}</h3>
        <textarea
          className="ir-textarea"
          rows={4}
          value={draft}
          placeholder={`Write a reply to ${report.name}...`}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="button" className="ir-send" disabled={!draft.trim()} onClick={handleSend}>
          Send reply
        </button>
      </div>
    </div>
  )
}

export default function IncidentReports({ reports, types, onReply }) {
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = reports.filter(
    (item) =>
      (typeFilter === 'All' || item.type === typeFilter) &&
      (statusFilter === 'All' || item.status === statusFilter),
  )

  // If the selected report was filtered out, fall back to the first one in the list.
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0]

  const typeCount = (type) => reports.filter((item) => item.type === type).length

  return (
    <>
      <header className="dash-heading">
        <h1 className="dash-title">Incident Reports</h1>
        <p className="dash-subtitle">Problems drivers reported while using the device.</p>
      </header>

      <div className="ir-filters">
        <div className="ir-chip-row" role="group" aria-label="Filter by type">
          <button
            type="button"
            className={`ir-chip ${typeFilter === 'All' ? 'is-active' : ''}`}
            onClick={() => setTypeFilter('All')}
          >
            All types <span className="ir-chip-count">{reports.length}</span>
          </button>
          {types.map((type) => (
            <button
              key={type}
              type="button"
              className={`ir-chip ${typeFilter === type ? 'is-active' : ''}`}
              onClick={() => setTypeFilter(type)}
            >
              {type} <span className="ir-chip-count">{typeCount(type)}</span>
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
            <p className="ir-empty">No reports match these filters.</p>
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
                        {item.type} · {item.name} · {item.date}
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
            <ReportDetail key={selected.id} report={selected} onReply={onReply} />
          ) : (
            <p className="ir-empty">Select a report to see its details.</p>
          )}
        </div>
      </section>
    </>
  )
}