import { useEffect, useRef, useState } from 'react'
import ContactSupport from './contactsupport.jsx'
import IncidentReports from './incidentreports.jsx'
import FeatureSuggestions from './featuresuggestions.jsx'
import './dashboard.css'

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  {
    section: 'From the app',
    items: [
      { id: 'contact-support', label: 'Contact Support' },
      { id: 'incident-reports', label: 'Incident Reports' },
      { id: 'feature-suggestions', label: 'Feature Suggestions' },
    ],
  },
  {
    section: 'Manage',
    items: [
      { id: 'users-devices', label: 'Users & Devices' },
      { id: 'help-content', label: 'Help Content' },
      { id: 'admins', label: 'Admins' },
    ],
  },
]

// Sample data. Replace with real data from your backend later.
// status: 'New' (not answered yet) or 'Answered'
// Incident Reports also have a `type` (one of INCIDENT_TYPES below).
// Feature Suggestions also have a `stage` (one of FEATURE_STAGES below).
const INITIAL_SUBMISSIONS = [
  {
    id: 1,
    category: 'Contact Support',
    name: 'Ana Dizon',
    email: 'ana.dizon@email.com',
    date: 'Oct 18, 2026 · 9:42 AM',
    subject: 'My app says Hardware Not Connected every time I open it',
    message:
      'Hi! Since this morning my app keeps saying "Hardware Not Connected" even if the device is plugged in and the light is on. I already restarted my phone twice and it is still the same. Please help.',
    status: 'New',
    replies: [],
  },
  {
    id: 2,
    category: 'Contact Support',
    name: 'Grace Tan',
    email: 'grace.tan@email.com',
    date: 'Oct 18, 2026 · 8:15 AM',
    subject: 'How long is my camera data kept? I want to be sure it is private',
    message:
      'Good morning. I would like to know how long the camera footage and face data are stored, and who can see them. I drive for a delivery company and I want to be sure my data stays private.',
    status: 'New',
    replies: [],
  },
  {
    id: 3,
    category: 'Incident Reports',
    type: 'Missed Detection',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    date: 'Oct 17, 2026 · 9:30 PM',
    subject: 'On the highway I dozed off for about 3 seconds and nothing happened',
    message: 'The alert did not trigger while I was dozing off on the highway.',
    status: 'New',
    replies: [],
  },
  {
    id: 4,
    category: 'Incident Reports',
    type: 'Hardware Fault',
    name: 'Paolo Cruz',
    email: 'paolo.cruz@email.com',
    date: 'Oct 17, 2026 · 6:05 PM',
    subject: 'Buzzer works in Test Buzzer & Vibration but there is no sound while driving',
    message: 'The test works, but while driving I do not hear the buzzer.',
    status: 'New',
    replies: [],
  },
  {
    id: 5,
    category: 'Incident Reports',
    type: 'Calibration / Lighting',
    name: 'Ken Villar',
    email: 'ken.villar@email.com',
    date: 'Oct 17, 2026 · 2:20 PM',
    subject: 'Calibration passes face detection but Lighting check keeps failing',
    message: 'Face detection passes but the lighting check fails every time.',
    status: 'New',
    replies: [],
  },
  {
    id: 6,
    category: 'Feature Suggestions',
    stage: 'Under review',
    name: 'Jun Reyes',
    email: 'jun.reyes@email.com',
    date: 'Oct 16, 2026 · 7:48 PM',
    subject: 'Weekly drowsiness summary by email',
    message: 'It would be great to get a weekly summary of my drowsiness alerts by email.',
    status: 'New',
    replies: [],
  },
  {
    id: 7,
    category: 'Contact Support',
    name: 'Liza Ramos',
    email: 'liza.ramos@email.com',
    date: 'Oct 15, 2026 · 11:10 AM',
    subject: 'How do I pair a second driver to one device?',
    message: 'We share one device between two drivers. How can I add the second driver so alerts are saved separately?',
    status: 'Answered',
    replies: [
      {
        by: 'Admin1',
        date: 'Oct 15, 2026 · 1:25 PM',
        text: 'Hi Liza! Open Settings > Drivers in the app and tap Add Driver. Each driver can then sign in and their alerts are saved separately. Let us know if you need anything else.',
      },
    ],
  },
  {
    id: 8,
    category: 'Contact Support',
    name: 'Carlo Mendoza',
    email: 'carlo.mendoza@email.com',
    date: 'Oct 14, 2026 · 4:50 PM',
    subject: 'I cannot change my phone number',
    message: 'I got a new SIM and I cannot find where to change my phone number in the app.',
    status: 'Answered',
    replies: [
      {
        by: 'Admin1',
        date: 'Oct 14, 2026 · 6:02 PM',
        text: 'Hello Carlo! You can update it under Profile > Edit Details. If the option is missing, please update the app to the latest version.',
      },
    ],
  },
  {
    id: 9,
    category: 'Incident Reports',
    type: 'False Alarm',
    name: 'Sofia Lim',
    email: 'sofia.lim@email.com',
    date: 'Oct 13, 2026 · 3:12 PM',
    subject: 'Alarm goes off when I look at my side mirror',
    message: 'Every time I check my side mirror the buzzer sounds even though I am fully awake and alert.',
    status: 'New',
    replies: [],
  },
  {
    id: 10,
    category: 'Incident Reports',
    type: 'App Bug',
    name: 'Rico Bautista',
    email: 'rico.bautista@email.com',
    date: 'Oct 12, 2026 · 10:05 AM',
    subject: 'App closes by itself when I open the Trip History screen',
    message: 'Whenever I tap Trip History the app closes and goes back to my home screen.',
    status: 'Answered',
    replies: [
      {
        by: 'Admin1',
        date: 'Oct 12, 2026 · 2:40 PM',
        text: 'Thanks for reporting this, Rico. We found the cause and a fix is coming in the next update. Please update the app once it is available.',
      },
    ],
  },
  {
    id: 11,
    category: 'Feature Suggestions',
    stage: 'Planned',
    name: 'Diane Flores',
    email: 'diane.flores@email.com',
    date: 'Oct 11, 2026 · 8:30 PM',
    subject: 'Dark mode for night driving',
    message: 'The app screen is very bright at night. A dark mode would be easier on the eyes when I set up the device before a trip.',
    status: 'Answered',
    replies: [
      {
        by: 'Admin1',
        date: 'Oct 12, 2026 · 9:15 AM',
        text: 'Thanks Diane! Dark mode is on our list and planned for an upcoming update.',
      },
    ],
  },
  {
    id: 12,
    category: 'Feature Suggestions',
    stage: 'Under review',
    name: 'Mark Galang',
    email: 'mark.galang@email.com',
    date: 'Oct 10, 2026 · 5:22 PM',
    subject: 'Voice alerts in Tagalog and Bisaya',
    message: 'Can the alert also speak in Tagalog or Bisaya? Some of our drivers understand local languages better than English.',
    status: 'New',
    replies: [],
  },
  {
    id: 13,
    category: 'Feature Suggestions',
    stage: 'In progress',
    name: 'Nina Castillo',
    email: 'nina.castillo@email.com',
    date: 'Oct 9, 2026 · 1:05 PM',
    subject: 'Show where each drowsiness alert happened on a map',
    message: 'In Trip History it would help to see on a map where each alert happened, so I know which roads make me sleepy.',
    status: 'Answered',
    replies: [
      {
        by: 'Admin1',
        date: 'Oct 9, 2026 · 4:00 PM',
        text: 'Great idea, Nina! We have started working on a map view for Trip History.',
      },
    ],
  },
]

const INCIDENT_TYPES = ['Missed Detection', 'False Alarm', 'Hardware Fault', 'App Bug', 'Calibration / Lighting']
const FEATURE_STAGES = ['Under review', 'Planned', 'In progress', 'Done', 'Declined']

function countNew(list, category) {
  return list.filter((s) => s.category === category && s.status === 'New').length
}

function UserIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="dash-user-icon" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="12.5" r="4.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 25.2c1.6-4.3 5-6.2 9-6.2s7.4 1.9 9 6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="dash-chevron" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TopBar({ onLogout }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="dash-topbar">
      <div className="dash-brand">
        <span className="dash-logo-shell">
          <img src="/project-logo.png" alt="" className="dash-logo" />
        </span>
        <span className="dash-brand-name">D.R.I.V.E.</span>
      </div>

      <div className="dash-account" ref={menuRef}>
        <button
          type="button"
          className="dash-account-button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <UserIcon />
          <span className="dash-account-name">Admin1</span>
          <ChevronIcon />
        </button>
        {open && (
          <div className="dash-menu" role="menu">
            <button type="button" role="menuitem" className="dash-menu-item" onClick={onLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

function NavButton({ item, active, badge, onSelect }) {
  const isActive = active === item.id
  return (
    <button
      type="button"
      className={`dash-nav-item ${isActive ? 'is-active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => onSelect(item.id)}
    >
      <span>{item.label}</span>
      {badge > 0 && <span className="dash-nav-badge">{badge}</span>}
    </button>
  )
}

function Sidebar({ active, onSelect, badges }) {
  return (
    <nav className="dash-sidebar" aria-label="Main">
      {NAV.map((entry) =>
        entry.section ? (
          <div key={entry.section} className="dash-nav-group">
            <p className="dash-nav-label">{entry.section}</p>
            {entry.items.map((item) => (
              <NavButton key={item.id} item={item} active={active} badge={badges[item.id]} onSelect={onSelect} />
            ))}
          </div>
        ) : (
          <NavButton key={entry.id} item={entry} active={active} onSelect={onSelect} />
        ),
      )}
    </nav>
  )
}

function Overview({ submissions, onNavigate }) {
  // Count incident reports per type from the real data.
  const incidentCounts = INCIDENT_TYPES.map((label) => ({
    label,
    count: submissions.filter((s) => s.category === 'Incident Reports' && s.type === label).length,
  }))
  const barMax = Math.max(2, ...incidentCounts.map((t) => t.count))

  const stats = [
    { value: countNew(submissions, 'Contact Support'), label: 'Contact Support: unanswered', page: 'contact-support' },
    { value: countNew(submissions, 'Incident Reports'), label: 'Incident Reports: new', page: 'incident-reports' },
    { value: countNew(submissions, 'Feature Suggestions'), label: 'Feature Suggestions: new', page: 'feature-suggestions' },
  ]

  const latest = submissions.slice(0, 6)

  return (
    <>
      <header className="dash-heading">
        <h1 className="dash-title">Dashboard</h1>
        <p className="dash-subtitle">What drivers sent in and what still needs an answer.</p>
      </header>

      <section className="dash-stats" aria-label="Summary">
        {stats.map((stat) => (
          <button key={stat.label} type="button" className="dash-card dash-stat" onClick={() => onNavigate(stat.page)}>
            <span className="dash-stat-value">{stat.value}</span>
            <span className="dash-stat-label">{stat.label}</span>
          </button>
        ))}
      </section>

      <section className="dash-panels">
        <div className="dash-card dash-panel">
          <h2 className="dash-panel-title">Incident reports by type</h2>
          <ul className="dash-type-list">
            {incidentCounts.map((type) => (
              <li key={type.label} className="dash-type-row">
                <span className="dash-type-label">{type.label}</span>
                <span className="dash-bar-track">
                  <span className="dash-bar-fill" style={{ width: `${(type.count / barMax) * 100}%` }} />
                </span>
                <span className="dash-type-count">{type.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="dash-card dash-panel">
          <h2 className="dash-panel-title">Latest submissions</h2>
          <ul className="dash-submissions">
            {latest.map((item) => (
              <li key={item.id} className="dash-submission">
                <div className="dash-submission-text">
                  <p className="dash-submission-title">{item.subject}</p>
                  <p className="dash-submission-meta">
                    {item.category} · {item.name}
                  </p>
                </div>
                <span className={`dash-pill ${item.status === 'Answered' ? 'is-done' : ''}`}>{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

function Placeholder({ title }) {
  return (
    <header className="dash-heading">
      <h1 className="dash-title">{title}</h1>
      <p className="dash-subtitle">This page is coming soon.</p>
    </header>
  )
}

export default function Dashboard({ onLogout }) {
  const [page, setPage] = useState('dashboard')
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS)

  function handleReply(id, text) {
    const date = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
    setSubmissions((list) =>
      list.map((item) =>
        item.id === id
          ? { ...item, status: 'Answered', replies: [...item.replies, { by: 'Admin1', date, text }] }
          : item,
      ),
    )
  }

  function handleStageChange(id, stage) {
    setSubmissions((list) => list.map((item) => (item.id === id ? { ...item, stage } : item)))
  }

  const badges = {
    'contact-support': countNew(submissions, 'Contact Support'),
    'incident-reports': countNew(submissions, 'Incident Reports'),
    'feature-suggestions': countNew(submissions, 'Feature Suggestions'),
  }

  const pageTitle = NAV.flatMap((entry) => (entry.section ? entry.items : [entry])).find((item) => item.id === page)?.label

  let content
  if (page === 'dashboard') {
    content = <Overview submissions={submissions} onNavigate={setPage} />
  } else if (page === 'contact-support') {
    content = (
      <ContactSupport
        tickets={submissions.filter((item) => item.category === 'Contact Support')}
        onReply={handleReply}
      />
    )
  } else if (page === 'incident-reports') {
    content = (
      <IncidentReports
        reports={submissions.filter((item) => item.category === 'Incident Reports')}
        types={INCIDENT_TYPES}
        onReply={handleReply}
      />
    )
  } else if (page === 'feature-suggestions') {
    content = (
      <FeatureSuggestions
        suggestions={submissions.filter((item) => item.category === 'Feature Suggestions')}
        stages={FEATURE_STAGES}
        onReply={handleReply}
        onStageChange={handleStageChange}
      />
    )
  } else {
    content = <Placeholder title={pageTitle} />
  }

  return (
    <div className="dash-page">
      <TopBar onLogout={onLogout} />
      <div className="dash-body">
        <Sidebar active={page} onSelect={setPage} badges={badges} />
        <main className="dash-main">{content}</main>
      </div>
    </div>
  )
}