import { useState } from 'react'
import { Badge } from './dashboard.jsx'

const TABS = [
  { id: 'Contact Support', label: 'Contact Support' },
  { id: 'Incident Reports', label: 'Incident Reports' },
  { id: 'Feature Suggestions', label: 'Feature Suggestions' }
];

export default function Archive({ submissions, onRestore }) {
  const [activeTab, setActiveTab] = useState('Contact Support');

  const visible = submissions.filter(s => s.category === activeTab);

  return (
    <>
      <h1>Archive</h1>
      <p className="sub">Retrieve deleted submissions here.</p>

      <div className="tools" style={{ marginBottom: '16px', gap: '12px' }}>
        {TABS.map(tab => (
          <button 
            key={tab.id} 
            className={`btn ${activeTab === tab.id ? '' : 'ghost'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Message</th>
              <th>Category / Type</th>
              <th>From</th>
              <th>Sent</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan="6" className="mut">No archived items in this category.</td></tr>
            ) : visible.map(r => (
              <tr key={r.id} className="row">
                <td className="mut">{r.id}</td>
                <td><b>{r.subject.slice(0, 56)}...</b></td>
                <td>{r.subCategory}</td>
                <td>{r.name}</td>
                <td className="mut sm">{r.date}</td>
                <td>
                  <button 
                    className="btn ghost" 
                    style={{ padding: '6px 12px' }}
                    onClick={(e) => { e.stopPropagation(); onRestore(r.id, false); }}
                  >
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}