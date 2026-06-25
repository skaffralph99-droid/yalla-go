import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from './supabase'
import { Html5Qrcode } from 'html5-qrcode'

export default function App() {
  const [store, setStore] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('yg_token') || '')

  const handleLogin = (storeData, tokenVal) => {
    setStore(storeData)
    setToken(tokenVal)
    localStorage.setItem('yg_token', tokenVal)
  }

  const handleLogout = () => {
    setStore(null)
    setToken('')
    localStorage.removeItem('yg_token')
  }

  useEffect(() => {
    if (token && !store) {
      supabase.rpc('authenticate_store', { p_token: token }).then(({ data }) => {
        if (data?.success) setStore(data)
        else { localStorage.removeItem('yg_token'); setToken('') }
      })
    }
  }, [])

  if (!store) return <LoginScreen onLogin={handleLogin} />
  return <Dashboard store={store} token={token} onLogout={handleLogout} />
}

function LoginScreen({ onLogin }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase.rpc('authenticate_store', { p_token: code.trim().toLowerCase() })
    if (err) setError('Connection error. Try again.')
    else if (!data?.success) setError(data?.error || 'Invalid code')
    else onLogin(data, code.trim().toLowerCase())
    setLoading(false)
  }

  return (
    <div className="login-screen">
      <div className="login-logo">🎯</div>
      <div className="login-title">Yalla Go</div>
      <div className="login-subtitle">Store Dashboard</div>
      <input
        className="login-input"
        type="text"
        placeholder="Enter store code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        maxLength={10}
        autoFocus
        style={{ marginBottom: 16 }}
      />
      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !code.trim()}>
        {loading ? 'Checking...' : 'Enter Dashboard'}
      </button>
      {error && <div className="login-error">{error}</div>}
    </div>
  )
}

function Dashboard({ store, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('scan')
  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header-left">
          <div className="dash-header-icon">🏪</div>
          <div>
            <div className="dash-header-name">{store.store_name}</div>
            <div className="dash-header-tier">Tier {store.tier} · <span>+{store.points_per_visit} pts/visit</span></div>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </header>
      <div className="tabs">
        <button className={`tab ${activeTab === 'scan' ? 'active' : ''}`} onClick={() => setActiveTab('scan')}>
          <span className="tab-icon">📷</span>Scan
        </button>
        <button className={`tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
          <span className="tab-icon">📊</span>Stats
        </button>
        <button className={`tab ${activeTab === 'rewards' ? 'active' : ''}`} onClick={() => setActiveTab('rewards')}>
          <span className="tab-icon">🎁</span>Rewards
        </button>
      </div>
      {activeTab === 'scan' && <ScanTab token={token} store={store} />}
      {activeTab === 'stats' && <StatsTab token={token} />}
      {activeTab === 'rewards' && <RewardsTab token={token} />}
    </div>
  )
}

function ScanTab({ token, store }) {
  const [phase, setPhase] = useState('scanning')
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState('')
  const scannerRef = useRef(null)

  const startScanner = useCallback(async () => {
    if (scannerRef.current) return
    try {
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          if (!uuidRegex.test(decodedText)) return
          try { await scanner.pause(true) } catch {}
          setError('')
          const { data, error: rpcErr } = await supabase.rpc('scan_customer', {
            p_store_token: token, p_customer_id: decodedText
          })
          if (rpcErr || !data?.success) {
            setError(data?.error || rpcErr?.message || 'Scan failed')
            try { await scanner.resume() } catch {}
            return
          }
          supabase.rpc('check_friend_bonus', {
            p_user_id: decodedText, p_store_id: store.store_id, p_stamp_id: data.stamp_id
          })
          setScanResult(data)
          setPhase('preview')
        },
        () => {}
      )
    } catch { setError('Camera access denied. Please allow camera permission.') }
  }, [token, store.store_id])

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop() } catch {}
      scannerRef.current = null
    }
  }, [])

  useEffect(() => { startScanner(); return () => { stopScanner() } }, [])

  const handleConfirm = () => {
    setPhase('success')
    setTimeout(() => {
      setPhase('scanning')
      setScanResult(null)
      setError('')
      stopScanner().then(() => setTimeout(startScanner, 300))
    }, 2500)
  }

  const handleCancel = async () => {
    setPhase('scanning')
    setScanResult(null)
    setError('')
    try { await scannerRef.current?.resume() }
    catch { await stopScanner(); setTimeout(startScanner, 300) }
  }

  if (phase === 'success' && scanResult) {
    return (
      <div className="success-screen">
        <div className="success-check">✓</div>
        <div className="success-text">+{scanResult.points_earned} Points!</div>
        <div className="success-detail">
          {scanResult.customer_name} earned {scanResult.points_earned} points
          {scanResult.multiplier > 1 && ` (${scanResult.multiplier}x boost!)`}
        </div>
        {scanResult.can_redeem && (
          <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 14 }}>🎁 Reward ready to redeem!</div>
        )}
      </div>
    )
  }

  if (phase === 'preview' && scanResult) {
    return (
      <div className="scan-section">
        <div className="scan-result">
          <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
          <div className="scan-result-name">{scanResult.customer_name}</div>
          <div className="scan-result-points">
            +{scanResult.points_earned} points
            {scanResult.multiplier > 1 && (
              <span className="scan-result-multiplier">
                {scanResult.multiplier}x {scanResult.multiplier_source === 'daily_spin' ? '🎰' : '🔥'}
              </span>
            )}
          </div>
          <div className="scan-result-reward">
            {scanResult.reward_name}: <strong>{scanResult.reward_visits}/{scanResult.reward_required}</strong> visits
            {scanResult.can_redeem && ' — 🎁 READY!'}
          </div>
          <div className="scan-actions">
            <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="btn btn-confirm" onClick={handleConfirm}>✓ Confirm</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="scan-section">
      <div className="scanner-container">
        <div id="qr-reader" />
        <div className="scanner-overlay"><div className="scanner-frame" /></div>
      </div>
      <div className="scan-hint">Point camera at customer's QR code</div>
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', color: 'var(--red)', fontSize: 13, textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  )
}

function StatsTab({ token }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const fetchStats = async () => {
    setLoading(true)
    const { data } = await supabase.rpc('get_store_stats', { p_store_token: token })
    if (data?.success) setStats(data)
    setLoading(false)
  }
  useEffect(() => { fetchStats() }, [])

  if (loading) return <div className="loading"><div className="spinner" /></div>
  if (!stats) return <div className="empty-state"><div className="empty-icon">📊</div><div>Could not load stats</div></div>

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div className="stats-section">
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{stats.today_scans}</div><div className="stat-label">Today's Scans</div></div>
        <div className="stat-card"><div className="stat-value">{stats.week_scans}</div><div className="stat-label">This Week</div></div>
        <div className="stat-card gold"><div className="stat-value">{stats.unique_customers}</div><div className="stat-label">Total Customers</div></div>
        <div className="stat-card gold"><div className="stat-value">{stats.repeat_customers}</div><div className="stat-label">Repeat Customers</div></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="section-title" style={{ margin: 0 }}>Recent Scans</div>
        <button className="btn-logout" onClick={fetchStats} style={{ fontSize: 12, padding: '6px 12px' }}>↻ Refresh</button>
      </div>
      {stats.recent_scans?.length > 0 ? (
        <div className="recent-list">
          {stats.recent_scans.map((scan, i) => (
            <div key={i} className="recent-item">
              <div>
                <div className="recent-name">{scan.customer_name}</div>
                <div className="recent-time">{formatTime(scan.time)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="recent-points">+{scan.points}</div>
                {scan.multiplier > 1 && <div className="recent-mult">{scan.multiplier}x boost</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state"><div className="empty-icon">📋</div><div>No scans yet today</div></div>
      )}
    </div>
  )
}

function RewardsTab({ token }) {
  const [loading, setLoading] = useState(true)
  const [redemptions] = useState([])
  useEffect(() => { setLoading(false) }, [])

  if (loading) return <div className="loading"><div className="spinner" /></div>
  return (
    <div className="stats-section">
      <div className="section-title">Reward Redemptions</div>
      {redemptions.length > 0 ? (
        redemptions.map((r) => (
          <div key={r.id} className="redemption-item">
            <div className="redemption-info">
              <div className="redemption-name">{r.customer_name}</div>
              <div className="redemption-reward">🎁 {r.reward_name}</div>
              <div className="redemption-time">{new Date(r.redeemed_at).toLocaleDateString()}</div>
            </div>
            <button className={`btn-sm ${r.confirmed_by_store ? 'btn-sm-done' : 'btn-sm-confirm'}`}>
              {r.confirmed_by_store ? '✓ Done' : 'Confirm'}
            </button>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎁</div>
          <div>No redemptions yet</div>
          <div style={{ fontSize: 13, marginTop: 8, color: 'var(--text-muted)' }}>
            When customers redeem rewards, they'll appear here for confirmation
          </div>
        </div>
      )}
    </div>
  )
}
