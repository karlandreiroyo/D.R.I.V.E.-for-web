import { useState, useMemo } from 'react'

// Simple SVG Icons for the password toggle
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const INITIAL_ADMINS = [
  { id: 1, name: 'Janelle Obien', role: 'Admin', email: 'janelle@gmail.com', phone: '+63 912 345 6789' },
  { id: 2, name: 'Karl Royo', role: 'Admin', email: 'karl@outlook.com', phone: '+63 998 765 4321' },
  { id: 3, name: 'Sebastian Caalim', role: 'Admin', email: 'sebastian@gmail.com', phone: '+63 917 111 2222' },
  { id: 4, name: 'Clarissa Arzadon', role: 'Admin', email: 'clarissa@yahoo.com', phone: '+63 919 999 8888' }
];

export default function AdminsRoles({ triggerToast }) {
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+63 ');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null); // Tracks who is being viewed

  // Automatically sorts the admin list alphabetically by name
  const sortedAdmins = useMemo(() => {
    return [...admins].sort((a, b) => a.name.localeCompare(b.name));
  }, [admins]);

  // Live Validations
  let nameError = '';
  if (newName && !/^[a-zA-Z\sñÑ]*$/.test(newName)) {
    nameError = 'Only letters and spaces allowed';
  }

  let emailError = '';
  if (newEmail) {
    const emailDomain = newEmail.split('@')[1]?.toLowerCase();
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    if (!newEmail.includes('@') || !allowedDomains.includes(emailDomain)) {
      emailError = 'Must be @gmail.com, @yahoo.com, or @outlook.com';
    }
  }

  let phoneError = '';
  const cleanPhone = newPhone.trim();
  if (cleanPhone !== '+63' && cleanPhone !== '+63 ') {
    const phoneDigits = newPhone.replace(/\D/g, ''); 
    if (phoneDigits.length !== 12) {
      phoneError = 'Must be exactly 10 digits';
    }
  }

  const passwordErrors = [];
  if (newPassword && newPassword.length < 8) passwordErrors.push('8+ characters');
  if (newPassword && !/[A-Z]/.test(newPassword)) passwordErrors.push('1 uppercase');
  if (newPassword && !/[0-9]/.test(newPassword)) passwordErrors.push('1 number');
  if (newPassword && !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) passwordErrors.push('1 special char');

  function handlePhoneChange(e) {
    const val = e.target.value;
    // Ensure the user cannot delete the +63 prefix
    if (!val.startsWith('+63')) {
      setNewPhone('+63 ');
    } else {
      setNewPhone(val);
    }
  }

  function handleCreate() {
    if (!newName.trim() || !newEmail.trim() || !newPassword || !confirmPassword) {
      triggerToast('Please fill out all required fields (*).');
      return;
    }

    if (nameError) {
      triggerToast('Please enter a valid name without numbers or special characters.');
      return;
    }

    if (emailError) {
      triggerToast('Please enter a valid email address.');
      return;
    }

    if (phoneError) {
      triggerToast('Please enter a valid phone number.');
      return;
    }

    if (passwordErrors.length > 0) {
      triggerToast('Please meet all password requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      triggerToast('Passwords do not match.');
      return;
    }
    
    // Add the new admin to the table, including their contact info for the modal
    const newAdmin = {
      id: Date.now(),
      name: newName,
      role: 'Admin',
      email: newEmail,
      phone: newPhone === '+63 ' ? '' : newPhone // Don't save empty prefix
    };
    
    setAdmins([...admins, newAdmin]);
    
    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewPhone('+63 ');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirm(false);
    triggerToast('Admin account created successfully!');
  }

  // Shared style for the eye icon button
  const toggleBtnStyle = {
    position: 'absolute', 
    right: '12px', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    color: 'var(--muted)', 
    padding: '4px', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <>
      <h1>Admins</h1>
      <p className="sub">Manage the admin team.</p>
      
      {/* Create Admin Form */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
          Create admin account
        </h3>
        
        <div className="grid g2" style={{ gap: '16px', marginBottom: '20px' }}>
          {/* Row 1 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '0 0 6px 4px' }}>
              <div className="lbl" style={{ margin: 0 }}>Full Name *</div>
              {nameError && (
                <div style={{ color: 'var(--bad)', fontSize: '11px', fontWeight: '500', lineHeight: '1.3' }}>
                  {nameError}
                </div>
              )}
            </div>
            <input 
              style={{ width: '100%', margin: 0, borderColor: nameError ? 'var(--bad)' : 'var(--line)' }}
              placeholder="e.g. Juan Dela Cruz" 
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '0 0 6px 4px' }}>
              <div className="lbl" style={{ margin: 0 }}>Email Address *</div>
              {emailError && (
                <div style={{ color: 'var(--bad)', fontSize: '11px', fontWeight: '500', lineHeight: '1.3' }}>
                  {emailError}
                </div>
              )}
            </div>
            <input 
              style={{ width: '100%', margin: 0, borderColor: emailError ? 'var(--bad)' : 'var(--line)' }}
              type="email"
              placeholder="e.g. juan@gmail.com" 
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
            />
          </div>

          {/* Row 2 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '0 0 6px 4px' }}>
              <div className="lbl" style={{ margin: 0 }}>Phone Number</div>
              {phoneError && (
                <div style={{ color: 'var(--bad)', fontSize: '11px', fontWeight: '500', lineHeight: '1.3' }}>
                  {phoneError}
                </div>
              )}
            </div>
            <input 
              style={{ width: '100%', margin: 0, borderColor: phoneError ? 'var(--bad)' : 'var(--line)' }}
              type="tel"
              placeholder="+63 912 345 6789" 
              value={newPhone}
              onChange={handlePhoneChange}
            />
          </div>
          <div className="sm mut" style={{ display: 'flex', alignItems: 'center', paddingLeft: '4px' }}>
            {/* Empty block to keep the grid perfectly aligned */}
          </div>

          {/* Row 3 - Passwords */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '0 0 2px 4px' }}>
              <div className="lbl" style={{ margin: 0 }}>Password *</div>
              {newPassword && passwordErrors.length > 0 && (
                <div style={{ color: 'var(--bad)', fontSize: '11px', fontWeight: '500', lineHeight: '1.3', textAlign: 'right' }}>
                  Password should contain: {passwordErrors.join(', ')}
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                style={{ width: '100%', margin: 0, paddingRight: '40px', borderColor: newPassword && passwordErrors.length > 0 ? 'var(--bad)' : 'var(--line)' }}
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <button type="button" style={toggleBtnStyle} onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div className="lbl" style={{ margin: '0 0 6px 4px' }}>Confirm Password *</div>
            <div style={{ position: 'relative' }}>
              <input 
                style={{ width: '100%', margin: 0, paddingRight: '40px' }}
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <button type="button" style={toggleBtnStyle} onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle confirm password visibility">
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
          <button className="btn" onClick={handleCreate}>
            Create admin account
          </button>
        </div>
      </div>
      
      {/* Admins Table */}
      <div className="card scroll">
        <table>
          <thead>
            <tr>
              <th>Admin Name</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedAdmins.map(a => (
              <tr key={a.id} className="row">
                <td><b>{a.name}</b></td>
                <td className="mut">{a.role}</td>
                <td>
                  <button 
                    className="btn ghost" 
                    style={{ padding: '6px 12px' }}
                    onClick={() => setSelectedAdmin(a)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Details Modal */}
      {selectedAdmin && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
              Admin Details
            </h3>
            
            <div style={{ marginBottom: '12px' }}>
              <div className="lbl" style={{ margin: '0 0 4px 4px' }}>Full Name</div>
              <div className="fld" style={{ margin: 0, padding: '10px 12px' }}>{selectedAdmin.name}</div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div className="lbl" style={{ margin: '0 0 4px 4px' }}>Email Address</div>
              <div className="fld" style={{ margin: 0, padding: '10px 12px' }}>{selectedAdmin.email || 'N/A'}</div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div className="lbl" style={{ margin: '0 0 4px 4px' }}>Phone Number</div>
              <div className="fld" style={{ margin: 0, padding: '10px 12px' }}>{selectedAdmin.phone || 'N/A'}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setSelectedAdmin(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}