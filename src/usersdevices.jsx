import { Badge } from './dashboard.jsx'

export default function UsersDevices({ users }) {
  return (
    <>
      <h1>Users & devices</h1>
      <p className="sub">Accounts and linked D.R.I.V.E. units, to help with their reports.</p>
      
      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Device</th>
              <th>Hardware</th>
              <th>Firmware</th>
              <th>Alerts (30d)</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const connected = u.device?.connection === 'Online';
              return (
                <tr key={u.id} className="row">
                  <td><b>{u.name}</b></td>
                  <td>{u.device?.serial || 'No device'}</td>
                  <td><Badge text={connected ? 'Connected' : 'Not connected'} type={connected ? 'ok' : 'mut'} /></td>
                  <td>{u.device?.firmware || 'N/A'} {u.device?.firmware === 'v1.1.4' && <Badge text="Update due" type="warn" />}</td>
                  <td>{u.device?.alerts30d ?? 0}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mut sm" style={{ marginTop: '12px' }}>Camera footage is processed on the device. Admins never see it.</p>
    </>
  )
}