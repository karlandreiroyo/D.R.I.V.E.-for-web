import { useState } from 'react'
// Shares the list/detail layout styles with the Incident Reports page,
// plus the extras (stats, search, pills, device card) in usersdevices.css.
import './incidentreport.css'
import './usersdevices.css'

const FILTERS = ['All', 'Online', 'Offline', 'No device', 'Suspended']

// The one status shown for each user in the list.
function userState(user) {
  if (user.account === 'Suspended') return 'Suspended'
  if (!user.device) return 'No device'
  return user.device.connection
}

function pillClass(state) {
  return `ud-pill ud-pill--${state.toLowerCase().replace(/\s+/g, '-')}`
}

function needsAttention(user) {
  if (user.account === 'Suspended' || !user.device) return false
  return user.device.connection === 'Offline' || user.device.calibration === 'Needs calibration'
}

function Field({ label, value, tone }) {
  return (
    <div className="ud-field">
      <dt className="ud-field-label">{label}</dt>
      <dd className={`ud-field-value ${tone ? `ud-field-value--${tone}` : ''}`}>{value}</dd>
    </div>
  )
}

function UserDetail({ user, onToggleSuspend, onUnlinkDevice }) {
  const suspended = user.account === 'Suspended'
  const device = user.device

  function handleSuspend() {
    if (!suspended && !window.confirm(`Suspend ${user.name}'s account?`)) return
    onToggleSuspend(user.id)
  }

  function handleUnlink() {
    if (!window.confirm(`Unlink device ${device.serial} from ${user.name}?`)) return
    onUnlinkDevice(user.id)
  }

  return (
    <div className="ir-detail">
      <div className="ir-detail-head">
        <h2 className="ir-detail-title">{user.name}</h2>
        <span className={pillClass(userState(user))}>{userState(user)}</span>
      </div>

      <div className="ir-detail-meta">
        <span>{user.email}</span>
        <span>{user.phone}</span>
      </div>

      <div>
        <h3 className="ir-section-label">Driver</h3>
        <dl className="ud-grid">
          <Field label="Role" value={user.role} />
          <Field label="Vehicle" value={user.vehicle} />
          <Field label="Joined" value={user.joined} />
          <Field label="Account" value={user.account} tone={suspended ? 'bad' : 'good'} />
        </dl>
      </div>

      <div>
        <h3 className="ir-section-label">Device</h3>
        {device ? (
          <dl className="ud-grid ud-device">
            <Field label="Serial number" value={device.serial} />
            <Field label="Firmware" value={device.firmware} />
            <Field
              label="Connection"
              value={device.connection}
              tone={device.connection === 'Online' ? 'good' : 'bad'}
            />
            <Field label="Last seen" value={device.lastSeen} />
            <Field
              label="Calibration"
              value={device.calibration}
              tone={device.calibration === 'Calibrated' ? 'good' : 'warn'}
            />
            <Field label="Alerts (last 30 days)" value={device.alerts30d} />
          </dl>
        ) : (
          <p className="ud-empty-device">No device is linked to this account.</p>
        )}
      </div>

      <div className="ud-actions">
        <button
          type="button"
          className={`ud-btn ${suspended ? '' : 'ud-btn--danger'}`}
          onClick={handleSuspend}
        >
          {suspended ? 'Reactivate account' : 'Suspend account'}
        </button>
        {device && (
          <button type="button" className="ud-btn" onClick={handleUnlink}>
            Unlink device
          </button>
        )}
      </div>
    </div>
  )
}

export default function UsersDevices({ users, onToggleSuspend, onUnlinkDevice }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const query = search.trim().toLowerCase()
  const filtered = users.filter((user) => {
    const matchesFilter = filter === 'All' || userState(user) === filter
    const matchesSearch =
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.device && user.device.serial.toLowerCase().includes(query))
    return matchesFilter && matchesSearch
  })

  // If the selected user was filtered out, fall back to the first one in the list.
  const selected = filtered.find((user) => user.id === selectedId) ?? filtered[0]

  const stats = [
    { value: users.length, label: 'Total users' },
    { value: users.filter((u) => userState(u) === 'Online').length, label: 'Devices online' },
    { value: users.filter(needsAttention).length, label: 'Need attention (offline or not calibrated)' },
  ]

  const filterCount = (name) => (name === 'All' ? users.length : users.filter((u) => userState(u) === name).length)

  return (
    <>
      <header className="dash-heading">
        <h1 className="dash-title">Users &amp; Devices</h1>
        <p className="dash-subtitle">Driver accounts and the devices linked to them.</p>
      </header>

      <section className="dash-stats" aria-label="Summary">
        {stats.map((stat) => (
          <div key={stat.label} className="dash-card dash-stat ud-stat">
            <span className="dash-stat-value">{stat.value}</span>
            <span className="dash-stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      <div className="ir-filters">
        <input
          type="search"
          className="ud-search"
          placeholder="Search by name, email or device serial..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search users"
        />
        <div className="ir-chip-row" role="group" aria-label="Filter by status">
          {FILTERS.map((name) => (
            <button
              key={name}
              type="button"
              className={`ir-chip ${filter === name ? 'is-active' : ''}`}
              onClick={() => setFilter(name)}
            >
              {name} <span className="ir-chip-count">{filterCount(name)}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="ir-layout ud-layout">
        <div className="dash-card ir-list">
          {filtered.length === 0 ? (
            <p className="ir-empty">No users match your search.</p>
          ) : (
            <ul className="ir-items">
              {filtered.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    className={`ir-item ${selected && selected.id === user.id ? 'is-selected' : ''}`}
                    onClick={() => setSelectedId(user.id)}
                  >
                    <span className="ir-item-text">
                      <span className="ir-item-title">{user.name}</span>
                      <span className="ir-item-meta">
                        {user.email} · {user.device ? user.device.serial : 'No device'}
                      </span>
                    </span>
                    <span className={pillClass(userState(user))}>{userState(user)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dash-card ir-detail-card">
          {selected ? (
            <UserDetail
              key={selected.id}
              user={selected}
              onToggleSuspend={onToggleSuspend}
              onUnlinkDevice={onUnlinkDevice}
            />
          ) : (
            <p className="ir-empty">Select a user to see their details.</p>
          )}
        </div>
      </section>
    </>
  )
}