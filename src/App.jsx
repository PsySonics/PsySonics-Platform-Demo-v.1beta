
import { useState, useEffect } from "react";

/* ── Google Fonts ── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  `}</style>
);

/* ── Design tokens ── */
const T = {
  bg:       '#0a0c0b', bg1:'#0f1210', bg2:'#141918', bg3:'#1c2220',
  surface:  '#1e2522', surface2:'#252d2a',
  teal:     '#2dd4b0', tealDark:'#0d4a3f', tealGlow:'rgba(45,212,176,0.15)',
  gold:     '#c9a96e', goldPale:'rgba(201,169,110,0.12)',
  red:      '#c06060',
  white:    '#f0f4f2',
  w70:'rgba(240,244,242,0.7)', w50:'rgba(240,244,242,0.5)',
  w40:'rgba(240,244,242,0.4)', w30:'rgba(240,244,242,0.3)',
  w20:'rgba(240,244,242,0.2)', w10:'rgba(240,244,242,0.1)', w05:'rgba(240,244,242,0.05)',
  border:'rgba(255,255,255,0.07)', border2:'rgba(255,255,255,0.12)',
  mono:"'JetBrains Mono',monospace", serif:"'Instrument Serif',serif", sans:"'Syne',sans-serif",
};

/* ── Data ── */
const ALL_PATIENTS = [
  { id:1,  initials:'A.R.', name:'Patient A.R.', compound:'Ketamine',   protocol:'KETAMINE-90',    status:'active',   joined:'Jan 2024', sessions:7,  nextDate:'Today 2:00 PM',  lastDate:'May 30',  portal:true,  diagnosis:'Depression / Anxiety',   clinician:'Dr. S. Mitchell' },
  { id:2,  initials:'M.T.', name:'Patient M.T.', compound:'Psilocybin', protocol:'PSILOCYBIN-360', status:'active',   joined:'Mar 2024', sessions:3,  nextDate:'Today 2:30 PM',  lastDate:'May 22',  portal:true,  diagnosis:'Treatment-Resistant MDD', clinician:'Dr. S. Mitchell' },
  { id:3,  initials:'D.K.', name:'Patient D.K.', compound:'MDMA',       protocol:'MDMA-PTSD-240',  status:'active',   joined:'Feb 2024', sessions:5,  nextDate:'Today 4:00 PM',  lastDate:'May 18',  portal:false, diagnosis:'PTSD',                    clinician:'Dr. S. Mitchell' },
  { id:4,  initials:'S.L.', name:'Patient S.L.', compound:'Ketamine',   protocol:'KETAMINE-60',    status:'active',   joined:'Nov 2023', sessions:12, nextDate:'Jun 10',         lastDate:'Today',   portal:true,  diagnosis:'OCD / Anxiety',           clinician:'Dr. S. Mitchell' },
  { id:5,  initials:'J.W.', name:'Patient J.W.', compound:'Psilocybin', protocol:'PSILOCYBIN-360', status:'active',   joined:'Apr 2024', sessions:2,  nextDate:'Jun 13',         lastDate:'Today',   portal:true,  diagnosis:'End-of-life anxiety',     clinician:'Dr. S. Mitchell' },
  { id:6,  initials:'R.B.', name:'Patient R.B.', compound:'Ketamine',   protocol:'KETAMINE-90',    status:'upcoming', joined:'May 2024', sessions:0,  nextDate:'Jun 9',          lastDate:'—',       portal:false, diagnosis:'TBD — intake pending',    clinician:'Dr. S. Mitchell' },
  { id:7,  initials:'C.H.', name:'Patient C.H.', compound:'MDMA',       protocol:'MDMA-PTSD-240',  status:'upcoming', joined:'May 2024', sessions:0,  nextDate:'Jun 12',         lastDate:'—',       portal:false, diagnosis:'Combat PTSD',             clinician:'Dr. S. Mitchell' },
  { id:8,  initials:'T.N.', name:'Patient T.N.', compound:'Psilocybin', protocol:'PSILOCYBIN-360', status:'prior',    joined:'Aug 2023', sessions:8,  nextDate:'—',              lastDate:'Mar 15',  portal:true,  diagnosis:'Depression',              clinician:'Dr. S. Mitchell' },
  { id:9,  initials:'E.V.', name:'Patient E.V.', compound:'Ketamine',   protocol:'KETAMINE-60',    status:'prior',    joined:'Sep 2023', sessions:6,  nextDate:'—',              lastDate:'Feb 28',  portal:false, diagnosis:'Chronic pain / MDD',      clinician:'Dr. S. Mitchell' },
  { id:10, initials:'P.O.', name:'Patient P.O.', compound:'MDMA',       protocol:'MDMA-PTSD-240',  status:'prior',    joined:'Jul 2023', sessions:10, nextDate:'—',              lastDate:'Jan 10',  portal:true,  diagnosis:'PTSD — veteran',          clinician:'Dr. S. Mitchell' },
];

const ALL_SESSIONS = [
  // Live
  { id:1,  patient:'Patient A.R.', initials:'A.R.', compound:'Ketamine',   protocol:'KETAMINE-90',    room:'Room 2', status:'live',      date:'Today',    time:'1:00 PM',  duration:'90 min',  elapsed:'01:14:33', soundframe:'Dissociative Grounding Arc',   clinician:'Dr. S. Mitchell' },
  // Upcoming today
  { id:2,  patient:'Patient M.T.', initials:'M.T.', compound:'Psilocybin', protocol:'PSILOCYBIN-360', room:'Room 1', status:'scheduled', date:'Today',    time:'2:30 PM',  duration:'360 min', elapsed:null,       soundframe:'Full-Spectrum Journey Arc',    clinician:'Dr. S. Mitchell' },
  { id:3,  patient:'Patient D.K.', initials:'D.K.', compound:'MDMA',       protocol:'MDMA-PTSD-240',  room:'Room 3', status:'scheduled', date:'Today',    time:'4:00 PM',  duration:'240 min', elapsed:null,       soundframe:'Trauma-Informed MAPS Arc',     clinician:'Dr. S. Mitchell' },
  // Completed today
  { id:4,  patient:'Patient S.L.', initials:'S.L.', compound:'Ketamine',   protocol:'KETAMINE-60',    room:'Room 1', status:'complete',  date:'Today',    time:'9:00 AM',  duration:'60 min',  elapsed:null,       soundframe:'Short Induction Arc',          clinician:'Dr. S. Mitchell' },
  { id:5,  patient:'Patient J.W.', initials:'J.W.', compound:'Psilocybin', protocol:'PSILOCYBIN-360', room:'Room 2', status:'complete',  date:'Today',    time:'11:00 AM', duration:'360 min', elapsed:null,       soundframe:'Full-Spectrum Journey Arc',    clinician:'Dr. S. Mitchell' },
  // Upcoming future
  { id:6,  patient:'Patient R.B.', initials:'R.B.', compound:'Ketamine',   protocol:'KETAMINE-90',    room:'Room 2', status:'scheduled', date:'Jun 9',    time:'10:00 AM', duration:'90 min',  elapsed:null,       soundframe:'Dissociative Grounding Arc',   clinician:'Dr. S. Mitchell' },
  { id:7,  patient:'Patient C.H.', initials:'C.H.', compound:'MDMA',       protocol:'MDMA-PTSD-240',  room:'Room 1', status:'scheduled', date:'Jun 10',   time:'1:00 PM',  duration:'240 min', elapsed:null,       soundframe:'Trauma-Informed MAPS Arc',     clinician:'Dr. S. Mitchell' },
  { id:8,  patient:'Patient S.L.', initials:'S.L.', compound:'Ketamine',   protocol:'KETAMINE-90',    room:'Room 3', status:'scheduled', date:'Jun 10',   time:'3:00 PM',  duration:'90 min',  elapsed:null,       soundframe:'Dissociative Grounding Arc',   clinician:'Dr. S. Mitchell' },
  { id:9,  patient:'Patient A.R.', initials:'A.R.', compound:'Ketamine',   protocol:'KETAMINE-90',    room:'Room 2', status:'scheduled', date:'Jun 12',   time:'2:00 PM',  duration:'90 min',  elapsed:null,       soundframe:'Dissociative Grounding Arc',   clinician:'Dr. S. Mitchell' },
  { id:10, patient:'Patient M.T.', initials:'M.T.', compound:'Psilocybin', protocol:'PSILOCYBIN-360', room:'Room 1', status:'scheduled', date:'Jun 13',   time:'9:00 AM',  duration:'360 min', elapsed:null,       soundframe:'Full-Spectrum Journey Arc',    clinician:'Dr. S. Mitchell' },
  // Past
  { id:11, patient:'Patient A.R.', initials:'A.R.', compound:'Ketamine',   protocol:'KETAMINE-90',    room:'Room 2', status:'complete',  date:'May 30',   time:'2:00 PM',  duration:'90 min',  elapsed:null,       soundframe:'Dissociative Grounding Arc',   clinician:'Dr. S. Mitchell' },
  { id:12, patient:'Patient D.K.', initials:'D.K.', compound:'MDMA',       protocol:'MDMA-PTSD-240',  room:'Room 3', status:'complete',  date:'May 28',   time:'10:00 AM', duration:'240 min', elapsed:null,       soundframe:'Trauma-Informed MAPS Arc',     clinician:'Dr. S. Mitchell' },
  { id:13, patient:'Patient M.T.', initials:'M.T.', compound:'Psilocybin', protocol:'PSILOCYBIN-360', room:'Room 1', status:'complete',  date:'May 22',   time:'9:00 AM',  duration:'360 min', elapsed:null,       soundframe:'Full-Spectrum Journey Arc',    clinician:'Dr. S. Mitchell' },
  { id:14, patient:'Patient T.N.', initials:'T.N.', compound:'Psilocybin', protocol:'PSILOCYBIN-360', room:'Room 2', status:'complete',  date:'Mar 15',   time:'1:00 PM',  duration:'360 min', elapsed:null,       soundframe:'Full-Spectrum Journey Arc',    clinician:'Dr. S. Mitchell' },
  { id:15, patient:'Patient E.V.', initials:'E.V.', compound:'Ketamine',   protocol:'KETAMINE-60',    room:'Room 1', status:'complete',  date:'Feb 28',   time:'11:00 AM', duration:'60 min',  elapsed:null,       soundframe:'Short Induction Arc',          clinician:'Dr. S. Mitchell' },
  { id:16, patient:'Patient P.O.', initials:'P.O.', compound:'MDMA',       protocol:'MDMA-PTSD-240',  room:'Room 3', status:'complete',  date:'Jan 10',   time:'2:00 PM',  duration:'240 min', elapsed:null,       soundframe:'Trauma-Informed MAPS Arc',     clinician:'Dr. S. Mitchell' },
];

const PROTOCOLS = [
  { id:'k90',  compound:'ketamine',    label:'KETAMINE',    name:'Dissociative Grounding Arc',   duration:'90 min',  phases:2, icon:'🌊', color:T.teal, colorGlow:'rgba(45,212,176,0.15)',  colorBorder:'rgba(45,212,176,0.2)' },
  { id:'p360', compound:'psilocybin',  label:'PSILOCYBIN',  name:'Full-Spectrum Journey Arc',    duration:'360 min', phases:3, icon:'✦', color:T.gold, colorGlow:'rgba(201,169,110,0.12)', colorBorder:'rgba(201,169,110,0.2)' },
  { id:'m240', compound:'mdma',        label:'MDMA / PTSD', name:'Trauma-Informed MAPS Arc',     duration:'240 min', phases:4, icon:'◎', color:T.red,  colorGlow:'rgba(192,96,96,0.12)',   colorBorder:'rgba(192,96,96,0.2)'   },
  { id:'k60',  compound:'ketamine',    label:'KETAMINE',    name:'Short Induction Arc',          duration:'60 min',  phases:2, icon:'🌊', color:T.teal, colorGlow:'rgba(45,212,176,0.15)',  colorBorder:'rgba(45,212,176,0.2)' },
];

const PORTAL_TRACKS = [
  { id:1, icon:'🌊', name:'Ketamine Integration — Short', sub:'Post-session grounding', duration:'20 min', locked:false },
  { id:2, icon:'◌',  name:'Gentle Return',                sub:'Integration · Home use', duration:'15 min', locked:false },
  { id:3, icon:'✦',  name:'Deep Rest Soundframe',         sub:'Sleep support',          duration:'30 min', locked:false },
  { id:4, icon:'◎',  name:'MDMA Integration Arc',         sub:'PTSD follow-up',         duration:'25 min', locked:true  },
];

/* ── Shared helpers ── */
const Badge = ({ children, color=T.teal }) => (
  <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:20,
    fontFamily:T.sans, fontSize:9, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
    color, background:`${color}22`, border:`1px solid ${color}40` }}>{children}</span>
);

const Dot = ({ color=T.teal, pulse }) => (
  <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', flexShrink:0,
    background:color, boxShadow:pulse?`0 0 6px ${color}`:'none',
    animation:pulse?'psyPulse 1.5s ease-in-out infinite':'none' }} />
);

const MonoVal = ({ children, size=22, color=T.white }) => (
  <span style={{ fontFamily:T.mono, fontSize:size, fontWeight:500, color, lineHeight:1 }}>{children}</span>
);

const compoundColor = (c='') => {
  const lc = c.toLowerCase();
  if (lc.includes('ketamine'))   return T.teal;
  if (lc.includes('psilocybin')) return T.gold;
  if (lc.includes('mdma'))       return T.red;
  return T.w40;
};

/* ── Animated waveform ── */
const Waveform = ({ color=T.teal, count=40, playing=false, height=28 }) => {
  const [bars] = useState(() => Array.from({length:count},(_,i)=>{
    const hs=[6,10,14,20,16,10,14,18,22,16,10,14,18,14,10,8,14,20,16,12,8,12,18,22,18,12,8,14,18,14,10,6,10,16,20,16,10,8,12,16];
    return hs[i%hs.length];
  }));
  const [tick,setTick]=useState(0);
  useEffect(()=>{ if(!playing)return; const id=setInterval(()=>setTick(t=>t+1),80); return()=>clearInterval(id); },[playing]);
  return (
    <div style={{display:'flex',alignItems:'center',gap:2,height}}>
      {bars.map((h,i)=>(
        <span key={i} style={{ display:'block', width:2.5, borderRadius:2,
          height:playing?Math.max(3,h*(0.5+0.5*Math.abs(Math.sin((i+tick*0.3)*0.4)))):h,
          background:color, opacity:playing?(i<count*0.4?1:0.35):(i<count*0.4?0.9:0.25),
          transition:playing?'height 0.08s ease':'none', flexShrink:0 }} />
      ))}
    </div>
  );
};

const useTimer = (initial='01:14:33', running=true) => {
  const [secs,setSecs]=useState(()=>{ const[h,m,s]=initial.split(':').map(Number); return h*3600+m*60+s; });
  useEffect(()=>{ if(!running)return; const id=setInterval(()=>setSecs(s=>s+1),1000); return()=>clearInterval(id); },[running]);
  const h=String(Math.floor(secs/3600)).padStart(2,'0');
  const m=String(Math.floor((secs%3600)/60)).padStart(2,'0');
  const s=String(secs%60).padStart(2,'0');
  return `${h}:${m}:${s}`;
};

/* ── Section header used in all views ── */
const ViewHeader = ({ title, subtitle, action, actionLabel }) => (
  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
    <div>
      <div style={{ fontFamily:T.sans, fontSize:16, fontWeight:700, color:T.white }}>{title}</div>
      {subtitle && <div style={{ fontFamily:T.sans, fontSize:11, color:T.w40, marginTop:2 }}>{subtitle}</div>}
    </div>
    {action && (
      <button onClick={action} style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.bg,
        background:T.teal, border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer',
        display:'flex', alignItems:'center', gap:6 }}>
        {actionLabel}
      </button>
    )}
  </div>
);

/* ── Card container ── */
const SectionCard = ({ title, action, children }) => (
  <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, overflow:'hidden', marginBottom:16 }}>
    <div style={{ padding:'10px 14px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <span style={{ fontFamily:T.sans, fontSize:11, fontWeight:700, color:T.w70, letterSpacing:'0.04em' }}>{title}</span>
      {action && <span style={{ fontFamily:T.sans, fontSize:10, color:T.teal, cursor:'pointer' }}>{action}</span>}
    </div>
    {children}
  </div>
);

/* ══════════════════════════════════════════
   PATIENTS VIEW
══════════════════════════════════════════ */
const PatientsView = () => {
  const [filter, setFilter] = useState('all'); // all | active | upcoming | prior
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = ALL_PATIENTS.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter;
    const matchSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.compound.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: ALL_PATIENTS.length,
    active: ALL_PATIENTS.filter(p=>p.status==='active').length,
    upcoming: ALL_PATIENTS.filter(p=>p.status==='upcoming').length,
    prior: ALL_PATIENTS.filter(p=>p.status==='prior').length,
  };

  const filterTabs = [
    { id:'all',      label:'All Patients',   count:counts.all },
    { id:'active',   label:'Active',         count:counts.active },
    { id:'upcoming', label:'Upcoming',       count:counts.upcoming },
    { id:'prior',    label:'Prior',          count:counts.prior },
  ];

  return (
    <div style={{ padding:24, overflow:'auto', height:'100%', background:T.bg1 }}>
      <ViewHeader
        title="Patient Roster"
        subtitle={`${counts.active} active · ${counts.upcoming} upcoming · ${counts.prior} prior`}
        actionLabel="+ Add Patient"
      />

      {/* Filter tabs + search */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, gap:12 }}>
        <div style={{ display:'flex', gap:4 }}>
          {filterTabs.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              fontFamily:T.sans, fontSize:11, fontWeight:600,
              padding:'6px 14px', borderRadius:20, cursor:'pointer', transition:'all 0.15s',
              color: filter===t.id ? T.bg : T.w40,
              background: filter===t.id ? T.teal : T.surface,
              border: `1px solid ${filter===t.id ? T.teal : T.border}`,
            }}>
              {t.label}
              <span style={{ marginLeft:6, fontFamily:T.mono, fontSize:9,
                color: filter===t.id ? 'rgba(10,12,11,0.7)' : T.w30 }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search patients..."
          style={{ fontFamily:T.sans, fontSize:12, color:T.white, background:T.bg2,
            border:`1px solid ${T.border2}`, borderRadius:6, padding:'7px 12px',
            outline:'none', width:200 }}
        />
      </div>

      {/* Table header */}
      <div style={{ display:'grid', gridTemplateColumns:'32px 1fr 120px 110px 80px 80px 90px',
        gap:12, padding:'7px 14px', marginBottom:2 }}>
        {['', 'Patient', 'Compound', 'Next Session', 'Sessions', 'Portal', 'Status'].map((h,i) => (
          <div key={i} style={{ fontFamily:T.sans, fontSize:9, fontWeight:700,
            letterSpacing:'0.08em', textTransform:'uppercase', color:T.w20 }}>{h}</div>
        ))}
      </div>

      {/* Patient rows — detail opens inline below each row */}
      {filtered.map(p => {
        const isOpen = selected?.id === p.id;
        return (
          <div key={p.id}>
            {/* Row */}
            <div onClick={() => setSelected(isOpen ? null : p)} style={{
              display:'grid', gridTemplateColumns:'32px 1fr 120px 110px 80px 80px 90px',
              gap:12, padding:'10px 14px',
              borderRadius: isOpen ? '8px 8px 0 0' : 8,
              marginBottom: isOpen ? 0 : 4,
              cursor:'pointer',
              background: isOpen ? T.tealGlow : T.surface,
              border:`1px solid ${isOpen ? 'rgba(45,212,176,0.2)' : T.border}`,
              transition:'all 0.15s', alignItems:'center',
            }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:T.tealDark,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:T.sans, fontSize:9, fontWeight:700, color:T.teal }}>
                {p.initials}
              </div>
              <div>
                <div style={{ fontFamily:T.sans, fontSize:12, fontWeight:600, color:T.w70 }}>{p.name}</div>
                <div style={{ fontFamily:T.sans, fontSize:10, color:T.w30, marginTop:1 }}>{p.diagnosis}</div>
              </div>
              <div><Badge color={compoundColor(p.compound)}>{p.compound}</Badge></div>
              <div style={{ fontFamily:T.sans, fontSize:11, color:p.nextDate==='—'?T.w20:T.w50 }}>
                {p.nextDate}
              </div>
              <div style={{ fontFamily:T.mono, fontSize:12, color:T.w50 }}>{p.sessions}</div>
              <div>
                {p.portal ? <Badge color={T.teal}>Active</Badge> : <Badge color={T.w30}>Inactive</Badge>}
              </div>
              <div>
                <Badge color={p.status==='active'?T.teal:p.status==='upcoming'?T.gold:T.w30}>
                  {p.status}
                </Badge>
              </div>
            </div>

            {/* Inline detail panel */}
            {isOpen && (
              <div style={{
                background:'rgba(45,212,176,0.06)',
                border:'1px solid rgba(45,212,176,0.2)',
                borderTop:'none',
                borderRadius:'0 0 8px 8px',
                padding:16, marginBottom:4,
                display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16,
              }}>
                <div>
                  <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.08em',
                    textTransform:'uppercase', color:T.teal, marginBottom:8 }}>Patient Info</div>
                  {[
                    ['Protocol',  p.protocol],
                    ['Clinician', p.clinician],
                    ['Joined',    p.joined],
                    ['Sessions',  `${p.sessions} total`],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between',
                      padding:'5px 0', borderBottom:`1px solid ${T.border}` }}>
                      <span style={{ fontFamily:T.sans, fontSize:11, color:T.w30 }}>{k}</span>
                      <span style={{ fontFamily:T.sans, fontSize:11, color:T.w70 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.08em',
                    textTransform:'uppercase', color:T.teal, marginBottom:8 }}>Schedule</div>
                  {[
                    ['Next session',  p.nextDate],
                    ['Last session',  p.lastDate],
                    ['Portal access', p.portal ? 'Active' : 'Not invited'],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between',
                      padding:'5px 0', borderBottom:`1px solid ${T.border}` }}>
                      <span style={{ fontFamily:T.sans, fontSize:11, color:T.w30 }}>{k}</span>
                      <span style={{ fontFamily:T.sans, fontSize:11, color:T.w70 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, justifyContent:'flex-end' }}>
                  {!p.portal && (
                    <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.bg,
                      background:T.teal, border:'none', padding:'8px 0', borderRadius:6, cursor:'pointer' }}>
                      Invite to Portal
                    </button>
                  )}
                  <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.w70,
                    background:T.surface2, border:`1px solid ${T.border2}`, padding:'8px 0',
                    borderRadius:6, cursor:'pointer' }}>
                    Schedule Session
                  </button>
                  <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.w70,
                    background:T.surface2, border:`1px solid ${T.border2}`, padding:'8px 0',
                    borderRadius:6, cursor:'pointer' }}>
                    View Session History
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:40, color:T.w30, fontFamily:T.sans, fontSize:13 }}>
          No patients match that filter.
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   SESSIONS VIEW
══════════════════════════════════════════ */
const SessionsView = () => {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const elapsed = useTimer('01:14:33', true);

  const filtered = filter === 'all'
    ? ALL_SESSIONS
    : filter === 'upcoming' ? ALL_SESSIONS.filter(s => s.status==='scheduled')
    : filter === 'live'     ? ALL_SESSIONS.filter(s => s.status==='live')
    : ALL_SESSIONS.filter(s => s.status==='complete');

  const counts = {
    all:      ALL_SESSIONS.length,
    live:     ALL_SESSIONS.filter(s=>s.status==='live').length,
    upcoming: ALL_SESSIONS.filter(s=>s.status==='scheduled').length,
    past:     ALL_SESSIONS.filter(s=>s.status==='complete').length,
  };

  const filterTabs = [
    { id:'all',      label:'All',      count:counts.all },
    { id:'live',     label:'Live Now', count:counts.live },
    { id:'upcoming', label:'Upcoming', count:counts.upcoming },
    { id:'past',     label:'Past',     count:counts.past },
  ];

  const statusColor = s => s==='live'?T.teal : s==='scheduled'?T.gold : T.w30;
  const statusLabel = s => s==='live'?'LIVE' : s==='scheduled'?'UPCOMING' : 'COMPLETE';

  // Group by date for display
  const groups = filtered.reduce((acc, s) => {
    const key = s.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div style={{ padding:24, overflow:'auto', height:'100%', background:T.bg1 }}>
      <ViewHeader
        title="All Sessions"
        subtitle={`${counts.live} live · ${counts.upcoming} upcoming · ${counts.past} past`}
        actionLabel="+ New Session"
      />

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20 }}>
        {filterTabs.map(t => (
          <button key={t.id} onClick={() => { setFilter(t.id); setSelected(null); }} style={{
            fontFamily:T.sans, fontSize:11, fontWeight:600,
            padding:'6px 14px', borderRadius:20, cursor:'pointer', transition:'all 0.15s',
            color: filter===t.id ? T.bg : T.w40,
            background: filter===t.id ? (t.id==='live' ? T.teal : T.teal) : T.surface,
            border: `1px solid ${filter===t.id ? T.teal : T.border}`,
          }}>
            {t.id === 'live' && t.count > 0 && (
              <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%',
                background: filter===t.id ? T.bg : T.teal,
                marginRight:6, animation:'psyPulse 1.5s infinite' }} />
            )}
            {t.label}
            <span style={{ marginLeft:6, fontFamily:T.mono, fontSize:9,
              color: filter===t.id ? 'rgba(10,12,11,0.7)' : T.w30 }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Session groups by date */}
      {Object.entries(groups).map(([date, sessions]) => (
        <div key={date} style={{ marginBottom:20 }}>
          {/* Date label */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <span style={{ fontFamily:T.sans, fontSize:10, fontWeight:700,
              letterSpacing:'0.1em', textTransform:'uppercase', color:T.w30 }}>
              {date}
            </span>
            <div style={{ flex:1, height:1, background:T.border }} />
            <span style={{ fontFamily:T.mono, fontSize:10, color:T.w20 }}>
              {sessions.length} session{sessions.length!==1?'s':''}
            </span>
          </div>

          {/* Table header (once per group) */}
          <div style={{ display:'grid',
            gridTemplateColumns:'20px 36px 1fr 110px 90px 80px 100px',
            gap:12, padding:'5px 12px', marginBottom:2 }}>
            {['','','Patient','Protocol','Room','Duration','Status'].map((h,i)=>(
              <div key={i} style={{ fontFamily:T.sans, fontSize:9, fontWeight:700,
                letterSpacing:'0.08em', textTransform:'uppercase', color:T.w20 }}>{h}</div>
            ))}
          </div>

          {/* Session rows — detail opens inline below each row */}
          {sessions.map(s => {
            const isOpen = selected?.id === s.id;
            return (
              <div key={s.id}>
                {/* Row */}
                <div onClick={() => setSelected(isOpen ? null : s)} style={{
                  display:'grid', gridTemplateColumns:'20px 36px 1fr 110px 90px 80px 100px',
                  gap:12, padding:'10px 12px',
                  borderRadius: isOpen ? '8px 8px 0 0' : 8,
                  marginBottom: isOpen ? 0 : 3,
                  cursor:'pointer', alignItems:'center', transition:'all 0.15s',
                  background: isOpen ? T.tealGlow : T.surface,
                  border:`1px solid ${isOpen ? 'rgba(45,212,176,0.2)' : T.border}`,
                }}>
                  <Dot color={statusColor(s.status)} pulse={s.status==='live'} />
                  <div style={{ width:30, height:30, borderRadius:'50%', background:T.tealDark,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:T.sans, fontSize:9, fontWeight:700, color:T.teal }}>
                    {s.initials}
                  </div>
                  <div>
                    <div style={{ fontFamily:T.sans, fontSize:12, fontWeight:600, color:T.w70 }}>
                      {s.patient}
                    </div>
                    <div style={{ fontFamily:T.sans, fontSize:10, color:T.w30, marginTop:1 }}>
                      {s.time} · {s.soundframe}
                    </div>
                  </div>
                  <div><Badge color={compoundColor(s.compound)}>{s.compound}</Badge></div>
                  <div style={{ fontFamily:T.sans, fontSize:11, color:T.w50 }}>{s.room}</div>
                  <div style={{ fontFamily:T.mono, fontSize:11, color:T.w40 }}>
                    {s.status==='live' ? elapsed : s.duration}
                  </div>
                  <div><Badge color={statusColor(s.status)}>{statusLabel(s.status)}</Badge></div>
                </div>

                {/* Inline detail panel */}
                {isOpen && (
                  <div style={{
                    background:'rgba(45,212,176,0.06)',
                    border:'1px solid rgba(45,212,176,0.2)',
                    borderTop:'none',
                    borderRadius:'0 0 8px 8px',
                    padding:16, marginBottom:3,
                    display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20,
                  }}>
                    <div>
                      <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.08em',
                        textTransform:'uppercase', color:T.teal, marginBottom:8 }}>Session Detail</div>
                      {[
                        ['Patient',  s.patient],
                        ['Date',     s.date],
                        ['Time',     s.time],
                        ['Duration', s.duration],
                        ['Room',     s.room],
                      ].map(([k,v]) => (
                        <div key={k} style={{ display:'flex', justifyContent:'space-between',
                          padding:'5px 0', borderBottom:`1px solid ${T.border}` }}>
                          <span style={{ fontFamily:T.sans, fontSize:11, color:T.w30 }}>{k}</span>
                          <span style={{ fontFamily:T.sans, fontSize:11, color:T.w70 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.08em',
                        textTransform:'uppercase', color:T.teal, marginBottom:8 }}>Soundframe™</div>
                      {[
                        ['Protocol',   s.protocol],
                        ['Soundframe', s.soundframe],
                        ['Compound',   s.compound],
                        ['Clinician',  s.clinician],
                      ].map(([k,v]) => (
                        <div key={k} style={{ display:'flex', justifyContent:'space-between',
                          padding:'5px 0', borderBottom:`1px solid ${T.border}` }}>
                          <span style={{ fontFamily:T.sans, fontSize:11, color:T.w30 }}>{k}</span>
                          <span style={{ fontFamily:T.sans, fontSize:11, color:T.w70 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8, justifyContent:'flex-end' }}>
                      {s.status === 'live' && (
                        <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.bg,
                          background:T.teal, border:'none', padding:'8px 0', borderRadius:6, cursor:'pointer' }}>
                          ▶ Open Live Session
                        </button>
                      )}
                      {s.status === 'scheduled' && (
                        <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.bg,
                          background:T.teal, border:'none', padding:'8px 0', borderRadius:6, cursor:'pointer' }}>
                          Launch Session
                        </button>
                      )}
                      <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.w70,
                        background:T.surface2, border:`1px solid ${T.border2}`, padding:'8px 0',
                        borderRadius:6, cursor:'pointer' }}>
                        {s.status==='complete' ? 'View Session Notes' : 'Edit Session'}
                      </button>
                      <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.w70,
                        background:T.surface2, border:`1px solid ${T.border2}`, padding:'8px 0',
                        borderRadius:6, cursor:'pointer' }}>
                        View Patient Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:40, color:T.w30, fontFamily:T.sans, fontSize:13 }}>
          No sessions in this category.
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   DASHBOARD VIEW (original)
══════════════════════════════════════════ */
const DashboardView = ({ elapsed }) => {
  const [selectedProtocol, setSelectedProtocol] = useState(PROTOCOLS[0]);
  const [selectedPatient, setSelectedPatient]   = useState(ALL_PATIENTS[0]);
  const [playing, setPlaying] = useState(true);
  const PATIENTS = ALL_PATIENTS.slice(0,5);

  return (
    <div style={{ padding:24, overflow:'auto', background:T.bg1, height:'100%' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:T.sans, fontSize:16, fontWeight:700, color:T.white }}>Today's Sessions</div>
          <div style={{ fontFamily:T.sans, fontSize:11, color:T.w40, marginTop:2 }}>Friday, June 6 · 3 scheduled · 1 active</div>
        </div>
        <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.bg, background:T.teal,
          border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          + New Session
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:18 }}>
        {[
          { label:'Active now',   val:'1',  delta:'Ketamine protocol', dc:T.teal },
          { label:'This month',   val:'38', delta:'sessions',          dc:T.w30  },
          { label:'Patients',     val:'14', delta:'active roster',     dc:T.w30  },
          { label:'Portal access',val:'11', delta:'patients active',   dc:T.w30  },
        ].map((s,i) => (
          <div key={i} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, padding:'12px 14px' }}>
            <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:600, letterSpacing:'0.06em',
              textTransform:'uppercase', color:T.w30, marginBottom:6 }}>{s.label}</div>
            <MonoVal color={i===0?T.teal:T.white}>{s.val}</MonoVal>
            <div style={{ fontFamily:T.sans, fontSize:10, color:s.dc, marginTop:4 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {/* Session queue */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, overflow:'hidden' }}>
          <div style={{ padding:'10px 14px', borderBottom:`1px solid ${T.border}`,
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontFamily:T.sans, fontSize:11, fontWeight:700, color:T.w70, letterSpacing:'0.04em' }}>Session Queue</span>
            <span style={{ fontFamily:T.sans, fontSize:10, color:T.teal, cursor:'pointer' }}>View all →</span>
          </div>
          {PATIENTS.map((p,i) => (
            <div key={p.id} onClick={() => setSelectedPatient(p)} style={{
              display:'grid', gridTemplateColumns:'20px 1fr auto',
              alignItems:'center', gap:10, padding:'9px 14px',
              borderBottom:`1px solid ${T.border}`, cursor:'pointer',
              background: selectedPatient.id===p.id ? T.tealGlow : 'transparent',
              transition:'background 0.15s',
            }}>
              <Dot color={p.status==='live'?T.teal:p.status==='scheduled'?T.gold:T.w20} pulse={p.status==='live'} />
              <div>
                <div style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.w70 }}>{p.name} — {p.room||'—'}</div>
                <div style={{ fontFamily:T.mono, fontSize:9, color:T.w30, marginTop:1 }}>
                  {p.protocol}{p.status==='live'?` · ${elapsed} elapsed`:p.time?` · ${p.time}`:''}
                </div>
              </div>
              <Badge color={p.status==='live'?T.teal:p.status==='scheduled'?T.gold:T.w30}>
                {p.status==='live'?'LIVE':p.status==='scheduled'?'SCHED':'DONE'}
              </Badge>
            </div>
          ))}
        </div>

        {/* Protocol selector */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:8,
          overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'10px 14px', borderBottom:`1px solid ${T.border}`,
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontFamily:T.sans, fontSize:11, fontWeight:700, color:T.w70, letterSpacing:'0.04em' }}>Soundframe™ Protocol</span>
            <span style={{ fontFamily:T.sans, fontSize:10, color:T.teal, cursor:'pointer' }}>Full library →</span>
          </div>
          <div style={{ padding:8 }}>
            {PROTOCOLS.map((p,i) => (
              <div key={p.id} onClick={() => setSelectedProtocol(p)} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'8px 10px', borderRadius:6, marginBottom:2,
                background: selectedProtocol.id===p.id ? p.colorGlow : 'transparent',
                border: selectedProtocol.id===p.id ? `1px solid ${p.colorBorder}` : '1px solid transparent',
                cursor:'pointer', transition:'all 0.15s',
              }}>
                <div style={{ width:28, height:28, borderRadius:6, display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:14, flexShrink:0, background:`${p.color}18` }}>{p.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:T.sans, fontSize:11, fontWeight:700, color:T.w70 }}>{p.name}</div>
                  <div style={{ fontFamily:T.sans, fontSize:9, color:T.w30, marginTop:1 }}>{p.phases} phases · {p.duration}</div>
                </div>
                <span style={{ fontFamily:T.mono, fontSize:10, color:T.w30 }}>{p.duration}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:'auto', padding:'10px 14px', borderTop:`1px solid ${T.border}`,
            display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={() => setPlaying(v=>!v)} style={{ width:28, height:28, borderRadius:'50%',
              background:T.teal, border:'none', display:'flex', alignItems:'center',
              justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
              {playing
                ? <svg width="10" height="10"><rect x="0" y="0" width="3.5" height="10" rx="1" fill="#0a0c0b"/><rect x="6.5" y="0" width="3.5" height="10" rx="1" fill="#0a0c0b"/></svg>
                : <svg width="10" height="12" style={{marginLeft:1}}><polygon points="0,0 10,6 0,12" fill="#0a0c0b"/></svg>
              }
            </button>
            <div style={{ flex:1 }}>
              <Waveform color={selectedProtocol.color} count={44} playing={playing} height={24} />
            </div>
            <span style={{ fontFamily:T.mono, fontSize:10, color:T.w30, flexShrink:0 }}>{elapsed}</span>
          </div>
        </div>
      </div>

      {/* Selected patient detail */}
      <div style={{ marginTop:10, background:T.bg2, border:`1px solid ${T.border2}`, borderRadius:8,
        padding:'12px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:T.tealDark,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:T.sans, fontSize:12, fontWeight:700, color:T.teal, flexShrink:0 }}>
            {selectedPatient.initials}
          </div>
          <div>
            <div style={{ fontFamily:T.sans, fontSize:12, fontWeight:700, color:T.w70 }}>{selectedPatient.name}</div>
            <div style={{ fontFamily:T.mono, fontSize:10, color:T.w30, marginTop:2 }}>
              {selectedPatient.protocol} · {selectedPatient.sessions} sessions total
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontFamily:T.sans, fontSize:11, color:T.w30 }}>Portal access:</span>
          <Badge color={selectedPatient.portal ? T.teal : T.w30}>
            {selectedPatient.portal ? 'Active' : 'Inactive'}
          </Badge>
          {!selectedPatient.portal && (
            <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.bg,
              background:T.teal, border:'none', padding:'5px 12px', borderRadius:5, cursor:'pointer' }}>
              Invite to Portal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   SOUNDFRAME LIBRARY DATA
══════════════════════════════════════════ */
const LIBRARY = [
  // ── KETAMINE ──
  {
    id:'k-90', compound:'Ketamine', color:T.teal, icon:'🌊',
    name:'Dissociative Grounding Arc', code:'KETAMINE-90',
    duration:'90 min', phases:2, format:'Continuous',
    desc:'Sub-bass anchoring and smooth textural movement engineered to maintain body awareness through the dissociative state. No percussive content. No melodic resolution.',
    tags:['Sub-bass anchor','No percussion','Body-grounding','Onset + Peak'],
    usedIn:'Clinical sessions', addedDate:'Jan 2024', plays:247,
  },
  {
    id:'k-60', compound:'Ketamine', color:T.teal, icon:'🌊',
    name:'Short Induction Arc', code:'KETAMINE-60',
    duration:'60 min', phases:2, format:'Continuous',
    desc:'Condensed version of the Dissociative Grounding Arc for shorter ketamine infusion protocols. Same sub-bass structure, tighter timeline.',
    tags:['Sub-bass anchor','No percussion','Short protocol','60 min'],
    usedIn:'Clinical sessions', addedDate:'Feb 2024', plays:183,
  },
  {
    id:'k-int', compound:'Ketamine', color:T.teal, icon:'◌',
    name:'Ketamine Integration — Short', code:'KETAMINE-INT-20',
    duration:'20 min', phases:1, format:'Single arc',
    desc:'Post-session grounding soundframe for home integration use. Clinician-assigned via patient portal. Designed for the 24–72 hour window following a ketamine session.',
    tags:['Integration','Home use','Portal delivery','Grounding'],
    usedIn:'Patient portal', addedDate:'Mar 2024', plays:412,
  },
  {
    id:'k-int-ext', compound:'Ketamine', color:T.teal, icon:'◌',
    name:'Ketamine Integration — Extended', code:'KETAMINE-INT-30',
    duration:'30 min', phases:1, format:'Single arc',
    desc:'Extended home integration soundframe for patients who benefit from a longer grounding session. Same acoustic architecture as the short version, expanded timeline.',
    tags:['Integration','Home use','Extended','Portal delivery'],
    usedIn:'Patient portal', addedDate:'Apr 2024', plays:98,
  },
  // ── PSILOCYBIN ──
  {
    id:'p-360', compound:'Psilocybin', color:T.gold, icon:'✦',
    name:'Full-Spectrum Journey Arc', code:'PSILOCYBIN-360',
    duration:'360 min', phases:3, format:'Continuous',
    desc:'Three-arc structure: Journey Entry, Deep Processing, Gentle Return. Accommodates the full emotional spectrum without directing any of it. Free of culturally coded instrumentation, lyrics, and harmonic resolution.',
    tags:['3-arc structure','Full spectrum','6 hours','Trigger-free'],
    usedIn:'Clinical sessions', addedDate:'Jan 2024', plays:89,
  },
  {
    id:'p-240', compound:'Psilocybin', color:T.gold, icon:'✦',
    name:'Medium Journey Arc', code:'PSILOCYBIN-240',
    duration:'240 min', phases:3, format:'Continuous',
    desc:'4-hour version of the Full-Spectrum Journey Arc for medium-dose psilocybin protocols. Maintains the three-arc structure with compressed phase durations.',
    tags:['3-arc structure','4 hours','Medium dose','Full spectrum'],
    usedIn:'Clinical sessions', addedDate:'Mar 2024', plays:54,
  },
  {
    id:'p-int', compound:'Psilocybin', color:T.gold, icon:'◌',
    name:'Psilocybin Integration — Gentle Return', code:'PSILO-INT-20',
    duration:'20 min', phases:1, format:'Single arc',
    desc:'Soft, supportive soundframe for integration in the days following a psilocybin session. Based on the Gentle Return phase of the Full-Spectrum Journey Arc.',
    tags:['Integration','Home use','Gentle','Portal delivery'],
    usedIn:'Patient portal', addedDate:'Apr 2024', plays:201,
  },
  // ── MDMA / PTSD ──
  {
    id:'m-240', compound:'MDMA / PTSD', color:T.red, icon:'◎',
    name:'Trauma-Informed MAPS Arc', code:'MDMA-PTSD-240',
    duration:'240 min', phases:4, format:'Continuous',
    desc:'Developed in direct response to patient feedback from MAPS FDA clinical trials. Supports dual-focus processing — inward exploration and relational presence — without intruding on either. Veteran-informed. MAPS-tested.',
    tags:['4-arc structure','MAPS-tested','Veteran-informed','Trauma-safe'],
    usedIn:'Clinical sessions', addedDate:'Jan 2024', plays:76,
  },
  {
    id:'m-int', compound:'MDMA / PTSD', color:T.red, icon:'◌',
    name:'MDMA Integration Arc', code:'MDMA-INT-25',
    duration:'25 min', phases:1, format:'Single arc',
    desc:'Post-MDMA integration soundframe designed for the processing window in the days following a session. Supportive, non-directive. Particularly suited to veterans working with trauma.',
    tags:['Integration','PTSD','Veteran','Portal delivery'],
    usedIn:'Patient portal', addedDate:'Feb 2024', plays:144,
  },
  // ── GENERAL / INTEGRATION ──
  {
    id:'g-rest', compound:'Integration', color:T.w40, icon:'◌',
    name:'Deep Rest Soundframe', code:'INT-REST-30',
    duration:'30 min', phases:1, format:'Single arc',
    desc:'Sleep-support soundframe for use in the 1–3 nights following any session. Activates the parasympathetic nervous system. Rooted in humpback whale acoustics and U.S. Navy sonar research.',
    tags:['Sleep support','Any compound','Parasympathetic','Nature-sourced'],
    usedIn:'Patient portal', addedDate:'Jan 2024', plays:528,
  },
];

const NEW_RELEASES = [
  {
    id:'nr-1', compound:'Ketamine', color:T.teal, icon:'🌊',
    name:'Ketamine Extended — 120 min', code:'KETAMINE-120',
    duration:'120 min', phases:3, format:'Continuous',
    isNew:true, releaseDate:'Jun 2025',
    desc:'A newly engineered 120-minute arc for higher-dose or extended ketamine infusion protocols. Three phases: Deep Onset, Dissociative Peak, and Soft Landing. Fills the gap between the 90-min and full 6-hour formats.',
    tags:['Extended protocol','3 phases','Higher dose','Sub-bass anchor'],
    badge:'New',
  },
  {
    id:'nr-2', compound:'Psilocybin', color:T.gold, icon:'✦',
    name:'Micro-Journey Arc — 90 min', code:'PSILO-MICRO-90',
    duration:'90 min', phases:2, format:'Continuous',
    isNew:true, releaseDate:'Jun 2025',
    desc:'Designed for microdose-adjacent and lower-dose psilocybin protocols. Gentle, expansive, non-directive. Bridges the gap for clinicians working with patients at the lower end of the dosing spectrum.',
    tags:['Low dose','2 phases','Gentle','Expansive'],
    badge:'New',
  },
  {
    id:'nr-3', compound:'MDMA / PTSD', color:T.red, icon:'◎',
    name:'Booster Session Arc — 60 min', code:'MDMA-BOOST-60',
    duration:'60 min', phases:2, format:'Continuous',
    isNew:true, releaseDate:'Jun 2025',
    desc:'A shorter MDMA arc for booster or follow-up sessions, designed for patients in later stages of a treatment course who require a lighter, more relational sound environment rather than a full deep-processing arc.',
    tags:['Booster session','Relational','Later-stage','MAPS-informed'],
    badge:'New',
  },
  {
    id:'nr-4', compound:'Integration', color:'#9b7fd4', icon:'◌',
    name:'Breathwork Companion Arc', code:'INT-BREATH-20',
    duration:'20 min', phases:1, format:'Single arc',
    isNew:true, releaseDate:'Jun 2025',
    desc:'Our first soundframe purpose-built for use alongside breathwork practices between sessions. Supports conscious breathing rhythms without driving them. Designed to extend the integration window beyond traditional listening.',
    tags:['Breathwork','Between sessions','Integration','Any compound'],
    badge:'Beta',
  },
];

/* ── Mini waveform bar strip (animated when playing) ── */
const MiniWave = ({ color, count=32, playing=false, height=20 }) => {
  const BASE = [5,9,13,19,15,9,13,17,21,15,9,13,17,13,9,7,13,19,15,11,7,11,17,21,17,11,7,13,17,13,9,5];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, [playing]);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:2, height }}>
      {Array.from({length:count}, (_,i) => {
        const base = BASE[i % BASE.length];
        const h = playing
          ? Math.max(3, base * (0.45 + 0.55 * Math.abs(Math.sin((i + tick * 0.35) * 0.42))))
          : base;
        return (
          <span key={i} style={{
            display:'block', width:2.5, borderRadius:2,
            height: h,
            background: color,
            opacity: playing ? (i < count*0.5 ? 1 : 0.45) : (i < count*0.4 ? 0.9 : 0.2),
            transition: playing ? 'height 0.08s ease' : 'none',
            flexShrink:0,
          }} />
        );
      })}
    </div>
  );
};

/* ── Compound color helper ── */
const cColor = c => {
  if (!c) return T.w40;
  const l = c.toLowerCase();
  if (l.includes('ketamine'))   return T.teal;
  if (l.includes('psilocybin')) return T.gold;
  if (l.includes('mdma'))       return T.red;
  if (l.includes('breathwork') || l === 'integration') return '#9b7fd4';
  return T.w40;
};

/* ══════════════════════════════════════════
   SOUNDFRAME LIBRARY VIEW
══════════════════════════════════════════ */
const SoundframeLibraryView = () => {
  const [filter, setFilter]   = useState('all');
  const [selected, setSelected] = useState(null);
  const [search, setSearch]   = useState('');
  const [playing, setPlaying] = useState(null);

  const compounds = ['all','Ketamine','Psilocybin','MDMA / PTSD','Integration'];
  const counts = {
    all:         LIBRARY.length,
    Ketamine:    LIBRARY.filter(s=>s.compound==='Ketamine').length,
    Psilocybin:  LIBRARY.filter(s=>s.compound==='Psilocybin').length,
    'MDMA / PTSD': LIBRARY.filter(s=>s.compound==='MDMA / PTSD').length,
    Integration: LIBRARY.filter(s=>s.compound==='Integration').length,
  };

  const filtered = LIBRARY.filter(s => {
    const matchC = filter==='all' || s.compound===filter;
    const matchS = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()));
    return matchC && matchS;
  });

  // Group by compound for display
  const grouped = filtered.reduce((acc,s) => {
    if (!acc[s.compound]) acc[s.compound] = [];
    acc[s.compound].push(s);
    return acc;
  }, {});

  const compoundOrder = ['Ketamine','Psilocybin','MDMA / PTSD','Integration'];

  return (
    <div style={{ padding:24, overflow:'auto', height:'100%', background:T.bg1 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:T.sans, fontSize:16, fontWeight:700, color:T.white }}>Soundframe™ Library</div>
          <div style={{ fontFamily:T.sans, fontSize:11, color:T.w40, marginTop:2 }}>
            {LIBRARY.length} soundframes across 3 compounds · Updated Jun 2025
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.gold,
            background:'rgba(201,169,110,0.1)', border:'1px solid rgba(201,169,110,0.2)',
            padding:'4px 12px', borderRadius:20 }}>
            ✦ 4 new soundframes available
          </span>
        </div>
      </div>

      {/* Filter tabs + search */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:12 }}>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {compounds.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              fontFamily:T.sans, fontSize:11, fontWeight:600,
              padding:'6px 14px', borderRadius:20, cursor:'pointer', transition:'all 0.15s',
              color: filter===c ? T.bg : cColor(c==='all'?null:c),
              background: filter===c ? cColor(c==='all'?null:c) : T.surface,
              border: `1px solid ${filter===c ? cColor(c==='all'?null:c) : T.border}`,
            }}>
              {c==='all'?'All Soundframes':c}
              <span style={{ marginLeft:6, fontFamily:T.mono, fontSize:9,
                color:filter===c?'rgba(10,12,11,0.6)':T.w30 }}>
                {counts[c]}
              </span>
            </button>
          ))}
        </div>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search soundframes..."
          style={{ fontFamily:T.sans, fontSize:12, color:T.white, background:T.bg2,
            border:`1px solid ${T.border2}`, borderRadius:6, padding:'7px 12px',
            outline:'none', width:200 }}
        />
      </div>

      {/* Grouped soundframe cards */}
      {compoundOrder.filter(c => grouped[c]).map(compound => (
        <div key={compound} style={{ marginBottom:24 }}>
          {/* Compound header */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <span style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.1em',
              textTransform:'uppercase', color:cColor(compound) }}>{compound}</span>
            <div style={{ flex:1, height:1, background:T.border }} />
            <span style={{ fontFamily:T.mono, fontSize:10, color:T.w20 }}>
              {grouped[compound].length} soundframe{grouped[compound].length!==1?'s':''}
            </span>
          </div>

          {/* Soundframe rows */}
          {grouped[compound].map(sf => (
            <div key={sf.id}>
              <div onClick={() => setSelected(selected?.id===sf.id ? null : sf)} style={{
                display:'grid', gridTemplateColumns:'36px 1fr 90px 70px 70px 70px 80px',
                gap:12, padding:'12px 14px', borderRadius:selected?.id===sf.id?'8px 8px 0 0':8,
                marginBottom: selected?.id===sf.id ? 0 : 4,
                cursor:'pointer', alignItems:'center', transition:'all 0.15s',
                background: selected?.id===sf.id ? `${sf.color}18` : T.surface,
                border:`1px solid ${selected?.id===sf.id ? sf.color+'44' : T.border}`,
              }}>
                {/* Icon */}
                <div style={{ width:32, height:32, borderRadius:7, background:`${sf.color}18`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>
                  {sf.icon}
                </div>
                {/* Name + code */}
                <div>
                  <div style={{ fontFamily:T.sans, fontSize:12, fontWeight:700,
                    color: selected?.id===sf.id ? T.white : T.w70 }}>{sf.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:2 }}>
                    <span style={{ fontFamily:T.mono, fontSize:9, color:sf.color }}>{sf.code}</span>
                    <span style={{ fontFamily:T.sans, fontSize:9, color:T.w20 }}>·</span>
                    <span style={{ fontFamily:T.sans, fontSize:9, color:T.w30 }}>{sf.usedIn}</span>
                  </div>
                </div>
                {/* Duration */}
                <div style={{ fontFamily:T.mono, fontSize:11, color:T.w50 }}>{sf.duration}</div>
                {/* Phases */}
                <div style={{ fontFamily:T.sans, fontSize:11, color:T.w40 }}>{sf.phases} phase{sf.phases!==1?'s':''}</div>
                {/* Plays */}
                <div>
                  <div style={{ fontFamily:T.mono, fontSize:12, color:T.w50 }}>{sf.plays}</div>
                  <div style={{ fontFamily:T.sans, fontSize:9, color:T.w20, marginTop:1 }}>plays</div>
                </div>
                {/* Waveform preview */}
                <div style={{ opacity:0.7 }}>
                  <MiniWave color={sf.color} count={20} playing={playing===sf.id} />
                </div>
                {/* Play / select */}
                <div style={{ display:'flex', gap:6, alignItems:'center', justifyContent:'flex-end' }}>
                  <button onClick={e=>{e.stopPropagation();setPlaying(playing===sf.id?null:sf.id);}} style={{
                    width:26, height:26, borderRadius:'50%',
                    background: playing===sf.id ? sf.color : 'transparent',
                    border:`1px solid ${sf.color}66`,
                    display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
                    transition:'all 0.15s',
                  }}>
                    {playing===sf.id
                      ? <svg width="9" height="9"><rect x="0" y="0" width="3" height="9" rx="1" fill={T.bg}/><rect x="6" y="0" width="3" height="9" rx="1" fill={T.bg}/></svg>
                      : <svg width="8" height="9" style={{marginLeft:1}}><polygon points="0,0 8,4.5 0,9" fill={sf.color}/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {selected?.id===sf.id && (
                <div style={{ background:`${sf.color}0e`, border:`1px solid ${sf.color}33`,
                  borderTop:'none', borderRadius:'0 0 8px 8px', padding:16, marginBottom:4 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'start' }}>
                    <div>
                      <p style={{ fontFamily:T.sans, fontSize:12, color:T.w50, lineHeight:1.65, marginBottom:12 }}>
                        {sf.desc}
                      </p>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {sf.tags.map(tag => (
                          <span key={tag} style={{ fontFamily:T.sans, fontSize:10, fontWeight:600,
                            color:sf.color, background:`${sf.color}15`,
                            border:`1px solid ${sf.color}30`, padding:'3px 9px', borderRadius:20 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:6, minWidth:140 }}>
                      <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600,
                        color:T.bg, background:sf.color, border:'none',
                        padding:'8px 14px', borderRadius:6, cursor:'pointer', whiteSpace:'nowrap' }}>
                        Assign to Session
                      </button>
                      <button style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.w70,
                        background:T.surface2, border:`1px solid ${T.border2}`,
                        padding:'8px 14px', borderRadius:6, cursor:'pointer' }}>
                        Send to Portal
                      </button>
                      <div style={{ fontFamily:T.sans, fontSize:10, color:T.w20, textAlign:'center',
                        paddingTop:4 }}>Added {sf.addedDate}</div>
                    </div>
                  </div>
                  {/* Mini waveform full */}
                  <div style={{ marginTop:14, padding:'10px 12px', background:`${sf.color}08`,
                    border:`1px solid ${sf.color}20`, borderRadius:6 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <button onClick={()=>setPlaying(playing===sf.id?null:sf.id)} style={{
                        width:24, height:24, borderRadius:'50%', background:sf.color,
                        border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {playing===sf.id
                          ? <svg width="8" height="8"><rect x="0" y="0" width="2.5" height="8" rx="0.5" fill={T.bg}/><rect x="5.5" y="0" width="2.5" height="8" rx="0.5" fill={T.bg}/></svg>
                          : <svg width="7" height="8" style={{marginLeft:1}}><polygon points="0,0 7,4 0,8" fill={T.bg}/></svg>}
                      </button>
                      <MiniWave color={sf.color} count={48} playing={playing===sf.id} height={22} />
                      <span style={{ fontFamily:T.mono, fontSize:10, color:T.w30, flexShrink:0 }}>
                        {sf.duration}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {filtered.length===0 && (
        <div style={{ textAlign:'center', padding:40, color:T.w30, fontFamily:T.sans, fontSize:13 }}>
          No soundframes match that search.
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   NEW RELEASE VIEW
══════════════════════════════════════════ */
const NewReleaseView = () => {
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying]   = useState(null);

  return (
    <div style={{ padding:24, overflow:'auto', height:'100%', background:T.bg1 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
        <div>
          <div style={{ fontFamily:T.sans, fontSize:16, fontWeight:700, color:T.white }}>New Releases</div>
          <div style={{ fontFamily:T.sans, fontSize:11, color:T.w40, marginTop:2 }}>
            June 2025 · {NEW_RELEASES.length} new soundframes added to your library
          </div>
        </div>
        <span style={{ fontFamily:T.mono, fontSize:10, fontWeight:500,
          color:T.gold, background:'rgba(201,169,110,0.1)', border:'1px solid rgba(201,169,110,0.2)',
          padding:'4px 12px', borderRadius:20 }}>
          Jun 2025 Drop
        </span>
      </div>

      {/* Intro band */}
      <div style={{ background:`linear-gradient(135deg,rgba(45,212,176,0.07),rgba(201,169,110,0.05))`,
        border:`1px solid ${T.border2}`, borderRadius:10, padding:'14px 18px', marginBottom:24,
        display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ fontSize:24, flexShrink:0 }}>✦</div>
        <div>
          <div style={{ fontFamily:T.serif, fontSize:15, fontStyle:'italic', color:T.w70, lineHeight:1.5 }}>
            Each new soundframe is automatically added to your library. Click any card to preview, assign to a session, or send to a patient's portal.
          </div>
        </div>
      </div>

      {/* Release cards — 2 col grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {NEW_RELEASES.map(sf => (
          <div key={sf.id} onClick={() => setSelected(selected?.id===sf.id?null:sf)} style={{
            background: selected?.id===sf.id ? `${sf.color}14` : T.bg2,
            border:`1px solid ${selected?.id===sf.id ? sf.color+'44' : T.border2}`,
            borderRadius:12, overflow:'hidden', cursor:'pointer', transition:'all 0.2s',
            transform: selected?.id===sf.id ? 'none' : 'translateY(0)',
          }}
          onMouseEnter={e=>{ if(selected?.id!==sf.id) e.currentTarget.style.transform='translateY(-2px)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; }}
          >
            {/* Card top */}
            <div style={{ padding:'16px 18px 12px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:`${sf.color}20`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                    {sf.icon}
                  </div>
                  <div>
                    <span style={{ fontFamily:T.sans, fontSize:9, fontWeight:700, letterSpacing:'0.1em',
                      textTransform:'uppercase', color:sf.color, background:`${sf.color}15`,
                      border:`1px solid ${sf.color}30`, padding:'2px 8px', borderRadius:20 }}>
                      {sf.compound}
                    </span>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontFamily:T.sans, fontSize:9, fontWeight:700, letterSpacing:'0.08em',
                    textTransform:'uppercase',
                    color: sf.badge==='Beta' ? T.gold : T.bg,
                    background: sf.badge==='Beta' ? 'rgba(201,169,110,0.15)' : sf.color,
                    border: sf.badge==='Beta' ? '1px solid rgba(201,169,110,0.3)' : 'none',
                    padding:'3px 9px', borderRadius:20 }}>
                    {sf.badge}
                  </span>
                </div>
              </div>

              <div style={{ fontFamily:T.serif, fontSize:17, fontStyle:'italic', color:T.white,
                lineHeight:1.3, marginBottom:6 }}>{sf.name}</div>
              <div style={{ fontFamily:T.mono, fontSize:10, color:sf.color, marginBottom:10 }}>{sf.code}</div>

              <p style={{ fontFamily:T.sans, fontSize:12, color:T.w40, lineHeight:1.6, marginBottom:14 }}>
                {sf.desc}
              </p>

              {/* Tags */}
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
                {sf.tags.map(tag => (
                  <span key={tag} style={{ fontFamily:T.sans, fontSize:9, fontWeight:600,
                    color:sf.color, background:`${sf.color}12`,
                    border:`1px solid ${sf.color}28`, padding:'2px 8px', borderRadius:20 }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Waveform + transport */}
              <div style={{ padding:'10px 12px', background:`${sf.color}08`,
                border:`1px solid ${sf.color}18`, borderRadius:7,
                display:'flex', alignItems:'center', gap:10 }}>
                <button onClick={e=>{e.stopPropagation();setPlaying(playing===sf.id?null:sf.id);}} style={{
                  width:26, height:26, borderRadius:'50%', background:sf.color,
                  border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {playing===sf.id
                    ? <svg width="9" height="9"><rect x="0" y="0" width="3" height="9" rx="1" fill={T.bg}/><rect x="6" y="0" width="3" height="9" rx="1" fill={T.bg}/></svg>
                    : <svg width="8" height="9" style={{marginLeft:1}}><polygon points="0,0 8,4.5 0,9" fill={T.bg}/></svg>}
                </button>
                <MiniWave color={sf.color} count={32} playing={playing===sf.id} height={22} />
                <span style={{ fontFamily:T.mono, fontSize:10, color:T.w30, flexShrink:0 }}>{sf.duration}</span>
              </div>
            </div>

            {/* Card meta footer */}
            <div style={{ padding:'10px 18px', borderTop:`1px solid ${sf.color}18`,
              display:'flex', alignItems:'center', justifyContent:'space-between',
              background:`${sf.color}06` }}>
              <div style={{ display:'flex', gap:16 }}>
                {[['Duration', sf.duration],['Phases', `${sf.phases}`],['Format', sf.format]].map(([k,v])=>(
                  <div key={k}>
                    <div style={{ fontFamily:T.sans, fontSize:9, fontWeight:700, letterSpacing:'0.06em',
                      textTransform:'uppercase', color:T.w20 }}>{k}</div>
                    <div style={{ fontFamily:T.mono, fontSize:11, color:T.w50, marginTop:2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={e=>{e.stopPropagation();}} style={{ fontFamily:T.sans, fontSize:10,
                  fontWeight:600, color:T.bg, background:sf.color,
                  border:'none', padding:'6px 12px', borderRadius:5, cursor:'pointer', whiteSpace:'nowrap' }}>
                  Assign to Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div style={{ marginTop:20, padding:'12px 16px', background:T.bg2,
        border:`1px solid ${T.border}`, borderRadius:8, display:'flex', gap:10, alignItems:'flex-start' }}>
        <span style={{ fontSize:14, flexShrink:0 }}>📬</span>
        <div style={{ fontFamily:T.sans, fontSize:11, color:T.w30, lineHeight:1.6 }}>
          New soundframes are added to your library automatically with every release.
          You'll receive a notification in your dashboard when the next drop is available.
          <span style={{ color:T.teal, cursor:'pointer' }}> Request a compound-specific soundframe →</span>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   CLINICIAN DASHBOARD — outer shell with nav
══════════════════════════════════════════ */
const ClinicianDashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const elapsed = useTimer('01:14:33', true);

  const navItems = [
    { id:'dashboard', label:'Dashboard',        icon:<DashIcon/> },
    { id:'patients',  label:'Patients',         icon:<UserIcon/> },
    { id:'sessions',  label:'Sessions',         icon:<CheckIcon/> },
    { id:'protocols', label:'Soundframe Library', icon:<WaveIcon/> },
    { id:'new',       label:'New Release',      icon:<PlusIcon/> },
    { id:'settings',  label:'Preferences',      icon:<GearIcon/> },
  ];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', height:'100%', minHeight:0, overflow:'hidden', background:T.bg1 }}>
      {/* Sidebar */}
      <div style={{ background:T.bg1, borderRight:`1px solid ${T.border}`, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'16px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:T.teal,
            boxShadow:`0 0 6px ${T.teal}`, animation:'psyPulse 2s infinite' }} />
          <span style={{ fontFamily:T.sans, fontWeight:700, fontSize:13, color:T.white }}>PsySonics</span>
          <Badge color={T.teal}>v2.1</Badge>
        </div>
        <div style={{ padding:'12px 10px', flex:1 }}>
          <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.1em',
            textTransform:'uppercase', color:T.w20, padding:'0 8px', marginBottom:4 }}>Clinic</div>
          {navItems.slice(0,3).map(n => (
            <div key={n.id} onClick={() => setActiveNav(n.id)} style={{
              display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:6,
              fontFamily:T.sans, fontSize:12, fontWeight:500,
              color: activeNav===n.id ? T.teal : T.w40,
              background: activeNav===n.id ? T.tealGlow : 'transparent',
              border: activeNav===n.id ? `1px solid rgba(45,212,176,0.15)` : '1px solid transparent',
              cursor:'pointer', marginBottom:1, transition:'all 0.15s',
            }}>
              <span style={{ color:activeNav===n.id?T.teal:T.w30, opacity:activeNav===n.id?1:0.7 }}>{n.icon}</span>
              {n.label}
            </div>
          ))}
          <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.1em',
            textTransform:'uppercase', color:T.w20, padding:'12px 8px 4px' }}>Soundframe Library</div>
          {navItems.slice(3,5).map(n => (
            <div key={n.id} onClick={() => setActiveNav(n.id)} style={{
              display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:6,
              fontFamily:T.sans, fontSize:12, fontWeight:500,
              color: activeNav===n.id ? T.teal : T.w40,
              background: activeNav===n.id ? T.tealGlow : 'transparent',
              border: activeNav===n.id ? `1px solid rgba(45,212,176,0.15)` : '1px solid transparent',
              cursor:'pointer', marginBottom:1, transition:'all 0.15s',
            }}>
              <span style={{ opacity:0.7 }}>{n.icon}</span>
              {n.label}
            </div>
          ))}
          <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.1em',
            textTransform:'uppercase', color:T.w20, padding:'12px 8px 4px' }}>Settings</div>
          {navItems.slice(5).map(n => (
            <div key={n.id} onClick={() => setActiveNav(n.id)} style={{
              display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:6,
              fontFamily:T.sans, fontSize:12, fontWeight:500,
              color: activeNav===n.id ? T.teal : T.w40,
              background: activeNav===n.id ? T.tealGlow : 'transparent',
              border: activeNav===n.id ? `1px solid rgba(45,212,176,0.15)` : '1px solid transparent',
              cursor:'pointer', marginBottom:1, transition:'all 0.15s',
            }}>
              <span style={{ opacity:0.7 }}>{n.icon}</span>
              {n.label}
            </div>
          ))}
        </div>
        <div style={{ padding:'12px 10px', borderTop:`1px solid ${T.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:T.tealDark,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:T.sans, fontSize:10, fontWeight:700, color:T.teal, flexShrink:0 }}>SM</div>
            <div>
              <div style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.w70 }}>Dr. S. Mitchell</div>
              <div style={{ fontFamily:T.sans, fontSize:10, color:T.w30 }}>Pearl Psych. Institute</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main area — swap based on nav */}
      <div style={{ overflow:'auto', display:'flex', flexDirection:'column', flex:1, minHeight:0 }}>
        {activeNav === 'dashboard' && <DashboardView elapsed={elapsed} />}
        {activeNav === 'patients'  && <PatientsView />}
        {activeNav === 'sessions'  && <SessionsView />}
        {activeNav === 'protocols' && <SoundframeLibraryView />}
        {activeNav === 'new'       && <NewReleaseView />}
        {activeNav === 'settings'  && (
          <div style={{ display:'flex', flex:1, alignItems:'center', justifyContent:'center',
            flexDirection:'column', gap:12, color:T.w20 }}>
            <div style={{ fontSize:32 }}>⚙</div>
            <div style={{ fontFamily:T.serif, fontSize:22, fontStyle:'italic', color:T.w40 }}>Preferences</div>
            <div style={{ fontFamily:T.sans, fontSize:12, color:T.w20 }}>Coming in the next demo update</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   PATIENT PORTAL
══════════════════════════════════════════ */
const PatientPortal = () => {
  const [activeTrack,setActiveTrack]=useState(PORTAL_TRACKS[0]);
  const [playing,setPlaying]=useState(false);
  const [progress,setProgress]=useState(0);
  useEffect(()=>{ if(!playing)return; const id=setInterval(()=>setProgress(p=>Math.min(100,p+0.15)),200); return()=>clearInterval(id); },[playing]);
  return (
    <div style={{ background:T.bg, minHeight:'100%', padding:24, overflow:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:T.sans, fontWeight:700, fontSize:14, color:T.w70 }}>Your Integration Sounds</div>
          <div style={{ fontFamily:T.sans, fontSize:11, color:T.w30, marginTop:2 }}>Provided by Dr. S. Mitchell · Pearl Psychedelic Institute</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Dot color={T.teal} pulse /><span style={{ fontFamily:T.sans, fontSize:11, color:T.teal, fontWeight:600 }}>2 new tracks available</span>
        </div>
      </div>
      <div style={{ background:`linear-gradient(135deg,${T.tealDark},rgba(13,74,63,0.4))`,
        border:`1px solid rgba(45,212,176,0.25)`, borderRadius:12, padding:20, marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
          <div>
            <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.1em',
              textTransform:'uppercase', color:T.teal, marginBottom:6 }}>
              {playing?'▶ Now Playing':'Selected'}
            </div>
            <div style={{ fontFamily:T.serif, fontSize:18, fontStyle:'italic', color:T.white, lineHeight:1.3 }}>{activeTrack.name}</div>
            <div style={{ fontFamily:T.sans, fontSize:11, color:T.w40, marginTop:3 }}>{activeTrack.sub}</div>
          </div>
          <span style={{ fontFamily:T.mono, fontSize:12, color:T.teal }}>{activeTrack.duration}</span>
        </div>
        <div style={{ marginBottom:12 }}><Waveform color={T.teal} count={52} playing={playing} height={32} /></div>
        <div style={{ height:3, background:'rgba(45,212,176,0.2)', borderRadius:2, marginBottom:14, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:T.teal, borderRadius:2, transition:'width 0.2s' }} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button style={{ width:36, height:36, borderRadius:'50%', border:`1px solid rgba(45,212,176,0.25)`,
            background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polygon points="10,1 2,6 10,11" fill={T.w40}/></svg>
          </button>
          <button onClick={()=>{setPlaying(v=>!v);if(progress>=100)setProgress(0);}} style={{
            width:48, height:48, borderRadius:'50%', background:T.teal, border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            {playing
              ? <svg width="14" height="14"><rect x="0" y="0" width="4" height="12" rx="1" fill={T.bg}/><rect x="8" y="0" width="4" height="12" rx="1" fill={T.bg}/></svg>
              : <svg width="14" height="14" style={{marginLeft:2}}><polygon points="0,0 12,7 0,14" fill={T.bg}/></svg>}
          </button>
          <button style={{ width:36, height:36, borderRadius:'50%', border:`1px solid rgba(45,212,176,0.25)`,
            background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polygon points="2,1 10,6 2,11" fill={T.w40}/></svg>
          </button>
          <div style={{ marginLeft:'auto', fontFamily:T.mono, fontSize:11, color:T.w30 }}>
            {Math.floor(progress/100*20)}:{String(Math.floor((progress/100*20*60)%60)).padStart(2,'0')} / {activeTrack.duration}
          </div>
        </div>
      </div>
      <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:T.w30, marginBottom:8 }}>Your Library</div>
      {PORTAL_TRACKS.map(t=>(
        <div key={t.id} onClick={()=>!t.locked&&(setActiveTrack(t),setPlaying(false),setProgress(0))} style={{
          display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:8, marginBottom:6,
          background:activeTrack.id===t.id?T.tealGlow:T.surface,
          border:`1px solid ${activeTrack.id===t.id?'rgba(45,212,176,0.2)':T.border}`,
          cursor:t.locked?'not-allowed':'pointer', opacity:t.locked?0.45:1, transition:'all 0.15s' }}>
          <div style={{ width:36, height:36, borderRadius:8, background:activeTrack.id===t.id?'rgba(45,212,176,0.2)':T.surface2,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{t.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:T.sans, fontSize:12, fontWeight:600, color:activeTrack.id===t.id?T.white:T.w70 }}>{t.name}</div>
            <div style={{ fontFamily:T.sans, fontSize:10, color:T.w30, marginTop:1 }}>{t.sub}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontFamily:T.mono, fontSize:10, color:T.w30 }}>{t.duration}</span>
            {t.locked
              ? <span style={{ fontSize:13 }}>🔒</span>
              : <div style={{ width:24, height:24, borderRadius:'50%', border:`1px solid ${T.border2}`,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="8" height="9" viewBox="0 0 8 9" style={{marginLeft:1}}><polygon points="0,0 8,4.5 0,9" fill={T.w40}/></svg>
                </div>}
          </div>
        </div>
      ))}
      <div style={{ marginTop:16, padding:'12px 14px', background:T.bg2, border:`1px solid ${T.border}`,
        borderRadius:8, display:'flex', gap:10 }}>
        <span style={{ fontSize:16 }}>📋</span>
        <div>
          <div style={{ fontFamily:T.sans, fontSize:11, fontWeight:700, color:T.w50, marginBottom:3 }}>Note from Dr. S. Mitchell</div>
          <div style={{ fontFamily:T.sans, fontSize:11, color:T.w30, lineHeight:1.55 }}>Use these soundframes in a quiet, comfortable space. Headphones recommended. Ideally within 48 hours of your session.</div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MOBILE APP
══════════════════════════════════════════ */
const MobileApp = () => {
  const [screen,setScreen]=useState('home');
  const [playing,setPlaying]=useState(false);
  const [activeTrack,setActiveTrack]=useState(PORTAL_TRACKS[0]);
  const [progress,setProgress]=useState(0);
  useEffect(()=>{ if(!playing)return; const id=setInterval(()=>setProgress(p=>Math.min(100,p+0.2)),200); return()=>clearInterval(id); },[playing]);
  const goPlay=(track)=>{setActiveTrack(track);setScreen('playing');setPlaying(false);setProgress(0);};
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100%', padding:20, background:T.bg }}>
      <div style={{ width:300, background:T.bg2, borderRadius:36, border:`1px solid ${T.border2}`,
        boxShadow:`0 32px 80px rgba(0,0,0,0.7),0 0 0 1px ${T.border}`, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'14px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontFamily:T.mono, fontSize:11, color:T.w40 }}>9:41</span>
          <div style={{ display:'flex', gap:4, alignItems:'center' }}><span style={{ fontFamily:T.mono, fontSize:10, color:T.w40 }}>●●●</span></div>
        </div>
        <div style={{ padding:'10px 20px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontFamily:T.sans, fontWeight:700, fontSize:16, color:T.white }}>Psy<span style={{color:T.teal}}>Sonics</span></span>
          <div style={{ display:'flex', gap:8 }}>
            {['home','library'].map(s=>(
              <button key={s} onClick={()=>setScreen(s)} style={{ fontFamily:T.sans, fontSize:10, fontWeight:600,
                color:screen===s?T.teal:T.w30, background:screen===s?T.tealGlow:'transparent',
                border:screen===s?`1px solid rgba(45,212,176,0.2)`:'1px solid transparent',
                padding:'4px 10px', borderRadius:20, cursor:'pointer', textTransform:'capitalize', letterSpacing:'0.04em' }}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ flex:1, overflow:'auto' }}>
          {screen==='home'&&(
            <div style={{ padding:16 }}>
              <div style={{ fontFamily:T.sans, fontSize:12, fontWeight:700, color:T.w50, marginBottom:12 }}>Good afternoon.</div>
              <div style={{ background:`linear-gradient(135deg,${T.tealDark},rgba(13,74,63,0.3))`,
                border:`1px solid rgba(45,212,176,0.2)`, borderRadius:14, padding:16, marginBottom:14, textAlign:'center' }}>
                <div style={{ width:80, height:80, borderRadius:14, background:'linear-gradient(135deg,rgba(45,212,176,0.25),rgba(45,212,176,0.05))',
                  border:`1px solid rgba(45,212,176,0.2)`, margin:'0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="16" stroke={T.teal} strokeWidth="1" opacity="0.7"/>
                    <circle cx="18" cy="18" r="9" stroke={T.teal} strokeWidth="0.5" opacity="0.5"/>
                    <circle cx="18" cy="18" r="3" fill={T.teal} opacity="0.5"/>
                  </svg>
                </div>
                <div style={{ fontFamily:T.sans, fontSize:13, fontWeight:700, color:T.w70 }}>Integration Ready</div>
                <div style={{ fontFamily:T.sans, fontSize:10, color:T.teal, margin:'3px 0 14px' }}>Assigned by Dr. S. Mitchell</div>
                <button onClick={()=>goPlay(PORTAL_TRACKS[0])} style={{ fontFamily:T.sans, fontSize:12, fontWeight:600,
                  color:T.bg, background:T.teal, border:'none', padding:'9px 24px', borderRadius:20, cursor:'pointer', width:'100%' }}>
                  Begin Session
                </button>
              </div>
              <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:T.w20, marginBottom:8 }}>Recently Played</div>
              {PORTAL_TRACKS.slice(0,3).map((t,i)=>(
                <div key={t.id} onClick={()=>goPlay(t)} style={{ display:'flex', alignItems:'center', gap:10,
                  padding:'9px 10px', borderRadius:8, marginBottom:4, background:T.surface, border:`1px solid ${T.border}`, cursor:'pointer' }}>
                  <span style={{ fontSize:16, width:28, textAlign:'center' }}>{t.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:T.w70 }}>{t.name}</div>
                    <div style={{ fontFamily:T.sans, fontSize:9, color:T.w30, marginTop:1 }}>{t.duration}</div>
                  </div>
                  <svg width="8" height="9" viewBox="0 0 8 9" style={{marginLeft:1,flexShrink:0}}><polygon points="0,0 8,4.5 0,9" fill={T.w30}/></svg>
                </div>
              ))}
            </div>
          )}
          {screen==='library'&&(
            <div style={{ padding:16 }}>
              <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:T.w20, marginBottom:10 }}>Your Library</div>
              {PORTAL_TRACKS.map(t=>(
                <div key={t.id} onClick={()=>!t.locked&&goPlay(t)} style={{ display:'flex', alignItems:'center', gap:10,
                  padding:'10px', borderRadius:8, marginBottom:6, background:T.surface, border:`1px solid ${T.border}`,
                  cursor:t.locked?'not-allowed':'pointer', opacity:t.locked?0.45:1 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:T.bg3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{t.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:T.sans, fontSize:11, fontWeight:700, color:T.w70 }}>{t.name}</div>
                    <div style={{ fontFamily:T.sans, fontSize:9, color:T.w30 }}>{t.sub} · {t.duration}</div>
                  </div>
                  {t.locked?<span style={{fontSize:12}}>🔒</span>
                    :<div style={{ width:22, height:22, borderRadius:'50%', border:`1px solid ${T.border2}`,
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="7" height="8" viewBox="0 0 8 9" style={{marginLeft:1}}><polygon points="0,0 8,4.5 0,9" fill={T.w40}/></svg>
                    </div>}
                </div>
              ))}
            </div>
          )}
          {screen==='playing'&&(
            <div style={{ padding:20 }}>
              <button onClick={()=>setScreen('home')} style={{ fontFamily:T.sans, fontSize:11, color:T.w40,
                background:'transparent', border:'none', cursor:'pointer', marginBottom:16, display:'flex', alignItems:'center', gap:4 }}>← Back</button>
              <div style={{ textAlign:'center', marginBottom:20 }}>
                <div style={{ width:120, height:120, borderRadius:20,
                  background:'linear-gradient(135deg,rgba(45,212,176,0.3),rgba(45,212,176,0.04))',
                  border:`1px solid rgba(45,212,176,0.25)`, margin:'0 auto 14px',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:40 }}>{activeTrack.icon}</span>
                </div>
                <div style={{ fontFamily:T.sans, fontSize:15, fontWeight:700, color:T.white }}>{activeTrack.name}</div>
                <div style={{ fontFamily:T.sans, fontSize:11, color:T.teal, marginTop:3 }}>Integration Library · PsySonics</div>
              </div>
              <Waveform color={T.teal} count={36} playing={playing} height={28} />
              <div style={{ marginTop:10, marginBottom:14 }}>
                <div style={{ height:3, background:'rgba(45,212,176,0.2)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${progress}%`, background:T.teal, borderRadius:2, transition:'width 0.2s' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                  <span style={{ fontFamily:T.mono, fontSize:9, color:T.w30 }}>
                    {Math.floor(progress/100*20)}:{String(Math.floor((progress/100*20*60)%60)).padStart(2,'0')}
                  </span>
                  <span style={{ fontFamily:T.mono, fontSize:9, color:T.w30 }}>{activeTrack.duration}</span>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20 }}>
                <button style={{ width:36, height:36, borderRadius:'50%', border:`1px solid ${T.border2}`,
                  background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="10,1 2,6 10,11" fill={T.w40}/></svg>
                </button>
                <button onClick={()=>{setPlaying(v=>!v);if(progress>=100)setProgress(0);}} style={{
                  width:52, height:52, borderRadius:'50%', background:T.teal, border:'none',
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 0 20px rgba(45,212,176,0.3)` }}>
                  {playing
                    ? <svg width="14" height="14"><rect x="0" y="0" width="4.5" height="14" rx="1.5" fill={T.bg}/><rect x="9.5" y="0" width="4.5" height="14" rx="1.5" fill={T.bg}/></svg>
                    : <svg width="14" height="14" style={{marginLeft:2}}><polygon points="0,0 14,7 0,14" fill={T.bg}/></svg>}
                </button>
                <button style={{ width:36, height:36, borderRadius:'50%', border:`1px solid ${T.border2}`,
                  background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="2,1 10,6 2,11" fill={T.w40}/></svg>
                </button>
              </div>
              <div style={{ marginTop:16, padding:'10px 12px', background:T.bg3, borderRadius:8, border:`1px solid ${T.border}` }}>
                <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, color:T.w40, marginBottom:3 }}>Offline mode active</div>
                <div style={{ fontFamily:T.sans, fontSize:10, color:T.w20 }}>This track is downloaded. No Wi-Fi required.</div>
              </div>
            </div>
          )}
        </div>
        <div style={{ borderTop:`1px solid ${T.border}`, padding:'10px 20px 20px', display:'flex', justifyContent:'space-around' }}>
          {[{id:'home',icon:'⊞',label:'Home'},{id:'library',icon:'♫',label:'Library'},{id:'settings',icon:'⚙',label:'Settings'}].map(n=>(
            <button key={n.id} onClick={()=>setScreen(n.id)} style={{
              background:'transparent', border:'none', cursor:'pointer',
              display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              color:screen===n.id?T.teal:T.w30 }}>
              <span style={{ fontSize:16 }}>{n.icon}</span>
              <span style={{ fontFamily:T.sans, fontSize:9, fontWeight:600, letterSpacing:'0.04em' }}>{n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Icon helpers ── */
const DashIcon  = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg>;
const UserIcon  = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="5" r="3"/><path d="M1 13c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round"/></svg>;
const CheckIcon = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="5"/><path d="M4 7l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const WaveIcon  = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 7c1-3 2-3 3 0s2 3 3 0 2-3 3 0" strokeLinecap="round"/></svg>;
const PlusIcon  = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="10" height="10" rx="2"/><path d="M5 7h4M7 5v4" strokeLinecap="round"/></svg>;
const GearIcon  = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="2"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2" strokeLinecap="round"/></svg>;

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function App() {
  const [surface, setSurface] = useState('clinician');
  const tabs = [
    { id:'clinician', label:'Clinician Dashboard', sub:'Session management + Soundframe™ protocol control' },
    { id:'portal',    label:'Patient Portal',      sub:'Integration soundframe access' },
    { id:'mobile',    label:'Mobile App',          sub:'iOS · Offline capable' },
  ];
  const urls = {
    clinician:'app.psysonics.co/dashboard',
    portal:'portal.psysonics.co/integration',
    mobile:'PsySonics iOS · Offline',
  };
  return (
    <div style={{ fontFamily:T.sans, background:T.bg, height:'100vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <FontLoader />
      <style>{`
        @keyframes psyPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(45,212,176,0.2);border-radius:2px}
        input::placeholder{color:rgba(240,244,242,0.2)}
      `}</style>

      {/* Top nav */}
      <div style={{ height:54, borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center',
        padding:'0 20px', background:'rgba(10,12,11,0.97)', backdropFilter:'blur(20px)',
        justifyContent:'space-between', flexShrink:0, gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:28, height:28, border:`1.5px solid ${T.teal}`, borderRadius:5,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ display:'flex', gap:2, height:12, alignItems:'center' }}>
              {[3,7,11,7,5,9,3].map((h,i)=>(
                <span key={i} style={{ display:'block', width:2, height:h, borderRadius:1, background:T.teal }} />
              ))}
            </div>
          </div>
          <span style={{ fontFamily:T.sans, fontWeight:700, fontSize:14, color:T.white }}>
            Psy<span style={{color:T.teal}}>Sonics</span>
          </span>
          <Badge color={T.gold}>Demo</Badge>
        </div>
        <div style={{ display:'flex', gap:5 }}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setSurface(t.id)} style={{
              fontFamily:T.sans, fontSize:11, fontWeight:600,
              padding:'6px 14px', borderRadius:5, cursor:'pointer', transition:'all 0.2s',
              color: surface===t.id?T.teal:T.w40,
              background: surface===t.id?T.tealGlow:'transparent',
              border: `1px solid ${surface===t.id?'rgba(45,212,176,0.2)':T.border}`,
              whiteSpace:'nowrap',
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:T.teal,
            animation:'psyPulse 2s infinite', display:'inline-block' }} />
          <span style={{ fontFamily:T.mono, fontSize:10, color:T.w30 }}>psysonics.co</span>
        </div>
      </div>

      {/* Surface label */}
      <div style={{ height:34, background:T.bg1, borderBottom:`1px solid ${T.border}`,
        display:'flex', alignItems:'center', padding:'0 20px', gap:10, flexShrink:0 }}>
        {tabs.filter(t=>t.id===surface).map(t=>(
          <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontFamily:T.sans, fontSize:12, fontWeight:700, color:T.white }}>{t.label}</span>
            <span style={{ fontFamily:T.sans, fontSize:11, color:T.w30 }}>·</span>
            <span style={{ fontFamily:T.sans, fontSize:11, color:T.w40 }}>{t.sub}</span>
          </div>
        ))}
      </div>

      {/* Browser chrome + surface */}
      <div style={{ flex:1, padding:16, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ flex:1, background:T.bg2, border:`1px solid ${T.border2}`, borderRadius:12,
          overflow:'hidden', display:'flex', flexDirection:'column',
          boxShadow:`0 0 0 1px rgba(45,212,176,0.05),0 24px 80px rgba(0,0,0,0.6)` }}>
          <div style={{ height:38, background:T.bg3, borderBottom:`1px solid ${T.border}`,
            display:'flex', alignItems:'center', padding:'0 13px', gap:12, flexShrink:0 }}>
            <div style={{ display:'flex', gap:5 }}>
              {['#ff5f56','#ffbd2e','#27c93f'].map((c,i)=>(
                <div key={i} style={{ width:9, height:9, borderRadius:'50%', background:c }} />
              ))}
            </div>
            <div style={{ flex:1, maxWidth:320, margin:'0 auto', background:T.bg2,
              border:`1px solid ${T.border}`, borderRadius:5, padding:'4px 10px',
              display:'flex', alignItems:'center', gap:6,
              fontFamily:T.mono, fontSize:10, color:T.w40 }}>
              <span style={{ color:T.teal, fontSize:10 }}>🔒</span>
              {urls[surface]}
            </div>
          </div>
          <div style={{ flex:1, overflow:'hidden' }}>
            {surface==='clinician' && <ClinicianDashboard />}
            {surface==='portal'    && <PatientPortal />}
            {surface==='mobile'    && <MobileApp />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ height:32, borderTop:`1px solid ${T.border}`, display:'flex', alignItems:'center',
        padding:'0 20px', justifyContent:'space-between', flexShrink:0 }}>
        <span style={{ fontFamily:T.sans, fontSize:10, color:T.w20 }}>© 2025 PsySonics, PBC · Asheville, NC · SDVOSB</span>
        <div style={{ display:'flex', gap:14 }}>
          {['Patent-Pending Technology','Dolby Atmos Spatial Audio','SDVOSB Certified'].map(s=>(
            <span key={s} style={{ fontFamily:T.sans, fontSize:9, fontWeight:600, color:T.w20, letterSpacing:'0.04em' }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
