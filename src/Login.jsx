import { useState } from 'react'
import './Login.css'

// Prototype credentials only. Replace with a real backend check later.
const VALID_USERNAME = 'karl'
const VALID_PASSWORD = 'karl23'

function BrandMark() {
  return (
    <div className="brand" aria-label="D.R.I.V.E.">
      <span className="brand-icon-shell">
        <img src="/project-logo.png" alt="" className="brand-icon" />
      </span>
      <span className="brand-name">D.R.I.V.E.</span>
    </div>
  )
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" className="eye-icon" aria-hidden="true">
      <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.1 0 8.5 5.1 8.5 7a8.3 8.3 0 0 1-2.4 3.7M6.2 6.3C3.9 7.8 2.5 10.4 2.5 12c0 1.9 3.4 7 9.5 7 1.1 0 2.1-.2 3-.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="eye-icon" aria-hidden="true">
      <path d="M2.5 12s3.4-7 9.5-7 9.5 7 9.5 7-3.4 7-9.5 7-9.5-7-9.5-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function GoogleMark() {
  return <span className="google-mark" aria-label="Google">G</span>
}

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const username = String(form.get('email') || '').trim().toLowerCase()
    const password = String(form.get('password') || '')

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setError('')
      setNotice('')
      onLogin(username)
    } else {
      setNotice('')
      setError('Incorrect username or password. Please try again.')
    }
  }

  function showNotice(message) {
    setError('')
    setNotice(message)
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="story-panel">
          <div className="story-overlay" />
          <BrandMark />
          <div className="story-copy">
            <h1 className="story-title">Your Guardian<br />on the Road.</h1>
            <p className="story-description">
              Review what drivers report, ask for and need help with, so every journey stays safer.
            </p>
            <ul className="story-features">
              <li>Smart fatigue tracking</li>
              <li>Instant physical alerts</li>
              <li>Your privacy is protected</li>
            </ul>
          </div>
        </section>

        <section className="login-panel" aria-labelledby="login-heading">
          <div className="login-content">
            <header className="login-heading">
              <h2 id="login-heading" className="login-title">Welcome back.</h2>
              <p className="login-subtitle">Let&apos;s keep drivers safe today. Enter your details to continue.</p>
            </header>

            <form onSubmit={handleSubmit} className="login-form">
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                placeholder="Enter Email or Phone"
                aria-label="Email or phone"
                required
                className="text-input"
              />
              <div className="password-control">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter Password"
                  aria-label="Password"
                  required
                  className="text-input password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="password-toggle"
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => showNotice('Password recovery is not connected yet. Please contact your administrator.')}
                className="forgot-link"
              >
                Forgot Password
              </button>
              <button type="submit" className="submit-button">Login</button>
              {error && <p role="alert" className="form-error">{error}</p>}
              {notice && <p role="status" className="form-notice">{notice}</p>}
            </form>

            <div className="signup-divider">
              <span className="divider-rule" />
              <span className="divider-label">or continue with</span>
              <span className="divider-rule" />
            </div>
            <button
              type="button"
              className="google-button"
              aria-label="Continue with Google"
              onClick={() => showNotice('Google sign-in is not connected yet.')}
            >
              <GoogleMark />
            </button>
            <p className="signup-prompt">
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => showNotice('Contact your administrator to create an account.')}>Sign up</button>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}