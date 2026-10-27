import { useState } from 'react'
import { Badge, Drawer } from './dashboard.jsx'

const INITIAL_HELP = [
  { id: 1, title: 'How do I calibrate my device?', type: 'FAQ', status: 'Published' },
  { id: 2, title: 'What the system can detect', type: 'System page', status: 'Published' },
  { id: 3, title: 'Camera & privacy policy', type: 'Policy', status: 'Published' },
  { id: 4, title: 'Firmware v1.3.0 notes', type: 'Announcement', status: 'Draft' }
];

export default function HelpContent({ triggerToast }) {
  // Use state so edits actually update the table
  const [helpData, setHelpData] = useState(INITIAL_HELP);
  
  // Track which item is being edited and the form data
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', type: '', status: '' });

  // Open the drawer and populate the form with the selected item's data
  function handleEditClick(item) {
    setFormData({ title: item.title, type: item.type, status: item.status });
    setEditingId(item.id);
  }

  // Save the changes back to the state array
  function handleSave() {
    if (!formData.title.trim()) {
      triggerToast('Title cannot be empty');
      return;
    }
    
    setHelpData(prev => 
      prev.map(h => h.id === editingId ? { ...h, ...formData } : h)
    );
    
    setEditingId(null);
    triggerToast('Changes saved successfully');
  }

  return (
    <>
      <h1>Help content</h1>
      <p className="sub">What drivers read under Help & Support.</p>
      
      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Type</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {helpData.map(h => (
              <tr key={h.id} className="row">
                <td>{h.title}</td>
                <td>{h.type}</td>
                <td><Badge text={h.status} type={h.status === 'Published' ? 'ok' : 'warn'} /></td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn ghost" onClick={() => handleEditClick(h)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* The Editing Drawer */}
      <Drawer open={!!editingId} onClose={() => setEditingId(null)}>
        {editingId && (
          <>
            <h2>Edit content</h2>
            <p className="sub" style={{ marginBottom: '20px' }}>Update the help article details.</p>

            <div className="lbl">Page title</div>
            <input 
              type="text"
              style={{ display: 'block', width: '100%', marginBottom: '14px' }}
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />

            <div className="lbl">Content Type</div>
            <input 
              type="text"
              style={{ display: 'block', width: '100%', marginBottom: '14px' }}
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            />

            <div className="lbl">Status</div>
            <select 
              style={{ display: 'block', width: '100%', marginBottom: '24px' }}
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>

            <p style={{ display: 'flex', gap: '8px' }}>
              <button className="btn" onClick={handleSave}>Save changes</button>
              <button className="btn ghost" onClick={() => setEditingId(null)}>Cancel</button>
            </p>
          </>
        )}
      </Drawer>
    </>
  )
}
