function Sky({ ground = "#aed581", children }) {
  return (
    <svg className="art" viewBox="0 0 320 180" aria-hidden="true">
      <rect width="320" height="180" rx="20" fill="#b3e5fc" />
      <circle cx="274" cy="36" r="18" fill="#fff59d" />
      <rect y="128" width="320" height="52" fill={ground} />
      {children}
    </svg>
  );
}

function Bob({ x, y, children }) {
  return (
    <g className="mover" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <g className="bob">{children}</g>
    </g>
  );
}

function Pig({ x, y, scale = 1 }) {
  return (
    <Bob x={x} y={y}>
      <g transform={`scale(${scale})`}>
        <ellipse cx="0" cy="8" rx="20" ry="13" fill="#f48fb1" />
        <circle cx="16" cy="-6" r="11" fill="#f48fb1" />
        <path d="M10 -14 l5 -8 l4 8" fill="#f48fb1" />
        <ellipse cx="22" cy="-4" rx="5" ry="3.5" fill="#f06292" />
        <circle cx="18" cy="-8" r="1.4" fill="#263238" />
      </g>
    </Bob>
  );
}

function House({ x, y, wall }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="28" width="58" height="42" rx="3" fill={wall} />
      <polygon points="-2,30 29,4 60,30" fill="#6d4c41" />
      <rect x="22" y="46" width="14" height="24" rx="2" fill="#4e342e" />
    </g>
  );
}

function Wolf({ x, y }) {
  return (
    <Bob x={x} y={y}>
      <ellipse cx="0" cy="10" rx="24" ry="12" fill="#90a4ae" />
      <circle cx="20" cy="-4" r="12" fill="#90a4ae" />
      <polygon points="12,-12 18,-24 22,-10" fill="#78909c" />
      <polygon points="22,-10 30,-22 28,-8" fill="#78909c" />
      <circle cx="24" cy="-6" r="1.4" fill="#263238" />
    </Bob>
  );
}

function Bear({ x, y, small = false }) {
  const s = small ? 0.7 : 1;
  return (
    <Bob x={x} y={y}>
      <g transform={`scale(${s})`}>
        <circle cx="0" cy="6" r="16" fill="#8d6e63" />
        <circle cx="0" cy="-12" r="11" fill="#8d6e63" />
        <circle cx="-6" cy="-20" r="4" fill="#6d4c41" />
        <circle cx="6" cy="-20" r="4" fill="#6d4c41" />
        <circle cx="-3" cy="-12" r="1.3" fill="#263238" />
        <circle cx="3" cy="-12" r="1.3" fill="#263238" />
      </g>
    </Bob>
  );
}

function Girl({ x, y }) {
  return (
    <Bob x={x} y={y}>
      <circle cx="0" cy="-8" r="12" fill="#ffe082" />
      <rect x="-10" y="4" width="20" height="22" rx="6" fill="#64b5f6" />
      <circle cx="-4" cy="-8" r="1.3" fill="#263238" />
      <circle cx="4" cy="-8" r="1.3" fill="#263238" />
    </Bob>
  );
}

function Hare({ x, y, rest = false }) {
  return (
    <Bob x={x} y={y}>
      <ellipse cx="0" cy="10" rx="18" ry="11" fill="#bcaaa4" />
      <circle cx="12" cy="-2" r="9" fill="#bcaaa4" />
      <path d={rest ? "M6 -8 l2 -14" : "M8 -8 l-2 -18"} stroke="#a1887f" strokeWidth="3" />
      <path d={rest ? "M12 -8 l4 -12" : "M14 -6 l6 -16"} stroke="#a1887f" strokeWidth="3" />
      <circle cx="15" cy="-3" r="1.3" fill="#263238" />
    </Bob>
  );
}

function Tortoise({ x, y }) {
  return (
    <Bob x={x} y={y}>
      <ellipse cx="0" cy="8" rx="20" ry="12" fill="#66bb6a" />
      <ellipse cx="0" cy="6" rx="12" ry="8" fill="#43a047" />
      <circle cx="18" cy="4" r="6" fill="#81c784" />
      <circle cx="20" cy="3" r="1.2" fill="#263238" />
    </Bob>
  );
}

function Hen({ x, y }) {
  return (
    <Bob x={x} y={y}>
      <ellipse cx="0" cy="8" rx="18" ry="13" fill="#ef5350" />
      <circle cx="14" cy="-2" r="9" fill="#ef5350" />
      <polygon points="14,-12 18,-18 20,-10" fill="#ffca28" />
      <polygon points="20,-2 28,-1 20,3" fill="#ffb300" />
      <circle cx="16" cy="-4" r="1.3" fill="#263238" />
    </Bob>
  );
}

function Ginger({ x, y }) {
  return (
    <Bob x={x} y={y}>
      <circle cx="0" cy="-8" r="10" fill="#a1887f" />
      <rect x="-8" y="2" width="16" height="18" rx="6" fill="#a1887f" />
      <circle cx="-3" cy="-8" r="1.2" fill="#263238" />
      <circle cx="3" cy="-8" r="1.2" fill="#263238" />
      <circle cx="0" cy="8" r="2" fill="#ef5350" />
    </Bob>
  );
}

function Fox({ x, y }) {
  return (
    <Bob x={x} y={y}>
      <ellipse cx="0" cy="10" rx="22" ry="11" fill="#ff8a65" />
      <circle cx="16" cy="-2" r="10" fill="#ff8a65" />
      <polygon points="10,-8 14,-20 18,-6" fill="#e64a19" />
      <polygon points="18,-6 26,-16 22,-4" fill="#e64a19" />
      <circle cx="19" cy="-3" r="1.3" fill="#263238" />
    </Bob>
  );
}

function Goat({ x, y, scale = 1 }) {
  return (
    <Bob x={x} y={y}>
      <g transform={`scale(${scale})`}>
        <ellipse cx="0" cy="8" rx="18" ry="12" fill="#f5f5f5" />
        <circle cx="14" cy="-4" r="9" fill="#f5f5f5" />
        <path d="M10 -10 l-2 -10" stroke="#8d6e63" strokeWidth="2" />
        <path d="M16 -10 l2 -10" stroke="#8d6e63" strokeWidth="2" />
        <circle cx="16" cy="-5" r="1.2" fill="#263238" />
      </g>
    </Bob>
  );
}

function Troll({ x, y, down = false }) {
  return (
    <Bob x={x} y={y}>
      <g transform={down ? "rotate(70)" : undefined}>
        <rect x="-12" y="0" width="24" height="26" rx="8" fill="#7cb342" />
        <circle cx="0" cy="-10" r="11" fill="#8bc34a" />
        <circle cx="-4" cy="-10" r="1.4" fill="#263238" />
        <circle cx="4" cy="-10" r="1.4" fill="#263238" />
      </g>
    </Bob>
  );
}

function Bridge() {
  return (
    <g>
      <path d="M40 130 Q160 70 280 130" fill="none" stroke="#8d6e63" strokeWidth="14" />
      <path d="M70 130 L70 150 M250 130 L250 150" stroke="#6d4c41" strokeWidth="6" />
    </g>
  );
}

function Duck({ x, y, swan = false }) {
  return (
    <Bob x={x} y={y}>
      <ellipse cx="0" cy="8" rx="16" ry="10" fill={swan ? "#f5f5f5" : "#b0bec5"} />
      <circle cx="12" cy="-2" r="8" fill={swan ? "#f5f5f5" : "#90a4ae"} />
      <path d={swan ? "M8 -8 q8 -16 4 -4" : "M14 -2 l8 1"} stroke="#ffb300" strokeWidth="2" fill="none" />
      <circle cx="14" cy="-4" r="1.2" fill="#263238" />
    </Bob>
  );
}

function Jack({ x, y }) {
  return (
    <Bob x={x} y={y}>
      <circle cx="0" cy="-10" r="9" fill="#ffcc80" />
      <rect x="-8" y="0" width="16" height="20" rx="4" fill="#42a5f5" />
      <circle cx="-3" cy="-10" r="1.2" fill="#263238" />
      <circle cx="3" cy="-10" r="1.2" fill="#263238" />
    </Bob>
  );
}

function Bean({ height }) {
  return (
    <path
      d={`M70 150 C 90 ${150 - height}, 110 ${140 - height}, 150 ${150 - height}`}
      fill="none"
      stroke="#43a047"
      strokeWidth="6"
    />
  );
}

// Stories without hand-drawn art: their emoji cast in the same sky scene.
// Each sentence moves the spotlight to the next character.
function CastScene({ cast, scene }) {
  const spots = cast.length;
  return (
    <Sky>
      {cast.map((emoji, index) => {
        const lead = scene % spots === index;
        const x = 60 + index * (200 / Math.max(1, spots - 1)) + (lead ? (scene % 2 ? 8 : -8) : 0);
        return (
          <Bob key={emoji} x={x} y={lead ? 104 : 118}>
            <text x="0" y="0" textAnchor="middle" fontSize={lead ? 54 : 40}>
              {emoji}
            </text>
          </Bob>
        );
      })}
    </Sky>
  );
}

export default function StoryArt({ storyId, scene, cast = [] }) {
  const art = {
    pigs: (
      <Sky>
        {scene < 1 && (
          <>
            <Pig x={70} y={112} />
            <Pig x={140} y={116} scale={0.85} />
            <Pig x={210} y={110} />
          </>
        )}
        {scene === 1 && (
          <>
            <House x={180} y={70} wall="#ffe082" />
            <Pig x={80} y={114} />
          </>
        )}
        {scene === 2 && (
          <>
            <House x={180} y={70} wall="#bcaaa4" />
            <Pig x={80} y={114} />
          </>
        )}
        {scene === 3 && (
          <>
            <House x={180} y={70} wall="#e57373" />
            <Pig x={80} y={114} />
          </>
        )}
        {scene === 4 && (
          <>
            <House x={40} y={70} wall="#ffe082" />
            <House x={130} y={70} wall="#bcaaa4" />
            <Wolf x={230} y={112} />
          </>
        )}
        {scene >= 5 && (
          <>
            <House x={150} y={70} wall="#e57373" />
            <Pig x={40} y={116} scale={0.8} />
            <Pig x={90} y={112} />
          </>
        )}
      </Sky>
    ),
    goldilocks: (
      <Sky ground="#ffe0b2">
        <House x={190} y={68} wall="#fff3e0" />
        {scene < 5 ? <Girl x={70 + scene * 18} y={112} /> : <Girl x={40} y={112} />}
        {scene >= 1 && scene < 5 && <circle cx="150" cy="118" r="8" fill={scene === 2 ? "#ffcc80" : "#90caf9"} />}
        {scene >= 5 && (
          <>
            <Bear x={150} y={108} />
            <Bear x={210} y={116} small />
          </>
        )}
      </Sky>
    ),
    tortoise: (
      <Sky>
        <Hare x={scene >= 3 && scene < 5 ? 200 : 60 + scene * 20} y={scene >= 3 && scene < 5 ? 100 : 108} rest={scene >= 3 && scene < 5} />
        <Tortoise x={40 + scene * 28} y={118} />
      </Sky>
    ),
    hen: (
      <Sky ground="#dce775">
        <Hen x={scene < 5 ? 80 + scene * 16 : 180} y={112} />
        {scene >= 4 && <rect x="70" y="112" width="28" height="16" rx="4" fill="#ffcc80" />}
      </Sky>
    ),
    gingerbread: (
      <Sky>
        {scene < 4 && <Ginger x={60 + scene * 40} y={112} />}
        {scene >= 2 && scene < 5 && <circle cx={40 + scene * 10} cy="116" r="8" fill="#ffcc80" />}
        {scene >= 4 && <Fox x={scene === 5 ? 150 : 210} y={112} />}
        {scene >= 5 && <Ginger x={190} y={100} />}
      </Sky>
    ),
    goats: (
      <Sky ground="#81c784">
        <Bridge />
        {scene < 5 && <Troll x={150} y={scene >= 4 ? 138 : 118} down={scene >= 4} />}
        {scene < 2 && <Goat x={40} y={100} scale={0.7} />}
        {scene === 2 && <Goat x={120} y={78} scale={0.7} />}
        {scene === 3 && <Goat x={170} y={76} />}
        {scene >= 4 && <Goat x={210} y={96} scale={1.15} />}
        {scene >= 5 && (
          <>
            <Goat x={70} y={108} scale={0.7} />
            <Goat x={120} y={106} />
          </>
        )}
      </Sky>
    ),
    duckling: (
      <Sky ground={scene >= 4 ? "#c5e1a5" : scene >= 3 ? "#eceff1" : "#aed581"}>
        <Duck x={50 + scene * 24} y={116} swan={scene >= 4} />
        {scene < 3 && <Duck x={200} y={112} />}
      </Sky>
    ),
    jack: (
      <Sky>
        <Bean height={scene < 1 ? 20 : 40 + scene * 16} />
        <Jack x={scene < 2 ? 70 : scene < 4 ? 150 : 80} y={scene === 2 || scene === 3 ? 70 : 112} />
        {scene >= 3 && scene < 5 && <circle cx="230" cy="70" r="16" fill="#8d6e63" />}
      </Sky>
    ),
  };

  return <div className="stage">{art[storyId] ?? <CastScene cast={cast} scene={scene} />}</div>;
}
