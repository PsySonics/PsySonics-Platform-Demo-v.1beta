import { useState, useEffect, useRef } from 'react';

/* ── Google Fonts ── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  `}</style>
);

/* ── Design tokens ── */
const T = {
  bg: '#0a0c0b',
  bg1: '#0f1210',
  bg2: '#141918',
  bg3: '#1c2220',
  surface: '#1e2522',
  surface2: '#252d2a',
  teal: '#2dd4b0',
  tealDark: '#0d4a3f',
  tealGlow: 'rgba(45,212,176,0.15)',
  gold: '#c9a96e',
  goldPale: 'rgba(201,169,110,0.12)',
  red: '#c06060',
  white: '#f0f4f2',
  w70: 'rgba(240,244,242,0.7)',
  w50: 'rgba(240,244,242,0.5)',
  w40: 'rgba(240,244,242,0.4)',
  w30: 'rgba(240,244,242,0.3)',
  w20: 'rgba(240,244,242,0.2)',
  w10: 'rgba(240,244,242,0.1)',
  w05: 'rgba(240,244,242,0.05)',
  border: 'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.12)',
  mono: "'JetBrains Mono', monospace",
  serif: "'Instrument Serif', serif",
  sans: "'Syne', sans-serif",
};

/* ── Fake data ── */
const PATIENTS = [
  {
    id: 1,
    initials: 'A.R.',
    name: 'Patient A.R.',
    protocol: 'KETAMINE-90',
    room: 'Room 2',
    status: 'live',
    elapsed: '01:14:33',
    nextSession: null,
    portalActive: true,
    sessions: 7,
  },
  {
    id: 2,
    initials: 'M.T.',
    name: 'Patient M.T.',
    protocol: 'PSILOCYBIN-360',
    room: 'Room 1',
    status: 'scheduled',
    time: '2:30 PM',
    portalActive: true,
    sessions: 3,
  },
  {
    id: 3,
    initials: 'D.K.',
    name: 'Patient D.K.',
    protocol: 'MDMA-PTSD-240',
    room: 'Room 3',
    status: 'scheduled',
    time: '4:00 PM',
    portalActive: false,
    sessions: 5,
  },
  {
    id: 4,
    initials: 'S.L.',
    name: 'Patient S.L.',
    protocol: 'KETAMINE-60',
    room: 'Room 1',
    status: 'complete',
    time: '9:00 AM',
    portalActive: true,
    sessions: 12,
  },
  {
    id: 5,
    initials: 'J.W.',
    name: 'Patient J.W.',
    protocol: 'PSILOCYBIN-360',
    room: 'Room 2',
    status: 'complete',
    time: '11:00 AM',
    portalActive: true,
    sessions: 2,
  },
];

const PROTOCOLS = [
  {
    id: 'k90',
    compound: 'ketamine',
    label: 'KETAMINE',
    name: 'Dissociative Grounding Arc',
    duration: '90 min',
    phases: 2,
    icon: '🌊',
    color: T.teal,
    colorGlow: 'rgba(45,212,176,0.15)',
    colorBorder: 'rgba(45,212,176,0.2)',
  },
  {
    id: 'p360',
    compound: 'psilocybin',
    label: 'PSILOCYBIN',
    name: 'Full-Spectrum Journey Arc',
    duration: '360 min',
    phases: 3,
    icon: '✦',
    color: T.gold,
    colorGlow: 'rgba(201,169,110,0.12)',
    colorBorder: 'rgba(201,169,110,0.2)',
  },
  {
    id: 'm240',
    compound: 'mdma',
    label: 'MDMA / PTSD',
    name: 'Trauma-Informed MAPS Arc',
    duration: '240 min',
    phases: 4,
    icon: '◎',
    color: T.red,
    colorGlow: 'rgba(192,96,96,0.12)',
    colorBorder: 'rgba(192,96,96,0.2)',
  },
  {
    id: 'k60',
    compound: 'ketamine',
    label: 'KETAMINE',
    name: 'Short Induction Arc',
    duration: '60 min',
    phases: 2,
    icon: '🌊',
    color: T.teal,
    colorGlow: 'rgba(45,212,176,0.15)',
    colorBorder: 'rgba(45,212,176,0.2)',
  },
  {
    id: 'int',
    compound: 'integration',
    label: 'INTEGRATION',
    name: 'Gentle Return — Home Series',
    duration: '20 min',
    phases: 1,
    icon: '◌',
    color: T.w40,
    colorGlow: 'rgba(240,244,242,0.05)',
    colorBorder: T.border,
  },
];

const PORTAL_TRACKS = [
  {
    id: 1,
    icon: '🌊',
    name: 'Ketamine Integration — Short',
    sub: 'Post-session grounding',
    duration: '20 min',
    locked: false,
  },
  {
    id: 2,
    icon: '◌',
    name: 'Gentle Return',
    sub: 'Integration · Home use',
    duration: '15 min',
    locked: false,
  },
  {
    id: 3,
    icon: '✦',
    name: 'Deep Rest Soundframe',
    sub: 'Sleep support',
    duration: '30 min',
    locked: false,
  },
  {
    id: 4,
    icon: '◎',
    name: 'MDMA Integration Arc',
    sub: 'PTSD follow-up',
    duration: '25 min',
    locked: true,
  },
];

/* ── Shared micro-components ── */
const Badge = ({ children, color = T.teal, bg }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 20,
      fontFamily: T.sans,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color,
      background: bg || `${color}22`,
      border: `1px solid ${color}40`,
    }}
  >
    {children}
  </span>
);

const Dot = ({ color = T.teal, pulse }) => (
  <span
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      flexShrink: 0,
      background: color,
      boxShadow: pulse ? `0 0 6px ${color}` : 'none',
      animation: pulse ? 'psyPulse 1.5s ease-in-out infinite' : 'none',
    }}
  />
);

const MonoVal = ({ children, size = 22, color = T.white }) => (
  <span
    style={{
      fontFamily: T.mono,
      fontSize: size,
      fontWeight: 500,
      color,
      lineHeight: 1,
    }}
  >
    {children}
  </span>
);

const Label = ({ children }) => (
  <div
    style={{
      fontFamily: T.sans,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: T.teal,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16,
    }}
  >
    <span
      style={{ display: 'block', width: 20, height: 1, background: T.teal }}
    />
    {children}
  </div>
);

const Card = ({ children, style, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: T.bg2,
      border: `1px solid ${active ? 'rgba(45,212,176,0.25)' : T.border}`,
      borderRadius: 10,
      overflow: 'hidden',
      background: active ? T.tealGlow : T.bg2,
      transition: 'all 0.2s',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── Animated waveform ── */
const Waveform = ({
  color = T.teal,
  count = 40,
  playing = false,
  height = 28,
}) => {
  const [bars] = useState(() =>
    Array.from({ length: count }, (_, i) => {
      const hs = [
        6, 10, 14, 20, 16, 10, 14, 18, 22, 16, 10, 14, 18, 14, 10, 8, 14, 20,
        16, 12, 8, 12, 18, 22, 18, 12, 8, 14, 18, 14, 10, 6, 10, 16, 20, 16, 10,
        8, 12, 16,
      ];
      return hs[i % hs.length];
    })
  );
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height }}>
      {bars.map((h, i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: 2.5,
            borderRadius: 2,
            height: playing
              ? Math.max(
                  3,
                  h * (0.5 + 0.5 * Math.abs(Math.sin((i + tick * 0.3) * 0.4)))
                )
              : h,
            background: color,
            opacity: playing
              ? i < count * 0.4
                ? 1
                : 0.35
              : i < count * 0.4
              ? 0.9
              : 0.25,
            transition: playing ? 'height 0.08s ease' : 'none',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
};

/* ── Elapsed timer ── */
const useTimer = (initial = '01:14:33', running = true) => {
  const [secs, setSecs] = useState(() => {
    const [h, m, s] = initial.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  });
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

/* ═══════════════════════════════════
   SURFACE 1: CLINICIAN DASHBOARD
═══════════════════════════════════ */
const ClinicianDashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [selectedProtocol, setSelectedProtocol] = useState(PROTOCOLS[0]);
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0]);
  const [playing, setPlaying] = useState(true);
  const [activeView, setActiveView] = useState('sessions'); // sessions | roster | protocols
  const elapsed = useTimer('01:14:33', true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashIcon /> },
    { id: 'patients', label: 'Patients', icon: <UserIcon /> },
    { id: 'sessions', label: 'Sessions', icon: <CheckIcon /> },
    { id: 'protocols', label: 'Soundframe Library', icon: <WaveIcon /> },
    { id: 'new', label: 'New Release', icon: <PlusIcon /> },
    { id: 'settings', label: 'Preferences', icon: <GearIcon /> },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        height: '100%',
        background: T.bg1,
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          background: T.bg1,
          borderRight: `1px solid ${T.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 16px 16px',
            borderBottom: `1px solid ${T.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: T.teal,
              boxShadow: `0 0 6px ${T.teal}`,
              animation: 'psyPulse 2s infinite',
            }}
          />
          <span
            style={{
              fontFamily: T.sans,
              fontWeight: 700,
              fontSize: 13,
              color: T.white,
            }}
          >
            PsySonics
          </span>
          <Badge color={T.teal}>v2.1</Badge>
        </div>
        <div style={{ padding: '12px 10px', flex: 1 }}>
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: T.w20,
              padding: '0 8px',
              marginBottom: 4,
            }}
          >
            Clinic
          </div>
          {navItems.slice(0, 3).map((n) => (
            <div
              key={n.id}
              onClick={() => setActiveNav(n.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '8px 10px',
                borderRadius: 6,
                fontFamily: T.sans,
                fontSize: 12,
                fontWeight: 500,
                color: activeNav === n.id ? T.teal : T.w40,
                background: activeNav === n.id ? T.tealGlow : 'transparent',
                border:
                  activeNav === n.id
                    ? `1px solid rgba(45,212,176,0.15)`
                    : '1px solid transparent',
                cursor: 'pointer',
                marginBottom: 1,
                transition: 'all 0.15s',
              }}
            >
              <span
                style={{
                  color: activeNav === n.id ? T.teal : T.w30,
                  opacity: activeNav === n.id ? 1 : 0.7,
                }}
              >
                {n.icon}
              </span>
              {n.label}
            </div>
          ))}
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: T.w20,
              padding: '12px 8px 4px',
            }}
          >
            Soundframe Library
          </div>
          {navItems.slice(3, 5).map((n) => (
            <div
              key={n.id}
              onClick={() => setActiveNav(n.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '8px 10px',
                borderRadius: 6,
                fontFamily: T.sans,
                fontSize: 12,
                fontWeight: 500,
                color: activeNav === n.id ? T.teal : T.w40,
                background: activeNav === n.id ? T.tealGlow : 'transparent',
                border:
                  activeNav === n.id
                    ? `1px solid rgba(45,212,176,0.15)`
                    : '1px solid transparent',
                cursor: 'pointer',
                marginBottom: 1,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ opacity: 0.7 }}>{n.icon}</span>
              {n.label}
            </div>
          ))}
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: T.w20,
              padding: '12px 8px 4px',
            }}
          >
            Settings
          </div>
          {navItems.slice(5).map((n) => (
            <div
              key={n.id}
              onClick={() => setActiveNav(n.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '8px 10px',
                borderRadius: 6,
                fontFamily: T.sans,
                fontSize: 12,
                fontWeight: 500,
                color: activeNav === n.id ? T.teal : T.w40,
                background: activeNav === n.id ? T.tealGlow : 'transparent',
                border:
                  activeNav === n.id
                    ? `1px solid rgba(45,212,176,0.15)`
                    : '1px solid transparent',
                cursor: 'pointer',
                marginBottom: 1,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ opacity: 0.7 }}>{n.icon}</span>
              {n.label}
            </div>
          ))}
        </div>
        <div
          style={{ padding: '12px 10px', borderTop: `1px solid ${T.border}` }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: T.tealDark,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: T.sans,
                fontSize: 10,
                fontWeight: 700,
                color: T.teal,
                flexShrink: 0,
              }}
            >
              SM
            </div>
            <div>
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.w70,
                }}
              >
                Dr. S. Mitchell
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 10, color: T.w30 }}>
                Pearl Psych. Institute
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: 24, overflow: 'auto', background: T.bg1 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 16,
                fontWeight: 700,
                color: T.white,
              }}
            >
              Today's Sessions
            </div>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 11,
                color: T.w40,
                marginTop: 2,
              }}
            >
              Friday, June 6 · 3 scheduled · 1 active
            </div>
          </div>
          <button
            style={{
              fontFamily: T.sans,
              fontSize: 11,
              fontWeight: 600,
              color: T.bg,
              background: T.teal,
              border: 'none',
              padding: '7px 14px',
              borderRadius: 5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 12 }}>+</span> New Session
          </button>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 10,
            marginBottom: 18,
          }}
        >
          {[
            {
              label: 'Active now',
              val: '1',
              delta: 'Ketamine protocol',
              deltaColor: T.teal,
            },
            {
              label: 'This month',
              val: '38',
              delta: 'sessions',
              deltaColor: T.w30,
            },
            {
              label: 'Patients',
              val: '14',
              delta: 'active roster',
              deltaColor: T.w30,
            },
            {
              label: 'Portal access',
              val: '11',
              delta: 'patients active',
              deltaColor: T.w30,
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: T.w30,
                  marginBottom: 6,
                }}
              >
                {s.label}
              </div>
              <MonoVal color={i === 0 ? T.teal : T.white}>{s.val}</MonoVal>
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 10,
                  color: s.deltaColor,
                  marginTop: 4,
                }}
              >
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
        >
          {/* Session queue */}
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                borderBottom: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: T.sans,
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.w70,
                  letterSpacing: '0.04em',
                }}
              >
                Session Queue
              </span>
              <span
                style={{
                  fontFamily: T.sans,
                  fontSize: 10,
                  color: T.teal,
                  cursor: 'pointer',
                }}
              >
                View all →
              </span>
            </div>
            {PATIENTS.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr auto',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 14px',
                  borderBottom: `1px solid ${T.border}`,
                  cursor: 'pointer',
                  background:
                    selectedPatient.id === p.id ? T.tealGlow : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <Dot
                  color={
                    p.status === 'live'
                      ? T.teal
                      : p.status === 'scheduled'
                      ? T.gold
                      : T.w20
                  }
                  pulse={p.status === 'live'}
                />
                <div>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 11,
                      fontWeight: 600,
                      color: T.w70,
                    }}
                  >
                    {p.name} — {p.room}
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 9,
                      color: T.w30,
                      marginTop: 1,
                    }}
                  >
                    {p.protocol}
                    {p.status === 'live'
                      ? ` · ${elapsed} elapsed`
                      : p.time
                      ? ` · ${p.time}`
                      : ''}
                  </div>
                </div>
                <Badge
                  color={
                    p.status === 'live'
                      ? T.teal
                      : p.status === 'scheduled'
                      ? T.gold
                      : T.w30
                  }
                >
                  {p.status === 'live'
                    ? 'LIVE'
                    : p.status === 'scheduled'
                    ? 'SCHED'
                    : 'DONE'}
                </Badge>
              </div>
            ))}
          </div>

          {/* Protocol selector + transport */}
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                borderBottom: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: T.sans,
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.w70,
                  letterSpacing: '0.04em',
                }}
              >
                Soundframe™ Protocol
              </span>
              <span
                style={{
                  fontFamily: T.sans,
                  fontSize: 10,
                  color: T.teal,
                  cursor: 'pointer',
                }}
              >
                Full library →
              </span>
            </div>
            <div style={{ padding: 8 }}>
              {PROTOCOLS.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProtocol(p)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 6,
                    marginBottom: 2,
                    background:
                      selectedProtocol.id === p.id
                        ? p.colorGlow
                        : 'transparent',
                    border:
                      selectedProtocol.id === p.id
                        ? `1px solid ${p.colorBorder}`
                        : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      flexShrink: 0,
                      background: `${p.color}18`,
                    }}
                  >
                    {p.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 11,
                        fontWeight: 700,
                        color: T.w70,
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 9,
                        color: T.w30,
                        marginTop: 1,
                      }}
                    >
                      {p.phases} phases · {p.duration}
                    </div>
                  </div>
                  <span
                    style={{ fontFamily: T.mono, fontSize: 10, color: T.w30 }}
                  >
                    {p.duration}
                  </span>
                </div>
              ))}
            </div>
            {/* Transport */}
            <div
              style={{
                marginTop: 'auto',
                padding: '10px 14px',
                borderTop: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <button
                onClick={() => setPlaying((v) => !v)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: T.teal,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {playing ? (
                  <svg width="10" height="11" viewBox="0 0 10 11">
                    <rect
                      x="0"
                      y="0"
                      width="3.5"
                      height="11"
                      rx="1"
                      fill={T.bg}
                    />
                    <rect
                      x="6.5"
                      y="0"
                      width="3.5"
                      height="11"
                      rx="1"
                      fill={T.bg}
                    />
                  </svg>
                ) : (
                  <svg
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    style={{ marginLeft: 1 }}
                  >
                    <polygon points="0,0 10,6 0,12" fill={T.bg} />
                  </svg>
                )}
              </button>
              <div style={{ flex: 1 }}>
                <Waveform
                  color={selectedProtocol.color}
                  count={44}
                  playing={playing}
                  height={24}
                />
              </div>
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: T.w30,
                  flexShrink: 0,
                }}
              >
                {elapsed}
              </span>
            </div>
          </div>
        </div>

        {/* Selected patient detail */}
        <div
          style={{
            marginTop: 10,
            background: T.bg2,
            border: `1px solid ${T.border2}`,
            borderRadius: 8,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: T.tealDark,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: T.sans,
                fontSize: 12,
                fontWeight: 700,
                color: T.teal,
                flexShrink: 0,
              }}
            >
              {selectedPatient.initials}
            </div>
            <div>
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.w70,
                }}
              >
                {selectedPatient.name}
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: T.w30,
                  marginTop: 2,
                }}
              >
                {selectedPatient.protocol} · {selectedPatient.sessions} sessions
                total
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: T.sans, fontSize: 11, color: T.w30 }}>
              Portal access:
            </span>
            <Badge color={selectedPatient.portalActive ? T.teal : T.w30}>
              {selectedPatient.portalActive ? 'Active' : 'Inactive'}
            </Badge>
            {!selectedPatient.portalActive && (
              <button
                style={{
                  fontFamily: T.sans,
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.bg,
                  background: T.teal,
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: 5,
                  cursor: 'pointer',
                }}
              >
                Invite to Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════
   SURFACE 2: PATIENT PORTAL
═══════════════════════════════════ */
const PatientPortal = () => {
  const [activeTrack, setActiveTrack] = useState(PORTAL_TRACKS[0]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setProgress((p) => Math.min(100, p + 0.15)),
      200
    );
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div
      style={{
        background: T.bg,
        minHeight: '100%',
        padding: 24,
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: T.sans,
              fontWeight: 700,
              fontSize: 14,
              color: T.w70,
            }}
          >
            Your Integration Sounds
          </div>
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 11,
              color: T.w30,
              marginTop: 2,
            }}
          >
            Provided by Dr. S. Mitchell · Pearl Psychedelic Institute
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Dot color={T.teal} pulse />
          <span
            style={{
              fontFamily: T.sans,
              fontSize: 11,
              color: T.teal,
              fontWeight: 600,
            }}
          >
            2 new tracks available
          </span>
        </div>
      </div>

      {/* Now playing card */}
      <div
        style={{
          background: `linear-gradient(135deg, ${T.tealDark}, rgba(13,74,63,0.4))`,
          border: `1px solid rgba(45,212,176,0.25)`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: T.teal,
                marginBottom: 6,
              }}
            >
              {playing ? '▶ Now Playing' : 'Selected'}
            </div>
            <div
              style={{
                fontFamily: T.serif,
                fontSize: 18,
                fontStyle: 'italic',
                color: T.white,
                lineHeight: 1.3,
              }}
            >
              {activeTrack.name}
            </div>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 11,
                color: T.w40,
                marginTop: 3,
              }}
            >
              {activeTrack.sub}
            </div>
          </div>
          <span style={{ fontFamily: T.mono, fontSize: 12, color: T.teal }}>
            {activeTrack.duration}
          </span>
        </div>

        {/* Waveform display */}
        <div style={{ marginBottom: 12 }}>
          <Waveform color={T.teal} count={52} playing={playing} height={32} />
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 3,
            background: 'rgba(45,212,176,0.2)',
            borderRadius: 2,
            marginBottom: 14,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: T.teal,
              borderRadius: 2,
              transition: 'width 0.2s',
            }}
          />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `1px solid rgba(45,212,176,0.25)`,
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <polygon points="10,1 2,6 10,11" fill={T.w40} />
            </svg>
          </button>
          <button
            onClick={() => {
              setPlaying((v) => !v);
              if (progress >= 100) setProgress(0);
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: T.teal,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 12 12">
                <rect x="0" y="0" width="4" height="12" rx="1" fill={T.bg} />
                <rect x="8" y="0" width="4" height="12" rx="1" fill={T.bg} />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 12 14"
                style={{ marginLeft: 2 }}
              >
                <polygon points="0,0 12,7 0,14" fill={T.bg} />
              </svg>
            )}
          </button>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `1px solid rgba(45,212,176,0.25)`,
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <polygon points="2,1 10,6 2,11" fill={T.w40} />
            </svg>
          </button>
          <div
            style={{
              marginLeft: 'auto',
              fontFamily: T.mono,
              fontSize: 11,
              color: T.w30,
            }}
          >
            {Math.floor((progress / 100) * 20)}:
            {String(Math.floor(((progress / 100) * 20 * 60) % 60)).padStart(
              2,
              '0'
            )}
            {' / '}
            {activeTrack.duration}
          </div>
        </div>
      </div>

      {/* Track list */}
      <div
        style={{
          fontFamily: T.sans,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: T.w30,
          marginBottom: 8,
        }}
      >
        Your Library
      </div>
      {PORTAL_TRACKS.map((t) => (
        <div
          key={t.id}
          onClick={() =>
            !t.locked && (setActiveTrack(t), setPlaying(false), setProgress(0))
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 8,
            marginBottom: 6,
            background: activeTrack.id === t.id ? T.tealGlow : T.surface,
            border: `1px solid ${
              activeTrack.id === t.id ? 'rgba(45,212,176,0.2)' : T.border
            }`,
            cursor: t.locked ? 'not-allowed' : 'pointer',
            opacity: t.locked ? 0.45 : 1,
            transition: 'all 0.15s',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background:
                activeTrack.id === t.id ? 'rgba(45,212,176,0.2)' : T.surface2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {t.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 12,
                fontWeight: 600,
                color: activeTrack.id === t.id ? T.white : T.w70,
              }}
            >
              {t.name}
            </div>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 10,
                color: T.w30,
                marginTop: 1,
              }}
            >
              {t.sub}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.w30 }}>
              {t.duration}
            </span>
            {t.locked ? (
              <span style={{ fontSize: 13 }}>🔒</span>
            ) : (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: `1px solid ${T.border2}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="8"
                  height="9"
                  viewBox="0 0 8 9"
                  style={{ marginLeft: 1 }}
                >
                  <polygon points="0,0 8,4.5 0,9" fill={T.w40} />
                </svg>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Clinician note */}
      <div
        style={{
          marginTop: 16,
          padding: '12px 14px',
          background: T.bg2,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          display: 'flex',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 16 }}>📋</span>
        <div>
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 11,
              fontWeight: 700,
              color: T.w50,
              marginBottom: 3,
            }}
          >
            Note from Dr. S. Mitchell
          </div>
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 11,
              color: T.w30,
              lineHeight: 1.55,
            }}
          >
            Use these soundframes in a quiet, comfortable space. Headphones
            recommended. Ideally within 48 hours of your session.
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════
   SURFACE 3: MOBILE APP
═══════════════════════════════════ */
const MobileApp = () => {
  const [screen, setScreen] = useState('home'); // home | library | playing | settings
  const [playing, setPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState(PORTAL_TRACKS[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setProgress((p) => Math.min(100, p + 0.2)),
      200
    );
    return () => clearInterval(id);
  }, [playing]);

  const goPlay = (track) => {
    setActiveTrack(track);
    setScreen('playing');
    setPlaying(false);
    setProgress(0);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        padding: 20,
        background: T.bg,
      }}
    >
      <div
        style={{
          width: 300,
          background: T.bg2,
          borderRadius: 36,
          border: `1px solid ${T.border2}`,
          boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${T.border}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            padding: '14px 24px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.w40 }}>
            9:41
          </span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.w40 }}>
              ●●●
            </span>
          </div>
        </div>

        {/* App header */}
        <div
          style={{
            padding: '10px 20px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <span
            style={{
              fontFamily: T.sans,
              fontWeight: 700,
              fontSize: 16,
              color: T.white,
            }}
          >
            Psy<span style={{ color: T.teal }}>Sonics</span>
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['home', 'library'].map((s) => (
              <button
                key={s}
                onClick={() => setScreen(s)}
                style={{
                  fontFamily: T.sans,
                  fontSize: 10,
                  fontWeight: 600,
                  color: screen === s ? T.teal : T.w30,
                  background: screen === s ? T.tealGlow : 'transparent',
                  border:
                    screen === s
                      ? `1px solid rgba(45,212,176,0.2)`
                      : '1px solid transparent',
                  padding: '4px 10px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  letterSpacing: '0.04em',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Screen content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* HOME screen */}
          {screen === 'home' && (
            <div style={{ padding: 16 }}>
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.w50,
                  marginBottom: 12,
                  letterSpacing: '0.04em',
                }}
              >
                Good afternoon.
              </div>
              {/* Featured */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${T.tealDark}, rgba(13,74,63,0.3))`,
                  border: `1px solid rgba(45,212,176,0.2)`,
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 14,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 14,
                    background:
                      'linear-gradient(135deg, rgba(45,212,176,0.25), rgba(45,212,176,0.05))',
                    border: `1px solid rgba(45,212,176,0.2)`,
                    margin: '0 auto 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      stroke={T.teal}
                      strokeWidth="1"
                      opacity="0.7"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="9"
                      stroke={T.teal}
                      strokeWidth="0.5"
                      opacity="0.5"
                    />
                    <circle cx="18" cy="18" r="3" fill={T.teal} opacity="0.5" />
                  </svg>
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.w70,
                  }}
                >
                  Integration Ready
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 10,
                    color: T.teal,
                    margin: '3px 0 14px',
                  }}
                >
                  Assigned by Dr. S. Mitchell
                </div>
                <button
                  onClick={() => goPlay(PORTAL_TRACKS[0])}
                  style={{
                    fontFamily: T.sans,
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.bg,
                    background: T.teal,
                    border: 'none',
                    padding: '9px 24px',
                    borderRadius: 20,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Begin Session
                </button>
              </div>

              {/* Recent */}
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: T.w20,
                  marginBottom: 8,
                }}
              >
                Recently Played
              </div>
              {PORTAL_TRACKS.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  onClick={() => goPlay(t)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 10px',
                    borderRadius: 8,
                    marginBottom: 4,
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{ fontSize: 16, width: 28, textAlign: 'center' }}
                  >
                    {t.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 11,
                        fontWeight: 600,
                        color: T.w70,
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 9,
                        color: T.w30,
                        marginTop: 1,
                      }}
                    >
                      {t.duration}
                    </div>
                  </div>
                  <svg
                    width="8"
                    height="9"
                    viewBox="0 0 8 9"
                    style={{ marginLeft: 1, flexShrink: 0 }}
                  >
                    <polygon points="0,0 8,4.5 0,9" fill={T.w30} />
                  </svg>
                </div>
              ))}
            </div>
          )}

          {/* LIBRARY screen */}
          {screen === 'library' && (
            <div style={{ padding: 16 }}>
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: T.w20,
                  marginBottom: 10,
                }}
              >
                Your Library
              </div>
              {PORTAL_TRACKS.map((t) => (
                <div
                  key={t.id}
                  onClick={() => !t.locked && goPlay(t)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px',
                    borderRadius: 8,
                    marginBottom: 6,
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    cursor: t.locked ? 'not-allowed' : 'pointer',
                    opacity: t.locked ? 0.45 : 1,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: T.bg3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {t.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 11,
                        fontWeight: 700,
                        color: T.w70,
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{ fontFamily: T.sans, fontSize: 9, color: T.w30 }}
                    >
                      {t.sub} · {t.duration}
                    </div>
                  </div>
                  {t.locked ? (
                    <span style={{ fontSize: 12 }}>🔒</span>
                  ) : (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: `1px solid ${T.border2}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="7"
                        height="8"
                        viewBox="0 0 8 9"
                        style={{ marginLeft: 1 }}
                      >
                        <polygon points="0,0 8,4.5 0,9" fill={T.w40} />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              <div
                style={{
                  padding: '10px 12px',
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  marginTop: 6,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: 12 }}>🔒</span>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 10,
                    color: T.w30,
                    lineHeight: 1.5,
                  }}
                >
                  Some tracks are unlocked by your clinician. Contact Dr. S.
                  Mitchell to request access.
                </div>
              </div>
            </div>
          )}

          {/* NOW PLAYING screen */}
          {screen === 'playing' && (
            <div style={{ padding: 20 }}>
              <button
                onClick={() => setScreen('home')}
                style={{
                  fontFamily: T.sans,
                  fontSize: 11,
                  color: T.w40,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                ← Back
              </button>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 20,
                    background:
                      'linear-gradient(135deg, rgba(45,212,176,0.3), rgba(45,212,176,0.04))',
                    border: `1px solid rgba(45,212,176,0.25)`,
                    margin: '0 auto 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 40 }}>{activeTrack.icon}</span>
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 15,
                    fontWeight: 700,
                    color: T.white,
                  }}
                >
                  {activeTrack.name}
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 11,
                    color: T.teal,
                    marginTop: 3,
                  }}
                >
                  Integration Library · PsySonics
                </div>
              </div>
              <Waveform
                color={T.teal}
                count={36}
                playing={playing}
                height={28}
              />
              <div style={{ marginTop: 10, marginBottom: 14 }}>
                <div
                  style={{
                    height: 3,
                    background: 'rgba(45,212,176,0.2)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: T.teal,
                      borderRadius: 2,
                      transition: 'width 0.2s',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{ fontFamily: T.mono, fontSize: 9, color: T.w30 }}
                  >
                    {Math.floor((progress / 100) * 20)}:
                    {String(
                      Math.floor(((progress / 100) * 20 * 60) % 60)
                    ).padStart(2, '0')}
                  </span>
                  <span
                    style={{ fontFamily: T.mono, fontSize: 9, color: T.w30 }}
                  >
                    {activeTrack.duration}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                }}
              >
                <button
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: `1px solid ${T.border2}`,
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="10,1 2,6 10,11" fill={T.w40} />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setPlaying((v) => !v);
                    if (progress >= 100) setProgress(0);
                  }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: T.teal,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px rgba(45,212,176,0.3)`,
                  }}
                >
                  {playing ? (
                    <svg width="14" height="14">
                      <rect
                        x="0"
                        y="0"
                        width="4.5"
                        height="14"
                        rx="1.5"
                        fill={T.bg}
                      />
                      <rect
                        x="9.5"
                        y="0"
                        width="4.5"
                        height="14"
                        rx="1.5"
                        fill={T.bg}
                      />
                    </svg>
                  ) : (
                    <svg width="14" height="14" style={{ marginLeft: 2 }}>
                      <polygon points="0,0 14,7 0,14" fill={T.bg} />
                    </svg>
                  )}
                </button>
                <button
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: `1px solid ${T.border2}`,
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="2,1 10,6 2,11" fill={T.w40} />
                  </svg>
                </button>
              </div>
              <div
                style={{
                  marginTop: 16,
                  padding: '10px 12px',
                  background: T.bg3,
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.w40,
                    marginBottom: 3,
                  }}
                >
                  Offline mode active
                </div>
                <div style={{ fontFamily: T.sans, fontSize: 10, color: T.w20 }}>
                  This track is downloaded. No Wi-Fi required.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            padding: '10px 20px 20px',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          {[
            { id: 'home', icon: '⊞', label: 'Home' },
            { id: 'library', icon: '♫', label: 'Library' },
            { id: 'settings', icon: '⚙', label: 'Settings' },
          ].map((n) => (
            <button
              key={n.id}
              onClick={() => setScreen(n.id)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                color: screen === n.id ? T.teal : T.w30,
              }}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              <span
                style={{
                  fontFamily: T.sans,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                {n.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── SVG icon helpers ── */
const DashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="1" y="1" width="5" height="5" rx="1" />
    <rect x="8" y="1" width="5" height="5" rx="1" />
    <rect x="1" y="8" width="5" height="5" rx="1" />
    <rect x="8" y="8" width="5" height="5" rx="1" />
  </svg>
);
const UserIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="7" cy="5" r="3" />
    <path d="M1 13c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="7" cy="7" r="5" />
    <path d="M4 7l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const WaveIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M1 7c1-3 2-3 3 0s2 3 3 0 2-3 3 0" strokeLinecap="round" />
  </svg>
);
const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="2" y="2" width="10" height="10" rx="2" />
    <path d="M7 5v4M5 7h4" strokeLinecap="round" />
  </svg>
);
const GearIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="7" cy="7" r="2" />
    <path d="M7 1v2M7 11v2M1 7h2M11 7h2" strokeLinecap="round" />
  </svg>
);

/* ═══════════════════════════════════
   ROOT: Surface switcher
═══════════════════════════════════ */
export default function App() {
  const [surface, setSurface] = useState('clinician');

  const tabs = [
    {
      id: 'clinician',
      label: 'Clinician Dashboard',
      sub: 'Session management + soundframe control',
    },
    {
      id: 'portal',
      label: 'Patient Portal',
      sub: 'Integration soundframe access',
    },
    { id: 'mobile', label: 'Mobile App', sub: 'iOS · Offline capable' },
  ];

  return (
    <div
      style={{
        fontFamily: T.sans,
        background: T.bg,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FontLoader />
      <style>{`
        @keyframes psyPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(45,212,176,0.2); border-radius:2px; }
      `}</style>

      {/* Top nav */}
      <div
        style={{
          height: 60,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: 'rgba(10,12,11,0.95)',
          backdropFilter: 'blur(20px)',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 10,
          position: 'sticky',
          top: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              border: `1.5px solid ${T.teal}`,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 2,
                height: 14,
                alignItems: 'center',
              }}
            >
              {[4, 8, 12, 8, 6, 10, 4].map((h, i) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: 2,
                    height: h,
                    borderRadius: 1,
                    background: T.teal,
                  }}
                />
              ))}
            </div>
          </div>
          <span
            style={{
              fontFamily: T.sans,
              fontWeight: 700,
              fontSize: 15,
              color: T.white,
            }}
          >
            Psy<span style={{ color: T.teal }}>Sonics</span>
          </span>
          <Badge color={T.gold}>Demo</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setSurface(t.id)}
              style={{
                fontFamily: T.sans,
                fontSize: 12,
                fontWeight: 600,
                color: surface === t.id ? T.teal : T.w40,
                background: surface === t.id ? T.tealGlow : 'transparent',
                border:
                  surface === t.id
                    ? `1px solid rgba(45,212,176,0.2)`
                    : `1px solid ${T.border}`,
                padding: '7px 16px',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot color={T.teal} pulse />
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.w30 }}>
            psysonics.co
          </span>
        </div>
      </div>

      {/* Surface label strip */}
      <div
        style={{
          padding: '12px 24px',
          background: T.bg1,
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
        }}
      >
        {tabs
          .filter((t) => t.id === surface)
          .map((t) => (
            <div
              key={t.id}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <span
                style={{
                  fontFamily: T.sans,
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.white,
                }}
              >
                {t.label}
              </span>
              <span style={{ fontFamily: T.sans, fontSize: 11, color: T.w30 }}>
                ·
              </span>
              <span style={{ fontFamily: T.sans, fontSize: 11, color: T.w40 }}>
                {t.sub}
              </span>
            </div>
          ))}
      </div>

      {/* Surface content — browser chrome */}
      <div
        style={{
          flex: 1,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            flex: 1,
            background: T.bg2,
            border: `1px solid ${T.border2}`,
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: `0 0 0 1px rgba(45,212,176,0.06), 0 40px 100px rgba(0,0,0,0.6)`,
            display: 'flex',
            flexDirection: 'column',
            minHeight: surface === 'mobile' ? 600 : 580,
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              height: 40,
              background: T.bg3,
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              gap: 14,
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f56', '#ffbd2e', '#27c93f'].map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: c,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                maxWidth: 340,
                margin: '0 auto',
                background: T.bg2,
                border: `1px solid ${T.border}`,
                borderRadius: 5,
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <span style={{ color: T.teal, fontSize: 10 }}>🔒</span>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.w40 }}>
                {surface === 'clinician' ? (
                  <>
                    app.psysonics.co/
                    <span style={{ color: T.w70 }}>dashboard</span>
                  </>
                ) : surface === 'portal' ? (
                  <>
                    portal.psysonics.co/
                    <span style={{ color: T.w70 }}>integration</span>
                  </>
                ) : (
                  <>
                    PsySonics iOS ·{' '}
                    <span style={{ color: T.w70 }}>Offline</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Surface */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {surface === 'clinician' && <ClinicianDashboard />}
            {surface === 'portal' && <PatientPortal />}
            {surface === 'mobile' && <MobileApp />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 24px',
          borderTop: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: T.sans, fontSize: 11, color: T.w20 }}>
          © 2025 PsySonics, PBC · Asheville, NC · SDVOSB
        </span>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            'Patent-Pending Technology',
            'Dolby Atmos Spatial Audio',
            'SDVOSB Certified',
          ].map((s) => (
            <span
              key={s}
              style={{
                fontFamily: T.sans,
                fontSize: 10,
                fontWeight: 600,
                color: T.w20,
                letterSpacing: '0.04em',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
