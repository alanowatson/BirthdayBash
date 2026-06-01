// Hand-crafted SVG floor plan diagrams for each venue/floor.
// Style guide:
//   - viewBox 900×540 for all floors
//   - North = UP (arrow provided top-right)
//   - Walls: stroke rgba(212,175,55,0.35), strokeWidth 1.5
//   - Corridors/walkways: fill rgba(255,255,255,0.04), slightly lighter than bg
//   - Rooms: type-based subtle fills, with outlines
//   - Active (highlighted) rooms: brighter fill + thicker border
//   - Connectors to other properties: dashed cyan/purple borders

import React from 'react';

// ─── shared helpers ─────────────────────────────────────────────

const WALL  = { stroke: 'rgba(212,175,55,0.35)', strokeWidth: 1.5, fill: 'none' };
const WALL2 = { stroke: 'rgba(212,175,55,0.5)',  strokeWidth: 2,   fill: 'none' };   // outer shell
// stroke-only variants (no fill — use when setting fill separately)
const S1 = { stroke: 'rgba(212,175,55,0.35)', strokeWidth: 1.5 };
const S2 = { stroke: 'rgba(212,175,55,0.5)',  strokeWidth: 2 };

const fills = {
  bar:       { bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.6)', text: '#D4AF37' },
  barHot:    { bg: 'rgba(212,175,55,0.22)', border: '#D4AF37',              text: '#ffe78a' },
  restaurant:{ bg: 'rgba(249,115,22,0.09)', border: 'rgba(249,115,22,0.5)', text: '#fb923c' },
  restHot:   { bg: 'rgba(249,115,22,0.2)',  border: '#f97316',              text: '#fdba74' },
  venue:     { bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.5)', text: '#38BDF8' },
  venueHot:  { bg: 'rgba(56,189,248,0.22)', border: '#38BDF8',             text: '#7dd3fc' },
  casino:    { bg: 'rgba(255,255,255,0.02)',border: 'rgba(255,255,255,0.12)',text: 'rgba(255,255,255,0.35)' },
  entrance:  { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.4)',  text: '#4ade80' },
  connector: { bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.5)',text: '#c084fc' },
  corridor:  { bg: 'rgba(255,255,255,0.035)',border:'transparent',          text: 'transparent' },
  elevator:  { bg: 'rgba(255,255,255,0.06)',border:'rgba(255,255,255,0.2)', text: 'rgba(255,255,255,0.5)' },
  wall:      { bg: 'rgba(255,255,255,0.05)',border:'rgba(255,255,255,0.15)',text: 'transparent' },
};

interface RoomProps {
  x: number; y: number; w: number; h: number; r?: number;
  fill: { bg: string; border: string; text: string };
  label?: string;
  sublabel?: string;
  icon?: string;
  fontSize?: number;
  onClick?: () => void;
  selected?: boolean;
  dashed?: boolean;
}

function Room({ x, y, w, h, r = 3, fill, label, sublabel, icon, fontSize = 9, onClick, selected, dashed }: RoomProps) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const lines = label ? label.split('\n') : [];
  const lineH = fontSize + 2;
  const totalTextH = lines.length * lineH + (sublabel ? lineH - 1 : 0);
  const startY = cy - totalTextH / 2 + lineH / 2 + (icon ? -4 : 0);

  return (
    <g onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <rect
        x={x} y={y} width={w} height={h} rx={r}
        fill={fill.bg}
        stroke={fill.border}
        strokeWidth={selected ? 2 : 1}
        strokeDasharray={dashed ? '5,3' : undefined}
      />
      {selected && (
        <rect x={x+1} y={y+1} width={w-2} height={h-2} rx={r}
          fill="none" stroke={fill.text} strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />
      )}
      {icon && <text x={cx} y={startY - lineH * 0.5} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize + 3} style={{ userSelect: 'none' }}>{icon}</text>}
      {lines.map((line, i) => (
        <text key={i} x={cx} y={startY + i * lineH + (icon ? lineH * 0.7 : 0)} textAnchor="middle" dominantBaseline="middle"
          fontSize={line.length > 20 ? fontSize - 1 : fontSize} fill={fill.text} style={{ userSelect: 'none', fontFamily: 'inherit' }}>
          {line}
        </text>
      ))}
      {sublabel && (
        <text x={cx} y={startY + lines.length * lineH + (icon ? lineH * 0.7 : 0)} textAnchor="middle" dominantBaseline="middle"
          fontSize={fontSize - 2} fill={fill.text} opacity={0.6} style={{ userSelect: 'none', fontFamily: 'inherit' }}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

function NorthArrow({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={22} fill="rgba(0,0,0,0.5)" stroke="rgba(212,175,55,0.3)" strokeWidth={1} />
      {/* North pointer */}
      <polygon points="0,-16 5,4 0,0 -5,4" fill="#D4AF37" />
      {/* South pointer */}
      <polygon points="0,16 5,-4 0,0 -5,-4" fill="rgba(212,175,55,0.25)" />
      <text x={0} y={-19} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#D4AF37" fontWeight="bold" style={{ userSelect: 'none' }}>N</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = 'rgba(212,175,55,0.5)', label }: { x1: number; y1: number; x2: number; y2: number; color?: string; label?: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return (
    <g>
      <defs>
        <marker id={`arr-${x1}-${y1}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth={6} markerHeight={6} orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} markerEnd={`url(#arr-${x1}-${y1})`} />
      {label && <text x={mx + 6} y={my} fontSize={8} fill={color} dominantBaseline="middle" style={{ userSelect: 'none' }}>{label}</text>}
    </g>
  );
}

// Walkway/corridor path
function Corridor({ d, opacity = 1 }: { d: string; opacity?: number }) {
  return <path d={d} fill={fills.corridor.bg} stroke="none" opacity={opacity} />;
}

// Dashed divider line between zones
function Divider({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="4,4" />;
}

// ─── COSMOPOLITAN LEVEL 1 ─────────────────────────────────────────
// North = top of SVG.  East (Las Vegas Blvd / Strip) = RIGHT.
// Building runs roughly E–W with the Strip entrance on the right.
//
export function CosmoL1({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const s = (id: string) => selected === id;
  const t = (id: string) => () => onSelect(s(id) ? null : id);

  return (
    <svg viewBox="0 0 900 540" width="100%" style={{ display: 'block', background: '#07070f' }}>
      {/* ── outer building shell ── */}
      {/* Main casino wing */}
      <rect x={80} y={60} width={730} height={420} rx={6} fill="#0a0a14" {...S2} />
      {/* Chelsea tower bump (NW corner) */}
      <rect x={80} y={60} width={200} height={160} rx={4} fill="#0c0c18" stroke="rgba(212,175,55,0.25)" strokeWidth={1} />
      {/* Boulevard tower bump (NE, Strip facing) */}
      <rect x={700} y={60} width={110} height={200} rx={4} fill="#0c0c18" stroke="rgba(212,175,55,0.25)" strokeWidth={1} />

      {/* ── main corridor N–S spine ── */}
      <Corridor d="M 390 60 L 510 60 L 510 480 L 390 480 Z" />
      {/* ── E–W main corridor (center) ── */}
      <Corridor d="M 80 230 L 810 230 L 810 300 L 80 300 Z" />
      {/* ── connector corridor to Strip entrance ── */}
      <Corridor d="M 810 200 L 900 200 L 900 340 L 810 340 Z" />
      {/* ── connector corridor to Crystals (west) ── */}
      <Corridor d="M 0 215 L 80 215 L 80 325 L 0 325 Z" />

      {/* ── zone dividers (dashed) ── */}
      <Divider x1={280} y1={60} x2={280} y2={480} />
      <Divider x1={620} y1={60} x2={620} y2={480} />
      <Divider x1={80} y1={200} x2={810} y2={200} />
      <Divider x1={80} y1={340} x2={810} y2={340} />

      {/* ── CASINO FLOOR (background label) ── */}
      <text x={450} y={35} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.12)" letterSpacing={4} style={{ userSelect: 'none' }}>CASINO FLOOR</text>

      {/* slot machine zone hints */}
      {[120, 160, 200, 560, 600, 640].map(xx => (
        [100, 140, 380, 420].map(yy => (
          <rect key={`${xx}-${yy}`} x={xx} y={yy} width={18} height={28} rx={2} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
        ))
      ))}
      {/* table game circles */}
      {[340, 420, 500, 580, 660, 740].map((xx, i) => (
        [110, 160, 390, 440].map((yy, j) => (
          <ellipse key={`t-${i}-${j}`} cx={xx} cy={yy} rx={22} ry={14} fill="rgba(34,197,94,0.04)" stroke="rgba(34,197,94,0.12)" strokeWidth={0.5} />
        ))
      ))}

      {/* ── CHANDELIER BAR ── centrepiece */}
      <Room x={340} y={200} w={210} h={140} r={70}
        fill={s('chandelier') ? fills.barHot : fills.bar}
        icon="✦" label={'Chandelier Bar'} sublabel="↑ stairs to Level 1.5"
        fontSize={10} selected={s('chandelier')} onClick={t('chandelier')} />

      {/* ── VESPER BAR ── */}
      <Room x={640} y={70} w={140} h={90} fill={s('vesper') ? fills.barHot : fills.bar}
        label="Vesper Bar" fontSize={9} selected={s('vesper')} onClick={t('vesper')} />

      {/* ── SPORTSBOOK ── */}
      <Room x={640} y={350} w={150} h={110} fill={s('sportsbook') ? fills.venue : fills.casino}
        label="Sportsbook" fontSize={9} selected={s('sportsbook')} onClick={t('sportsbook')} />

      {/* ── POKER ROOM ── */}
      <Room x={640} y={200} w={150} h={130} fill={fills.casino}
        label={'Poker Room'} fontSize={9} selected={false} onClick={t('poker')} />

      {/* ── Chelsea tower north spaces ── */}
      <Room x={90} y={70} w={180} h={130} fill={fills.casino} label="Chelsea Tower\nLobby Area" fontSize={8} />

      {/* ── Table games zone label ── */}
      <text x={200} y={270} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.2)" style={{ userSelect: 'none' }}>TABLE GAMES</text>
      <text x={200} y={160} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.2)" style={{ userSelect: 'none' }}>SLOTS</text>
      <text x={580} y={160} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.2)" style={{ userSelect: 'none' }}>SLOTS</text>

      {/* ── ELEVATORS ── */}
      <Room x={390} y={380} w={120} h={50} fill={fills.elevator} label="🛗 Elevators" sublabel="L2 / L3 / L4" fontSize={8} />
      <Room x={160} y={305} w={90} h={45} fill={fills.elevator} label="🛗 Elev." sublabel="Parking" fontSize={8} />

      {/* ── ESCALATORS ── */}
      <Room x={245} y={225} w={80} h={50} r={2} fill={fills.elevator} label="⬆ Escalator" sublabel="to Level 2" fontSize={8} />

      {/* ── STRIP ENTRANCE ── right side */}
      <Room x={820} y={210} w={70} h={120} fill={fills.entrance}
        label={'Strip\nEntrance'} sublabel="Las Vegas Blvd" fontSize={9} dashed selected={s('strip-entrance')} onClick={t('strip-entrance')} />
      <Arrow x1={810} y1={270} x2={850} y2={270} color="rgba(34,197,94,0.7)" />

      {/* ── CRYSTALS connector (west) ── */}
      <Room x={0} y={220} w={80} h={100} fill={fills.connector}
        label={'← Crystals\n/ Aria'} sublabel="~10 min walk" fontSize={8} dashed selected={s('crystals')} onClick={t('crystals')} />
      <Arrow x1={82} y1={270} x2={50} y2={270} color="rgba(192,132,252,0.7)" />

      {/* ── VALET / RIDESHARE ── south */}
      <Room x={280} y={460} w={180} h={70} fill={fills.entrance}
        label={'Valet & Rideshare'} sublabel="↓ W Harmon Ave" fontSize={9} dashed selected={s('valet')} onClick={t('valet')} />
      <Arrow x1={370} y1={480} x2={370} y2={540} color="rgba(34,197,94,0.7)" />

      {/* ── PH bridge note (at L2 level, accessed via escalator) ── */}
      <Room x={820} y={80} w={70} h={80} fill={fills.connector} r={3}
        label={'PH Bridge\n(Level 2)'} sublabel="→ cross Strip" fontSize={7} dashed />

      {/* ── North arrow ── */}
      <NorthArrow x={860} y={490} />

      {/* ── compass label ── */}
      <text x={810} y={530} fontSize={7} fill="rgba(212,175,55,0.3)" style={{ userSelect: 'none' }}>E = Strip (Las Vegas Blvd)</text>
    </svg>
  );
}

// ─── COSMOPOLITAN LEVEL 1.5 ─────────────────────────────────────
export function CosmoL15({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const s = (id: string) => selected === id;
  const t = (id: string) => () => onSelect(s(id) ? null : id);

  return (
    <svg viewBox="0 0 900 540" width="100%" style={{ display: 'block', background: '#07070f' }}>
      <rect x={80} y={60} width={730} height={420} rx={6} fill="#0a0a14" {...S2} />

      {/* Most of the floor is void / structural — only the Chandelier void area is accessible */}
      <rect x={80} y={60} width={730} height={420} rx={6} fill="rgba(0,0,0,0.3)" />
      <text x={450} y={270} textAnchor="middle" fontSize={32} fill="rgba(255,255,255,0.02)" style={{ userSelect: 'none' }}>MEZZANINE</text>

      {/* ── THE CHANDELIER void + bar ring ── */}
      {/* Crystal void (the chandelier hangs through here) */}
      <ellipse cx={450} cy={250} rx={180} ry={150} fill="rgba(212,175,55,0.03)" stroke="rgba(212,175,55,0.15)" strokeWidth={1} strokeDasharray="6,4" />

      {/* Crystal strands hint */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r1 = 40, r2 = 165;
        return (
          <line key={i}
            x1={450 + r1 * Math.cos(angle)} y1={250 + r1 * Math.sin(angle) * 0.8}
            x2={450 + r2 * Math.cos(angle)} y2={250 + r2 * Math.sin(angle) * 0.8}
            stroke="rgba(212,175,55,0.06)" strokeWidth={0.5} />
        );
      })}

      {/* The bar itself (ring) */}
      <Room x={270} y={110} w={360} h={280} r={140}
        fill={s('chandelier-mid') ? fills.barHot : fills.bar}
        icon="✦" label={'Chandelier Bar'} sublabel="Level 1.5 — The Verbena level"
        fontSize={12} selected={s('chandelier-mid')} onClick={t('chandelier-mid')} />

      {/* ── THE VERBENA spot ── */}
      <Room x={330} y={160} w={200} h={100} r={8}
        fill={s('verbena') ? fills.barHot : { ...fills.bar, bg: 'rgba(212,175,55,0.18)' }}
        icon="🍸" label={'The Verbena'} sublabel="Szechuan button flower"
        fontSize={10} selected={s('verbena')} onClick={t('verbena')} />

      {/* ── UV menu callout ── */}
      <Room x={620} y={160} w={160} h={70} fill={fills.bar}
        label={'🔦 Black Light\nUV Menu'} sublabel="ask your bartender" fontSize={9}
        selected={s('uv')} onClick={t('uv')} />

      {/* ── Stairs down / up ── */}
      <Room x={90} y={220} w={100} h={60} fill={fills.elevator} label="⬆⬇ Stairs" sublabel="L1 / L2" fontSize={9} />
      <Room x={700} y={220} w={100} h={60} fill={fills.elevator} label="⬆⬇ Stairs" sublabel="L1 / L2" fontSize={9} />

      {/* annotation arrows */}
      <Arrow x1={530} y1={210} x2={620} y2={195} color="rgba(212,175,55,0.5)" label="secret menu" />

      <NorthArrow x={860} y={490} />
      <text x={782} y={530} fontSize={7} fill="rgba(212,175,55,0.3)" style={{ userSelect: 'none' }}>Mezzanine inside the chandelier — access via stairs from Level 1</text>
    </svg>
  );
}

// ─── COSMOPOLITAN LEVEL 2 ────────────────────────────────────────
export function CosmoL2({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const s = (id: string) => selected === id;
  const t = (id: string) => () => onSelect(s(id) ? null : id);

  return (
    <svg viewBox="0 0 900 540" width="100%" style={{ display: 'block', background: '#07070f' }}>
      <rect x={80} y={60} width={730} height={420} rx={6} fill="#0a0a14" {...S2} />

      {/* ── main corridors ── */}
      <Corridor d="M 390 60 L 510 60 L 510 480 L 390 480 Z" />
      <Corridor d="M 80 230 L 810 230 L 810 300 L 80 300 Z" />
      <Corridor d="M 810 200 L 900 200 L 900 340 L 810 340 Z" />
      <Corridor d="M 0 215 L 80 215 L 80 325 L 0 325 Z" />

      <Divider x1={280} y1={60} x2={280} y2={480} />
      <Divider x1={620} y1={60} x2={620} y2={480} />
      <Divider x1={80} y1={200} x2={810} y2={200} />
      <Divider x1={80} y1={340} x2={810} y2={340} />

      {/* ── MARQUEE NIGHTCLUB ── large NW area */}
      <Room x={90} y={70} w={270} h={280} fill={s('marquee') ? fills.venueHot : fills.venue}
        icon="✦" label={'MARQUEE'} sublabel="Nightclub / Dayclub\nMeetup outside doors"
        fontSize={13} selected={s('marquee')} onClick={t('marquee')} />

      {/* ── Chandelier void (open to below) ── */}
      <ellipse cx={450} cy={265} rx={90} ry={70} fill="rgba(212,175,55,0.04)" stroke="rgba(212,175,55,0.2)" strokeWidth={1} strokeDasharray="5,3" />
      <text x={450} y={262} textAnchor="middle" fontSize={8} fill="rgba(212,175,55,0.4)" style={{ userSelect: 'none' }}>Chandelier</text>
      <text x={450} y={275} textAnchor="middle" fontSize={8} fill="rgba(212,175,55,0.4)" style={{ userSelect: 'none' }}>Bar (top)</text>

      {/* ── WICKED SPOON ── */}
      <Room x={530} y={70} w={260} h={120} fill={s('wicked-spoon') ? fills.restHot : fills.restaurant}
        label="Wicked Spoon" sublabel="Buffet — breakfast / lunch / dinner" fontSize={10}
        selected={s('wicked-spoon')} onClick={t('wicked-spoon')} />

      {/* ── HOLSTEINS ── */}
      <Room x={530} y={200} w={130} h={80} fill={fills.restaurant} label="Holsteins\nBurgers & Booze" fontSize={8} />

      {/* ── MOMOFUKU ── */}
      <Room x={670} y={200} w={120} h={80} fill={fills.restaurant} label="Momofuku\nNoodle Bar" fontSize={8} />

      {/* ── EGGSLUT ── */}
      <Room x={530} y={290} w={130} h={80} fill={fills.restaurant} label="Eggslut\nBreakfast" fontSize={8} />

      {/* ── Secret Attic (Marquee private) ── */}
      <Room x={90} y={360} w={180} h={100} fill={fills.venue} label="The Study\n(private)" fontSize={8} />

      {/* ── elevators / stairs ── */}
      <Room x={390} y={380} w={120} h={50} fill={fills.elevator} label="🛗 Elevators" sublabel="L1 / L3 / L4" fontSize={8} />
      <Room x={245} y={235} w={80} h={50} fill={fills.elevator} label="⬇ from L1\n⬆ to L3" fontSize={8} />

      {/* ── PH bridge ── */}
      <Room x={820} y={210} w={70} h={120} fill={fills.connector}
        label={'→ PH\nBridge'} sublabel="cross Strip" fontSize={9} dashed selected={s('ph-bridge')} onClick={t('ph-bridge')} />
      <Arrow x1={810} y1={270} x2={850} y2={270} color="rgba(192,132,252,0.7)" />

      {/* ── Crystals connector ── */}
      <Room x={0} y={220} w={80} h={100} fill={fills.connector}
        label={'← Crystals\n/ Aria'} sublabel="this level" fontSize={8} dashed selected={s('crystals')} onClick={t('crystals')} />
      <Arrow x1={82} y1={270} x2={50} y2={270} color="rgba(192,132,252,0.7)" />

      {/* ── Strip entrance at level 2 (escalators from L1) ── */}
      <Room x={820} y={80} w={70} h={100} fill={fills.entrance} label={'Strip\nEscalator\n↑ from L1'} fontSize={8} dashed />

      <NorthArrow x={860} y={490} />
      <text x={810} y={530} fontSize={7} fill="rgba(212,175,55,0.3)" style={{ userSelect: 'none' }}>E = Strip (Las Vegas Blvd)</text>
    </svg>
  );
}

// ─── COSMOPOLITAN LEVEL 3 ────────────────────────────────────────
export function CosmoL3({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const s = (id: string) => selected === id;
  const t = (id: string) => () => onSelect(s(id) ? null : id);

  return (
    <svg viewBox="0 0 900 540" width="100%" style={{ display: 'block', background: '#07070f' }}>
      <rect x={80} y={60} width={730} height={420} rx={6} fill="#0a0a14" {...S2} />

      {/* Level 3 is mostly a narrower promenade / restaurant deck */}
      {/* ── main restaurant promenade corridor ── */}
      <Corridor d="M 80 200 L 810 200 L 810 340 L 80 340 Z" />
      {/* ── side corridors ── */}
      <Corridor d="M 390 60 L 510 60 L 510 480 L 390 480 Z" />

      <Divider x1={80} y1={200} x2={810} y2={200} />
      <Divider x1={80} y1={340} x2={810} y2={340} />
      <Divider x1={390} y1={60} x2={390} y2={480} />
      <Divider x1={510} y1={60} x2={510} y2={480} />

      {/* ── JALEO (José Andrés) ── */}
      <Room x={90} y={70} w={190} h={120} fill={fills.restaurant} label="Jaleo" sublabel="José Andrés Spanish" fontSize={10} />

      {/* ── BLUE RIBBON SUSHI ── */}
      <Room x={90} y={205} w={190} h={120} fill={fills.restaurant} label="Blue Ribbon\nSushi" sublabel="Late night sushi" fontSize={9} />

      {/* ── SECRET PIZZA ── The hero of Level 3 */}
      <Room x={90} y={340} w={190} h={120} fill={s('secret-pizza') ? fills.restHot : fills.restaurant}
        icon="🍕" label={'SECRET PIZZA'} sublabel="no signage — see directions"
        fontSize={10} selected={s('secret-pizza')} onClick={t('secret-pizza')} />

      {/* ── vinyl record hallway ── */}
      <Room x={286} y={340} w={100} h={120} fill={{ bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.2)', text: 'rgba(249,115,22,0.5)' }}
        label={'← vinyl\nrecord\nhallway'} sublabel="follow it back" fontSize={8} />
      {/* arrow into hallway */}
      <Arrow x1={390} y1={400} x2={290} y2={400} color="rgba(249,115,22,0.6)" label="→ pizza" />

      {/* ── BEAUTY & ESSEX ── */}
      <Room x={530} y={70} w={260} h={150} fill={s('beauty-essex') ? fills.restHot : fills.restaurant}
        icon="💎" label={'Beauty & Essex'} sublabel="enter via pawn shop · Social Hour 5–7 PM"
        fontSize={10} selected={s('beauty-essex')} onClick={t('beauty-essex')} />
      <Room x={680} y={70} w={110} h={60} fill={{ bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.2)', text: 'rgba(249,115,22,0.4)' }}
        label="Pawn Shop\nentrance →" fontSize={7} />

      {/* ── CHINA POBLANO ── */}
      <Room x={530} y={230} w={120} h={100} fill={fills.restaurant} label="China Poblano\nJosé Andrés" fontSize={8} />

      {/* ── STK STEAKHOUSE ── */}
      <Room x={660} y={230} w={130} h={100} fill={fills.restaurant} label="STK\nSteakhouse" fontSize={9} />

      {/* ── additional level 3 spaces ── */}
      <Room x={530} y={340} w={130} h={120} fill={fills.restaurant} label="Estiatorio\nMilos" sublabel="Greek seafood" fontSize={8} />
      <Room x={670} y={340} w={120} h={120} fill={fills.restaurant} label="Wicked\nSpoon" sublabel="(some floors)" fontSize={8} />

      {/* ── conference / meeting rooms (NE) ── */}
      <Room x={530} y={460} w={260} h={60} fill={fills.wall} label="Conference / Ballroom" fontSize={8} />

      {/* ── elevators ── */}
      <Room x={390} y={380} w={120} h={50} fill={fills.elevator} label="🛗 Elevators" sublabel="L1 / L2 / L4" fontSize={8} />

      {/* ── directions callout ── */}
      <rect x={285} y={55} width={240} height={130} rx={4} fill="rgba(249,115,22,0.06)" stroke="rgba(249,115,22,0.25)" strokeWidth={1} strokeDasharray="3,3" />
      <text x={295} y={72} fontSize={8} fill="#fb923c" style={{ userSelect: 'none' }}>HOW TO FIND SECRET PIZZA:</text>
      <text x={295} y={87} fontSize={7.5} fill="rgba(249,115,22,0.7)" style={{ userSelect: 'none' }}>1. Take elevator to Level 3</text>
      <text x={295} y={100} fontSize={7.5} fill="rgba(249,115,22,0.7)" style={{ userSelect: 'none' }}>2. Walk toward Jaleo / Blue Ribbon</text>
      <text x={295} y={113} fontSize={7.5} fill="rgba(249,115,22,0.7)" style={{ userSelect: 'none' }}>3. Find unmarked hallway (vinyl records)</text>
      <text x={295} y={126} fontSize={7.5} fill="rgba(249,115,22,0.7)" style={{ userSelect: 'none' }}>4. Follow hallway to the back — open 11am–4am</text>
      <text x={295} y={141} fontSize={7.5} fill="rgba(249,115,22,0.7)" style={{ userSelect: 'none' }}>5. Slices $6–7 · Whole pies $25–30</text>

      <NorthArrow x={860} y={490} />
      <text x={810} y={530} fontSize={7} fill="rgba(212,175,55,0.3)" style={{ userSelect: 'none' }}>E = Strip (Las Vegas Blvd)</text>
    </svg>
  );
}

// ─── ARIA CASINO FLOOR ───────────────────────────────────────────
export function AriaCasino({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const s = (id: string) => selected === id;
  const t = (id: string) => () => onSelect(s(id) ? null : id);

  return (
    <svg viewBox="0 0 900 540" width="100%" style={{ display: 'block', background: '#07070f' }}>
      {/* Aria has a distinctive curved / hexagonal building footprint */}
      <path d="M 120 80 Q 450 40 780 80 L 810 460 Q 450 500 90 460 Z" fill="#0a0a14" stroke="rgba(56,189,248,0.4)" strokeWidth={2} />

      {/* ── Main corridors ── */}
      <Corridor d="M 120 240 L 780 240 L 780 300 L 120 300 Z" />
      <Corridor d="M 400 80 L 500 80 L 500 460 L 400 460 Z" />

      <Divider x1={120} y1={240} x2={780} y2={240} />
      <Divider x1={120} y1={300} x2={780} y2={300} />

      {/* ── Main entrance (south) ── */}
      <Room x={340} y={450} w={220} h={70} fill={fills.entrance}
        label={'Main Entrance'} sublabel="↓ Las Vegas Blvd (valet / drop-off)" fontSize={9} dashed />
      <Arrow x1={450} y1={460} x2={450} y2={530} color="rgba(34,197,94,0.7)" />

      {/* ── CASINO FLOOR ── */}
      <text x={250} y={200} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.15)" letterSpacing={3} style={{ userSelect: 'none' }}>SLOTS</text>
      <text x={650} y={200} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.15)" letterSpacing={3} style={{ userSelect: 'none' }}>SLOTS</text>
      <text x={250} y={380} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.15)" letterSpacing={3} style={{ userSelect: 'none' }}>TABLE GAMES</text>
      <text x={650} y={380} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.15)" letterSpacing={3} style={{ userSelect: 'none' }}>TABLE GAMES</text>

      {/* table dots */}
      {[160, 220, 280, 570, 630, 690, 750].map(xx => (
        [120, 160, 350, 390, 430].map(yy => (
          <ellipse key={`${xx}-${yy}`} cx={xx} cy={yy} rx={20} ry={13} fill="rgba(56,189,248,0.03)" stroke="rgba(56,189,248,0.1)" strokeWidth={0.5} />
        ))
      ))}

      {/* ── POKER ROOM ── */}
      <Room x={130} y={90} w={170} h={130} fill={fills.casino} label="Poker Room" fontSize={9} />

      {/* ── HIGH LIMIT ── */}
      <Room x={600} y={90} w={180} h={130} fill={fills.casino} label="High Limit" sublabel="Slots & Tables" fontSize={9} />

      {/* ── ARIA Bar ── */}
      <Room x={310} y={110} w={280} h={110} fill={s('aria-bar') ? fills.barHot : fills.bar}
        label="Lobby Bar" sublabel="central casino" fontSize={9} selected={s('aria-bar')} onClick={t('aria-bar')} />

      {/* ── Crystals exit (NW) ── */}
      <Room x={130} y={310} w={140} h={100} fill={fills.connector}
        label={'← Crystals\nMall'} sublabel="Cosmopolitan / Bellagio" fontSize={8} dashed selected={s('crystals')} onClick={t('crystals')} />
      <Arrow x1={130} y1={360} x2={85} y2={360} color="rgba(192,132,252,0.7)" />

      {/* ── TRAM STATION ── */}
      <Room x={620} y={310} w={160} h={100} fill={fills.connector}
        label={'🚋 Aria Express\nTram'} sublabel="Cosmo · Bellagio\nPark MGM" fontSize={8} dashed selected={s('tram')} onClick={t('tram')} />

      {/* ── Vdara walkway ── */}
      <Room x={130} y={90} w={80} h={60} fill={fills.connector}
        label={'→ Vdara\n~2 min'} fontSize={7} dashed />
      <Arrow x1={130} y1={120} x2={80} y2={120} color="rgba(192,132,252,0.6)" />

      {/* ── Restaurants (east side) ── */}
      <Room x={630} y={430} w={160} h={60} fill={fills.restaurant} label="Jean-Georges Steakhouse" fontSize={7} />
      <Room x={130} y={430} w={160} h={60} fill={fills.restaurant} label="Carbone" sublabel="Italian-American" fontSize={8} />

      {/* ── Elevators ── */}
      <Room x={410} y={380} w={90} h={50} fill={fills.elevator} label="🛗 Elevators" sublabel="Hotel / Pools" fontSize={8} />

      <NorthArrow x={860} y={490} />
      <text x={820} y={530} fontSize={7} fill="rgba(56,189,248,0.3)" style={{ userSelect: 'none' }}>S = Las Vegas Blvd</text>
    </svg>
  );
}

// ─── VDARA LOBBY LEVEL ───────────────────────────────────────────
export function VdaraLobby({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const s = (id: string) => selected === id;
  const t = (id: string) => () => onSelect(s(id) ? null : id);

  // Vdara has a distinctive curved 3-arc floor plan
  return (
    <svg viewBox="0 0 900 540" width="100%" style={{ display: 'block', background: '#07070f' }}>
      {/* Three-arc curved building footprint */}
      <path d="M 200 100 Q 280 50 450 80 Q 620 50 700 100 L 720 450 Q 580 500 450 490 Q 320 500 180 450 Z"
        fill="#0a0a14" stroke="rgba(212,175,55,0.4)" strokeWidth={2} />

      {/* ── Main corridor ── */}
      <Corridor d="M 200 240 L 700 240 L 700 300 L 200 300 Z" />
      <Corridor d="M 400 80 L 500 80 L 500 470 L 400 470 Z" />

      {/* ── LOBBY / CHECK-IN ── */}
      <Room x={310} y={100} w={280} h={120} fill={s('lobby') ? fills.barHot : fills.casino}
        label={'Lobby & Check-In'} sublabel="24-hour front desk" fontSize={10} selected={s('lobby')} onClick={t('lobby')} />

      {/* ── CAFÉ VDARA ── */}
      <Room x={200} y={100} w={105} h={120} fill={s('cafe') ? fills.restHot : fills.restaurant}
        label={'Café Vdara'} sublabel="coffee & food" fontSize={9} selected={s('cafe')} onClick={t('cafe')} />

      {/* ── AQUA MASSAGE ── */}
      <Room x={595} y={100} w={105} h={120} fill={fills.casino} label={'Aqua\nMassage'} fontSize={8} />

      {/* ── Aria walkway ── */}
      <Room x={195} y={310} w={140} h={100} fill={fills.connector}
        label={'→ Aria\n~2 min walk'} sublabel="north valet path" fontSize={8} dashed selected={s('aria-walk')} onClick={t('aria-walk')} />
      <Arrow x1={210} y1={360} x2={160} y2={360} color="rgba(192,132,252,0.7)" />

      {/* ── Bellagio walkway ── */}
      <Room x={560} y={310} w={140} h={100} fill={fills.connector}
        label={'← Bellagio\n~5 min'} sublabel="bridge on L1" fontSize={8} dashed selected={s('bellagio')} onClick={t('bellagio')} />
      <Arrow x1={700} y1={360} x2={740} y2={360} color="rgba(192,132,252,0.7)" />

      {/* ── Pool deck ── */}
      <Room x={310} y={380} w={280} h={80} fill={{ bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa' }}
        label={'Pool Deck'} sublabel="heated pool · cabanas" fontSize={9} selected={s('pool')} onClick={t('pool')} />

      {/* ── Spa ── */}
      <Room x={200} y={240} w={100} h={70} fill={fills.casino} label={'Spa\nVdara'} sublabel="Level 2" fontSize={8} />

      {/* ── Main entrance ── */}
      <Room x={340} y={450} w={220} h={60} fill={fills.entrance}
        label={'Main Entrance'} sublabel="↓ W Harmon Ave / Valet" fontSize={9} dashed />
      <Arrow x1={450} y1={465} x2={450} y2={525} color="rgba(34,197,94,0.7)" />

      {/* ── Elevators ── */}
      <Room x={410} y={240} w={90} h={50} fill={fills.elevator} label="🛗 Elevators" sublabel="1–57" fontSize={8} />

      {/* Curved building annotation */}
      <text x={450} y={38} textAnchor="middle" fontSize={9} fill="rgba(212,175,55,0.2)" letterSpacing={4} style={{ userSelect: 'none' }}>VDARA — 57 FLOORS</text>
      <text x={450} y={51} textAnchor="middle" fontSize={7} fill="rgba(212,175,55,0.15)" style={{ userSelect: 'none' }}>3-arc curved tower · all suites · no casino</text>

      <NorthArrow x={860} y={490} />
      <text x={820} y={530} fontSize={7} fill="rgba(212,175,55,0.3)" style={{ userSelect: 'none' }}>S = W Harmon Ave</text>
    </svg>
  );
}

// ─── component map ───────────────────────────────────────────────
export const FLOOR_PLAN_COMPONENTS: Record<string, React.ComponentType<{ selected: string | null; onSelect: (id: string | null) => void }>> = {
  'cosmo-l1':    CosmoL1,
  'cosmo-l15':   CosmoL15,
  'cosmo-l2':    CosmoL2,
  'cosmo-l3':    CosmoL3,
  'aria-casino': AriaCasino,
  'vdara-lobby': VdaraLobby,
};

// ─── Detail text for selected rooms ─────────────────────────────
export const ROOM_DETAILS: Record<string, { title: string; body: string }> = {
  'chandelier': {
    title: 'Chandelier Bar — Level 1 (Bottom)',
    body: 'The main bar level on the casino floor. Giant crystal chandelier hangs overhead. The Verbena and the UV menu are on Level 1.5 — take the stairs inside the chandelier to get there.',
  },
  'chandelier-mid': {
    title: 'Chandelier Bar — Level 1.5',
    body: 'The best seat in the house. Order the Verbena (tequila, yuzu, kalamansi, ginger + Szechuan edible flower). Chew the flower and feel your mouth go numb. Ask your bartender for the black light UV menu.',
  },
  'verbena': {
    title: '🍸 The Verbena',
    body: 'The non-negotiable first drink. Served at the Level 1.5 Chandelier Bar. Take a few sips, then eat the live Szechuan button flower. The spilanthol numbs your mouth and transforms the citrus taste.',
  },
  'uv': {
    title: '🔦 UV / Black Light Menu',
    body: 'A secret menu only visible under ultraviolet light. Ask your bartender on Level 1.5 — they\'ll shine a black light on the card. Extra cocktails not listed on the main menu.',
  },
  'marquee': {
    title: '✦ Marquee Nightclub',
    body: 'Saturday Nightclub meetup point. Gather outside the Marquee entrance at 10:15 PM. Club arrival ~11:15 PM. Dress code enforced — dress the part.',
  },
  'secret-pizza': {
    title: '🍕 Secret Pizza',
    body: 'No signage. Open until 4 AM. Take the elevator to Level 3, walk toward Jaleo and Blue Ribbon, find the unmarked hallway lined with vinyl records — follow it all the way back. NY slices $6–7, whole pies $25–30. Order whole pies for groups.',
  },
  'beauty-essex': {
    title: '💎 Beauty & Essex',
    body: 'Walk through the pawn shop entrance on Level 3. Social Hour Sun–Thu 5–7 PM: 10 dishes + 10 cocktails all $10. Best happy hour in the building. Call 702-737-0707 for groups of 10+. Closed Mon–Tue.',
  },
  'crystals': {
    title: '← Crystals Mall / Aria connection',
    body: 'The Shops at Crystals connects the Cosmopolitan to Aria and Vdara. Follow signs through Crystals to reach Aria (~8 min) or continue to Vdara (~12 min total). Also has a tram station at the Aria end.',
  },
  'ph-bridge': {
    title: '→ Planet Hollywood Bridge',
    body: 'Pedestrian overpass connecting Level 2 of the Cosmopolitan directly to Planet Hollywood across Las Vegas Blvd. About 5 minutes walk. Covered — you stay indoors the whole way.',
  },
  'tram': {
    title: '🚋 Aria Express Tram',
    body: 'Free tram running between Aria, Bellagio, The Cosmopolitan, and Park MGM. Runs ~24 hours. Look for tram signs on the casino floor — northeast side near Crystals exit.',
  },
  'aria-walk': {
    title: '→ Aria walkway',
    body: 'A 2-minute walk from the Vdara lobby takes you to Aria via the north valet area. Follow signs. From Aria you can reach the Cosmopolitan via the tram (~8 min) or walking through Crystals (~10 min).',
  },
};
