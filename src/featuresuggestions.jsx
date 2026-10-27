import { useState } from 'react'
import { Badge, Drawer, ConfirmModal } from './dashboard.jsx'

const STATUS_OPTS = ["New", "Under review", "Planned", "In progress", "Declined"];

export default function FeatureSuggestions({ suggestions, onReply, onNote, onUpdateStatus, onArchive }) {
  const [filterStatus, setFilterStatus] = useState('All')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [noteDraft, setNoteDraft] = useState('')

  const visible = suggestions.filter(t => 
    !t.isArchived &&
    (filterStatus === 'All' || t.status === filterStatus) &&
    (!query || (t.name + t.id + t.subject).toLowerCase().includes(query.toLowerCase()))
  );
  
  const selected = suggestions.find(t => t.id === selectedId) || null;

  return (
    <>
      <h1>Feature Suggestions</h1>
      <p className="sub">Ideas drivers send with Suggest a Feature.</p>
      
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
              <th>Suggestion</th>
              <th>Theme</th>
              <th>From</th>
              <th>Status</th>
              <th>Sent</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan="7" className="mut">Nothing matches these filters.</td></tr>
            ) : visible.map(r => (
              <tr key={r.id} className="row" onClick={() => setSelectedId(r.id)}>
                <td className="mut">{r.id}</td>
                <td><b>{r.subject.slice(0, 56)}...</b></td>
                <td>{r.subCategory}</td>
                <td>{r.name}</td>
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
        title="Delete Suggestion" 
        message="Are you sure you want to delete this suggestion? It will be moved to the archive." 
        confirmText="Delete"
        onConfirm={() => { onArchive(itemToDelete, true); setItemToDelete(null); setSelectedId(null); }} 
        onCancel={() => setItemToDelete(null)} 
      />

      <Drawer open={!!selected} onClose={() => setSelectedId(null)}>
        {selected && (
          <>
            <h2>{selected.id} · {selected.name}</h2>
            <div className="mut sm">Feature Suggestions · sent {selected.date} <Badge text={selected.status} /></div>
            
            <div className="lbl">Suggest feature</div>
            <div className="fld">{selected.subject}</div>
            
            <div className="lbl">How would this help you?</div>
            <div className="fld">{selected.message}</div>
            
            {selected.sim && (
              <div className="kv">
                <span>Similar ideas</span>{selected.sim} other drivers asked for this
              </div>
            )}
            
            <div className="tools" style={{ marginTop: '14px' }}>
              <select aria-label="Status" value={selected.status} onChange={(e) => onUpdateStatus(selected.id, e.target.value)}>
                {STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            
            <div className="lbl">Responses</div>
            {selected.replies.length === 0 ? <div className="mut sm">No reply sent.</div> : selected.replies.map((x, i) => (
              <div className="rep" key={i}><b>Reply ({x.d})</b>{x.t}</div>
            ))}
            
            <textarea placeholder="Write a reply..." value={replyDraft} onChange={e => setReplyDraft(e.target.value)} />
            <p><button className="btn" onClick={() => { onReply(selected.id, replyDraft); setReplyDraft(''); }}>Send reply</button></p>
            
            <div className="lbl">Internal notes</div>
            {selected.notes.map((n, i) => <div className="note" key={i}>{n}</div>)}
            <textarea placeholder="Add note" style={{ minHeight: '56px' }} value={noteDraft} onChange={e => setNoteDraft(e.target.value)} />
            <p><button className="btn ghost" onClick={() => { onNote(selected.id, noteDraft); setNoteDraft(''); }}>Add note</button></p>
          </>
        )}
      </Drawer>
    </>
  )
}