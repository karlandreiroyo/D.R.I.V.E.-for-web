import { useState } from 'react'
import { Badge, Drawer, ConfirmModal } from './dashboard.jsx'

const STATUS_OPTS = ["New", "In review", "Resolved"];

export default function IncidentReports({ reports, onReply, onNote, onUpdateStatus, onArchive }) {
  const [filterStatus, setFilterStatus] = useState('All')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [noteDraft, setNoteDraft] = useState('')

  const visible = reports.filter(t => 
    !t.isArchived &&
    (filterStatus === 'All' || t.status === filterStatus) &&
    (!query || (t.name + t.id + t.subject).toLowerCase().includes(query.toLowerCase()))
  );
  
  const selected = reports.find(t => t.id === selectedId) || null;

  return (
    <>
      <h1>Incident Reports</h1>
      <p className="sub">Reports drivers file with Report an Incident. Missed detections come first.</p>
      
      <div className="tools" style={{ display: 'flex', gap: '12px' }}>
        <input 
          style={{ width: '280px' }}
          placeholder="Search by name, ID or text" 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
        />
        <select style={{ width: '180px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option>All</option>
          {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Message</th>
              <th>Incident type</th>
              <th>From</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Sent</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan="8" className="mut">Nothing matches these filters.</td></tr>
            ) : visible.map(r => (
              <tr key={r.id} className="row" onClick={() => setSelectedId(r.id)}>
                <td className="mut">{r.id}</td>
                <td><b>{r.subject.slice(0, 56)}...</b></td>
                <td>{r.subCategory}</td>
                <td>{r.name}</td>
                <td><Badge text={r.priority} /></td>
                <td><Badge text={r.status} /></td>
                <td className="mut sm">{r.date}</td>
                <td>
                  <button 
                    className="btn ghost" 
                    style={{ color: 'var(--bad)', padding: '6px 12px' }}
                    onClick={(e) => { e.stopPropagation(); setItemToDelete(r.id); }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={!!itemToDelete} 
        title="Delete Report" 
        message="Are you sure you want to delete this report? It will be moved to the archive." 
        confirmText="Delete"
        onConfirm={() => { onArchive(itemToDelete, true); setItemToDelete(null); setSelectedId(null); }} 
        onCancel={() => setItemToDelete(null)} 
      />

      <Drawer open={!!selected} onClose={() => setSelectedId(null)}>
        {selected && (
          <>
            <h2>{selected.id} · {selected.name}</h2>
            <div className="mut sm">Incident Reports · sent {selected.date} <Badge text={selected.status} /> <Badge text={selected.priority} /></div>
            
            <div className="lbl">Incident type</div>
            <div className="fld">{selected.subCategory}</div>
            
            <div className="lbl">Description of event</div>
            <div className="fld">{selected.message}</div>
            
            <div className="kv">
              <span>Device</span>{selected.device || 'N/A'}
              <span>Session</span>{selected.session || 'N/A'}
            </div>
            
            <div className="tools" style={{ marginTop: '14px' }}>
              <select aria-label="Status" value={selected.status} onChange={(e) => onUpdateStatus(selected.id, e.target.value)}>
                {STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <select aria-label="Priority" value={selected.priority} onChange={(e) => onUpdateStatus(selected.id, e.target.value, 'priority')}>
                {['High', 'Medium', 'Low'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            
            <div className="lbl">Responses (shown to driver)</div>
            {selected.replies.length === 0 ? <div className="mut sm">No reply sent.</div> : selected.replies.map((x, i) => (
              <div className="rep" key={i}><b>Reply ({x.d})</b>{x.t}</div>
            ))}
            
            <textarea placeholder="Write a reply..." value={replyDraft} onChange={e => setReplyDraft(e.target.value)} />
            <p><button className="btn" onClick={() => { onReply(selected.id, replyDraft); setReplyDraft(''); }}>Send reply</button></p>
            
            <div className="lbl">Internal notes</div>
            {selected.notes.map((n, i) => <div className="note" key={i}>{n}</div>)}
            <textarea placeholder="Add private note" style={{ minHeight: '56px' }} value={noteDraft} onChange={e => setNoteDraft(e.target.value)} />
            <p><button className="btn ghost" onClick={() => { onNote(selected.id, noteDraft); setNoteDraft(''); }}>Add note</button></p>
          </>
        )}
      </Drawer>
    </>
  )
}