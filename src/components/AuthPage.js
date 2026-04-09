// ═══════════════════════════════════════
// FSAI – AuthPage (Login + Signup)
// ═══════════════════════════════════════
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PW_RULES = [
  { key: 'len',   label: 'At least 8 characters',          test: v => v.length >= 8 },
  { key: 'upper', label: 'One uppercase letter',            test: v => /[A-Z]/.test(v) },
  { key: 'lower', label: 'One lowercase letter',            test: v => /[a-z]/.test(v) },
  { key: 'num',   label: 'At least one number',             test: v => /[0-9]/.test(v) },
  { key: 'spec',  label: 'At least one special character',  test: v => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];

function vEmail(v) {
  if (!v.trim()) return 'Please enter your email address.';
  if (!EMAIL_RE.test(v.trim())) return 'Please enter a valid email address.';
  return '';
}
function vPassword(v, mode) {
  if (!v) return 'Please enter your password.';
  if (mode === 'signup') {
    const fail = PW_RULES.find(r => !r.test(v));
    if (fail) return `Password must include: ${fail.label.toLowerCase()}.`;
  }
  return '';
}
function vConfirm(pw, cf) {
  if (!cf) return 'Please confirm your password.';
  if (pw !== cf) return 'Passwords do not match.';
  return '';
}
function pwHint(v) {
  if (!v) return 'Start with a strong password: at least 8 characters.';
  const fail = PW_RULES.find(r => !r.test(v));
  return fail ? `Next: ${fail.label}.` : '✓ Password meets all requirements!';
}

const CSS = `
  @keyframes authIn  { from{opacity:0;transform:translateY(22px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes authSpin{ to{transform:rotate(360deg)} }
  @keyframes orbPulse{ 0%,100%{box-shadow:0 0 20px rgba(0,210,255,.35)} 50%{box-shadow:0 0 42px rgba(0,210,255,.6)} }
  .fsai-inp { width:100%; padding:11px 14px; background:rgba(30,37,56,.7); border:1px solid rgba(100,150,255,.18);
    border-radius:10px; color:#f0f4ff; font-family:'JetBrains Mono',monospace; font-size:13px; outline:none;
    box-sizing:border-box; transition:border-color .2s,box-shadow .2s; }
  .fsai-inp::placeholder { color:#4b5573; font-family:'Space Grotesk',sans-serif; font-size:13px; }
  .fsai-inp:focus  { border-color:rgba(0,210,255,.5)!important; box-shadow:0 0 0 3px rgba(0,210,255,.08); background:rgba(20,26,40,.85); }
  .fsai-inp.err    { border-color:rgba(255,95,95,.8)!important; box-shadow:0 0 0 3px rgba(255,95,95,.1); }
  .fsai-tab        { flex:1; padding:8px 0; border:none; border-radius:8px; cursor:pointer; font-family:'Syne',sans-serif;
    font-size:12px; font-weight:800; letter-spacing:1px; text-transform:uppercase; transition:all .22s; }
  .fsai-tab:hover:not(.active) { background:rgba(255,255,255,.04)!important; color:#b8c4d8!important; }
  .fsai-sub        { transition:all .22s; }
  .fsai-sub:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,210,255,.35)!important; }
  .fsai-switch-btn { background:none; border:none; color:#00d2ff; font-size:13px; font-weight:700;
    cursor:pointer; font-family:'Space Grotesk',sans-serif; padding:0; transition:opacity .2s; }
  .fsai-switch-btn:hover { opacity:.75; text-decoration:underline; }
`;

export default function AuthPage() {
  const { login, signup }           = useAuth();
  const [mode, setMode]             = useState('login');
  const [form, setForm]             = useState({ name:'', email:'', password:'', confirm:'' });
  const [errs, setErrs]             = useState({});
  const [apiErr, setApiErr]         = useState('');
  const [loading, setLoading]       = useState(false);

  const handle = field => e => {
    const val = e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    setApiErr('');
    setErrs(prev => ({
      ...prev,
      [field]:
        field === 'email'    ? vEmail(val) :
        field === 'password' ? vPassword(val, mode) :
        field === 'confirm'  ? vConfirm(form.password, val) :
        field === 'name'     ? (val.trim() ? '' : 'Please enter your full name.') :
        prev[field],
    }));
    if (field === 'password' && mode === 'signup')
      setErrs(prev => ({ ...prev, confirm: vConfirm(val, form.confirm) }));
  };

  const submit = async e => {
    e.preventDefault();
    setApiErr('');
    const newErrs = {
      ...(mode === 'signup' ? { name: form.name.trim() ? '' : 'Please enter your full name.' } : {}),
      email:    vEmail(form.email),
      password: vPassword(form.password, mode),
      ...(mode === 'signup' ? { confirm: vConfirm(form.password, form.confirm) } : {}),
    };
    if (Object.values(newErrs).some(Boolean)) { setErrs(newErrs); return; }
    setLoading(true);
    try {
      if (mode === 'signup') await signup({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      else                   await login({ email: form.email.trim(), password: form.password });
    } catch (err) { setApiErr(err.message); }
    finally { setLoading(false); }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setForm({ name:'', email:'', password:'', confirm:'' });
    setErrs({}); setApiErr('');
  };

  return (
    <div style={{
      minHeight:'100vh', minHeight:'100dvh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'#0a0e1a',
      padding:'20px', boxSizing:'border-box', position:'relative', overflow:'hidden',
    }}>
      <style>{CSS}</style>

      {/* Animated background */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:
            'linear-gradient(rgba(0,210,255,.025) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(0,210,255,.025) 1px,transparent 1px)',
          backgroundSize:'48px 48px',
        }} />
        <div style={{ position:'absolute', width:600, height:400, top:-100, left:'50%', transform:'translateX(-50%)',
          background:'radial-gradient(ellipse,rgba(124,58,237,.12) 0%,transparent 70%)',
          borderRadius:'50%', filter:'blur(80px)' }} />
        <div style={{ position:'absolute', width:350, height:350, bottom:-50, left:-50,
          background:'radial-gradient(ellipse,rgba(0,210,255,.08) 0%,transparent 70%)',
          borderRadius:'50%', filter:'blur(80px)' }} />
        <div style={{ position:'absolute', width:300, height:300, top:'20%', right:-50,
          background:'radial-gradient(ellipse,rgba(249,115,22,.07) 0%,transparent 70%)',
          borderRadius:'50%', filter:'blur(80px)' }} />
      </div>

      {/* Card */}
      <div style={{
        position:'relative', zIndex:1, width:'100%', maxWidth:420,
        background:'rgba(20,26,40,.92)', border:'1px solid rgba(100,150,255,.18)',
        borderRadius:20, padding:'36px 36px 28px',
        backdropFilter:'blur(24px)',
        boxShadow:'0 0 0 1px rgba(0,210,255,.06),0 24px 64px rgba(0,0,0,.5),0 0 80px rgba(124,58,237,.08)',
        animation:'authIn .5s cubic-bezier(.16,1,.3,1)',
        boxSizing:'border-box',
      }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28, justifyContent:'center' }}>
          <div style={{
            width:46, height:46, borderRadius:12,
            background:'linear-gradient(135deg,#7c3aed,#00d2ff)',
            display:'flex', alignItems:'center', justifyContent:'center',
            animation:'orbPulse 3s ease-in-out infinite', flexShrink:0,
          }}>
            <span style={{ fontSize:24, color:'#fff', lineHeight:1, filter:'drop-shadow(0 0 6px rgba(255,255,255,.5))' }}>⬡</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            <span style={{
              fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:900,
              color:'#00d2ff', letterSpacing:4, textShadow:'0 0 20px rgba(0,210,255,.4)', lineHeight:1,
            }}>FSAI</span>
            <span style={{
              fontFamily:"'Syne',sans-serif", fontSize:9, fontWeight:700,
              color:'#b8c4d8', letterSpacing:1.5, textTransform:'uppercase', whiteSpace:'nowrap',
            }}>Full-Stack Debug Agent</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display:'flex', background:'rgba(30,37,56,.7)', border:'1px solid rgba(100,150,255,.18)',
          borderRadius:10, padding:3, marginBottom:24,
        }}>
          {['login','signup'].map(m => (
            <button key={m} className={`fsai-tab${mode===m?' active':''}`} onClick={() => mode !== m && switchMode()}
              type="button"
              style={{
                background: mode===m ? 'linear-gradient(135deg,rgba(124,58,237,.5),rgba(0,210,255,.3))' : 'transparent',
                color: mode===m ? '#f0f4ff' : '#7a8aaa',
                boxShadow: mode===m ? '0 2px 8px rgba(0,210,255,.15)' : 'none',
              }}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} noValidate style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {mode === 'signup' && (
            <Field label="Full Name" error={errs.name}>
              <input className={`fsai-inp${errs.name?' err':''}`} type="text"
                placeholder="John Doe" value={form.name} onChange={handle('name')} autoComplete="name" />
            </Field>
          )}
          <Field label="Email Address" error={errs.email}>
            <input className={`fsai-inp${errs.email?' err':''}`} type="email"
              placeholder="you@example.com" value={form.email} onChange={handle('email')} autoComplete="email" />
          </Field>
          <Field label="Password" error={errs.password} hint={mode==='signup' ? pwHint(form.password) : null}>
            <input className={`fsai-inp${errs.password?' err':''}`} type="password"
              placeholder={mode==='signup' ? 'Strong password required' : 'Enter password'}
              value={form.password} onChange={handle('password')}
              autoComplete={mode==='login' ? 'current-password' : 'new-password'} />
          </Field>
          {mode === 'signup' && (
            <Field label="Confirm Password" error={errs.confirm}>
              <input className={`fsai-inp${errs.confirm?' err':''}`} type="password"
                placeholder="Re-enter password" value={form.confirm} onChange={handle('confirm')} autoComplete="new-password" />
            </Field>
          )}

          {apiErr && (
            <div style={{
              display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
              background:'rgba(255,95,95,.14)', border:'1px solid rgba(255,95,95,.3)',
              borderRadius:10, color:'#ff5f5f',
              fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:600,
            }}>
              <span>⚠</span> {apiErr}
            </div>
          )}

          <button type="submit" className="fsai-sub" disabled={loading} style={{
            width:'100%', padding:'13px', border:'none', borderRadius:10,
            cursor: loading ? 'not-allowed' : 'pointer',
            background:'linear-gradient(135deg,#7c3aed,#00d2ff)', color:'#fff',
            fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800,
            letterSpacing:1.5, textTransform:'uppercase',
            opacity: loading ? 0.65 : 1,
            boxShadow:'0 4px 20px rgba(0,210,255,.25)',
            display:'flex', alignItems:'center', justifyContent:'center',
            minHeight:48, marginTop:4, boxSizing:'border-box',
          }}>
            {loading
              ? <span style={{ display:'block', width:18, height:18, border:'2px solid rgba(255,255,255,.3)',
                  borderTopColor:'#fff', borderRadius:'50%', animation:'authSpin .7s linear infinite' }} />
              : <span>{mode === 'login' ? 'Sign In →' : 'Create Account →'}</span>
            }
          </button>
        </form>

        {/* Footer switch */}
        <p style={{ marginTop:18, textAlign:'center', fontFamily:"'Space Grotesk',sans-serif", fontSize:13, color:'#b8c4d8' }}>
          {mode==='login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button className="fsai-switch-btn" onClick={switchMode} type="button">
            {mode==='login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
        <p style={{ marginTop:10, textAlign:'center', fontFamily:"'Syne',sans-serif",
          fontSize:9.5, fontWeight:700, color:'#4b5573', letterSpacing:1, textTransform:'uppercase' }}>
          Authorized to G7
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, hint, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:800,
        color:'#b8c4d8', letterSpacing:1.5, textTransform:'uppercase' }}>{label}</label>
      {children}
      {hint && !error && (
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:'#00d2ff',
          background:'rgba(0,210,255,.06)', border:'1px solid rgba(0,210,255,.12)',
          borderRadius:8, padding:'8px 12px' }}>{hint}</div>
      )}
      {error && <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:'#ff5f5f', fontWeight:600 }}>{error}</div>}
    </div>
  );
}