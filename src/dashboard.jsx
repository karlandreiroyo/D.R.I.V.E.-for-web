import { useEffect, useState } from 'react'
import ContactSupport from './contactsupport.jsx'
import IncidentReports from './incidentreports.jsx'
import FeatureSuggestions from './featuresuggestions.jsx'
import UsersDevices from './usersdevices.jsx'
import HelpContent from './helpcontent.jsx'
import AdminsRoles from './adminsroles.jsx'
import Archive from './archive.jsx'

// Shared UI Components derived from HTML logic
export function Badge({ text, type }) {
  const typeMap = {
    'New': 'info',
    'Unanswered': 'info',
    'In review': 'warn',
    'Under review': 'warn',
    'In progress': 'warn',
    'Answered': 'ok',
    'Resolved': 'ok',
    'Planned': 'ok',
    'Closed': 'mut',
    'Declined': 'mut',
    'High': 'bad',
    'Medium': 'warn',
    'Low': 'mut',
    'Connected': 'ok',
    'Online': 'ok',
    'Offline': 'mut',
    'Suspended': 'bad',
    'Active': 'ok'
  };
  const c = type || typeMap[text] || 'mut';
  return <span className={`b ${c}`}>{text}</span>;
}

export function Drawer({ open, onClose, children }) {
  return (
    <aside className={`drawer ${open ? 'open' : ''}`} aria-label="Submission details">
      <button className="btn ghost" onClick={onClose} style={{ marginBottom: '12px' }}>Close</button>
      {children}
    </aside>
  )
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm" }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '360px', margin: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <h3 style={{ marginTop: 0, fontSize: '18px' }}>{title}</h3>
        <p className="sub" style={{ marginBottom: '24px' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn" style={{ backgroundColor: 'var(--bad)' }} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

// Submissions mapping adapted from your original payload
const INITIAL_SUBMISSIONS = [
  {
    id: 'SUP-218',
    category: 'Contact Support',
    subCategory: 'Connectivity',
    name: 'Ana Dizon',
    email: 'ana.dizon@email.com',
    date: 'Oct 16, 9:25 AM',
    subject: 'My app says Hardware Not Connected every time',
    message: 'Since this morning my app keeps saying "Hardware Not Connected" even if the device is plugged in and the light is on.',
    status: 'New',
    priority: 'Medium',
    device: 'DRV-0302 · v1.1.4',
    replies: [],
    notes: [],
    isArchived: false
  },
  {
    id: 'INC-1042',
    category: 'Incident Reports',
    subCategory: 'Missed Detection',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    date: 'Oct 17, 8:42 AM',
    subject: 'On the highway I dozed off for about 3 seconds',
    message: 'The alert did not trigger while I was dozing off on the highway. The buzzer never sounded.',
    status: 'New',
    priority: 'High',
    device: 'DRV-0231 · v1.2.0',
    session: '8h 14m',
    replies: [],
    notes: [],
    isArchived: false
  },
  {
    id: 'FTR-31',
    category: 'Feature Suggestions',
    subCategory: 'Customization',
    name: 'Jun Reyes',
    email: 'jun.reyes@email.com',
    date: 'Oct 16, 7:48 PM',
    subject: 'Weekly drowsiness summary by email',
    message: 'It would be great to get a weekly summary of my drowsiness alerts by email to plan my shifts.',
    status: 'Under review',
    sim: 9,
    replies: [],
    notes: [],
    isArchived: false
  },
  {
    id: 'INC-1040',
    category: 'Incident Reports',
    subCategory: 'Hardware Fault',
    name: 'Paolo Cruz',
    email: 'paolo.cruz@email.com',
    date: 'Oct 17, 6:05 PM',
    subject: 'Buzzer works in Test but no sound while driving',
    message: 'The test works, but while driving I do not hear the buzzer.',
    status: 'New',
    priority: 'High',
    device: 'DRV-0094 · v1.1.4',
    session: '1h 9m',
    replies: [],
    notes: [],
    isArchived: false
  }
];

const INITIAL_USERS = [
  { id: 1, name: 'Ana Dizon', email: 'ana.dizon@email.com', phone: '+63 917 123 4501', role: 'Delivery driver', vehicle: 'Motorcycle · ABC 1234', joined: 'Aug 3, 2026', account: 'Active', device: { serial: 'DRV-0302', firmware: 'v1.1.4', connection: 'Offline', alerts30d: 12 } },
  { id: 2, name: 'Maria Santos', email: 'maria.santos@email.com', phone: '+63 917 123 4503', role: 'Bus driver', vehicle: 'Bus · NBC 8890', joined: 'Aug 14, 2026', account: 'Active', device: { serial: 'DRV-0231', firmware: 'v1.2.0', connection: 'Online', alerts30d: 9 } },
  { id: 3, name: 'Paolo Cruz', email: 'paolo.cruz@email.com', phone: '+63 917 123 4504', role: 'Truck driver', vehicle: 'Truck · TRK 3307', joined: 'Aug 21, 2026', account: 'Active', device: { serial: 'DRV-0094', firmware: 'v1.1.4', connection: 'Online', alerts30d: 7 } },
];

function countNew(list, category) {
  return list.filter((s) => s.category === category && s.status === 'New' && !s.isArchived).length
}

function Overview({ submissions, onNavigate }) {
  const incidentCats = {};
  submissions
    .filter(r => r.category === 'Incident Reports' && !r.isArchived)
    .forEach(r => { incidentCats[r.subCategory] = (incidentCats[r.subCategory] || 0) + 1 });
  
  const barMax = Math.max(2, ...Object.values(incidentCats));
  const latest = submissions.filter(s => !s.isArchived).slice(0, 6);

  return (
    <>
      <h1>Dashboard</h1>
      <p className="sub">What drivers sent in and what still needs an answer.</p>
      
      <div className="grid g3">
        <div className="card stat" onClick={() => onNavigate('contact-support')}>
          <b>{countNew(submissions, 'Contact Support')}</b>
          <span>Contact Support: new</span>
        </div>
        <div className="card stat" onClick={() => onNavigate('incident-reports')}>
          <b>{countNew(submissions, 'Incident Reports')}</b>
          <span>Incident Reports: new</span>
        </div>
        <div className="card stat" onClick={() => onNavigate('feature-suggestions')}>
          <b>{countNew(submissions, 'Feature Suggestions')}</b>
          <span>Feature Suggestions: new</span>
        </div>
      </div>

      <div className="grid g2" style={{ marginTop: '14px' }}>
        <div className="card">
          <h3>Incident reports by type</h3>
          {Object.entries(incidentCats).map(([k, v]) => (
            <div className="bar" key={k}>
              <span>{k}</span>
              <div><i style={{ width: `${(v / barMax) * 100}%` }}></i></div>
              <b>{v}</b>
            </div>
          ))}
        </div>
        
        <div className="card">
          <h3>Latest submissions</h3>
          {latest.map(item => (
            <div className="item" key={item.id} onClick={() => onNavigate(item.category.toLowerCase().replace(' ', '-'))}>
              <div>
                {item.subject.slice(0, 48) + (item.subject.length > 48 ? '...' : '')}
                <div className="mut sm">{item.category} · {item.name}</div>
              </div>
              <Badge text={item.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default function Dashboard({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [toastMsg, setToastMsg] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Required to override the login body styles dynamically
  useEffect(() => {
    document.body.classList.add('dashboard-active');
    return () => document.body.classList.remove('dashboard-active');
  }, []);

  function toggleTheme() {
    const r = document.documentElement;
    const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const c = r.dataset.theme || (isDark ? "dark" : "light");
    r.dataset.theme = c === "dark" ? "light" : "dark";
  }

  function triggerToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 1800);
  }

  function handleReply(id, text) {
    setSubmissions((list) =>
      list.map((item) =>
        item.id === id
          ? { ...item, status: 'Answered', replies: [...item.replies, { t: text, d: 'Just now' }] }
          : item
      )
    );
    triggerToast('Reply sent');
  }

  function handleNote(id, text) {
    setSubmissions((list) =>
      list.map((item) => item.id === id ? { ...item, notes: [...item.notes, text] } : item)
    );
    triggerToast('Note added');
  }

  function handleUpdateStatus(id, newStatus, field = 'status') {
    setSubmissions((list) =>
      list.map((item) => item.id === id ? { ...item, [field]: newStatus } : item)
    );
    triggerToast(`Updated to ${newStatus}`);
  }

  function handleToggleArchive(id, isArchived) {
    setSubmissions((list) =>
      list.map((item) => item.id === id ? { ...item, isArchived } : item)
    );
    triggerToast(isArchived ? 'Moved to archive' : 'Restored from archive');
  }

  const badges = {
    'contact-support': countNew(submissions, 'Contact Support'),
    'incident-reports': countNew(submissions, 'Incident Reports'),
    'feature-suggestions': countNew(submissions, 'Feature Suggestions'),
  }

  function NavItem({ id, label, badge }) {
    return (
      <button className={page === id ? "on" : ""} onClick={() => setPage(id)}>
        {label}
        {badge > 0 && <span className="n">{badge}</span>}
      </button>
    )
  }

  let content;
  if (page === 'dashboard') {
    content = <Overview submissions={submissions} onNavigate={setPage} />;
  } else if (page === 'contact-support') {
    content = <ContactSupport tickets={submissions.filter(s => s.category === 'Contact Support')} onReply={handleReply} onNote={handleNote} onUpdateStatus={handleUpdateStatus} onArchive={handleToggleArchive} />;
  } else if (page === 'incident-reports') {
    content = <IncidentReports reports={submissions.filter(s => s.category === 'Incident Reports')} onReply={handleReply} onNote={handleNote} onUpdateStatus={handleUpdateStatus} onArchive={handleToggleArchive} />;
  } else if (page === 'feature-suggestions') {
    content = <FeatureSuggestions suggestions={submissions.filter(s => s.category === 'Feature Suggestions')} onReply={handleReply} onNote={handleNote} onUpdateStatus={handleUpdateStatus} onArchive={handleToggleArchive} />;
  } else if (page === 'users-devices') {
    content = <UsersDevices users={users} triggerToast={triggerToast} />;
  } else if (page === 'help') {
    content = <HelpContent triggerToast={triggerToast} />;
  } else if (page === 'admins') {
    content = <AdminsRoles triggerToast={triggerToast} />;
  } else if (page === 'archive') {
    content = <Archive submissions={submissions.filter(s => s.isArchived)} onRestore={handleToggleArchive} />;
  } else {
    content = <div><header><h1>Coming Soon</h1></header></div>;
  }

  return (
    <div className="app">
      <nav aria-label="Main" className="nav-sidebar">
        <div className="logo">
          <img 
            src="/project-logo.png" 
            alt="D.R.I.V.E. Logo" 
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} 
          />
          <div>D.R.I.V.E.<small>Admin console</small></div>
        </div>
        
        <NavItem id="dashboard" label="Dashboard" />
        
        <div className="sec">From the app</div>
        <NavItem id="contact-support" label="Contact Support" badge={badges['contact-support']} />
        <NavItem id="incident-reports" label="Incident Reports" badge={badges['incident-reports']} />
        <NavItem id="feature-suggestions" label="Feature Suggestions" badge={badges['feature-suggestions']} />
        
        <div className="sec">Manage</div>
        <NavItem id="users-devices" label="Users & devices" />
        <NavItem id="help" label="Help content" />
        <NavItem id="admins" label="Admins" />
        <NavItem id="archive" label="Archive" />
        
        <div className="sp"></div>
        <button onClick={toggleTheme}>Toggle theme</button>
        <button onClick={() => setShowLogoutModal(true)}>Log out</button>
      </nav>

      <main className="main-content">
        {content}
      </main>

      <div className={`toast ${toastMsg ? 'on' : ''}`} role="status">
        {toastMsg}
      </div>

      <ConfirmModal 
        isOpen={showLogoutModal} 
        title="Log out" 
        message="Are you sure you want to log out?" 
        confirmText="Log out"
        onConfirm={onLogout} 
        onCancel={() => setShowLogoutModal(false)} 
      />
    </div>
  )
}