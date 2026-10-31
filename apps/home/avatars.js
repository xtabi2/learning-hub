// Kid-friendly cartoon animal faces, drawn as inline SVG (no external or paid assets).
const eyes = (y = 52, c = "#2d2a26") =>
  `<circle cx="38" cy="${y}" r="5" fill="${c}"/><circle cx="62" cy="${y}" r="5" fill="${c}"/>` +
  `<circle cx="40" cy="${y - 2}" r="1.6" fill="#fff"/><circle cx="64" cy="${y - 2}" r="1.6" fill="#fff"/>`;
const cheeks = `<circle cx="28" cy="64" r="5" fill="#ff8a80" opacity=".55"/><circle cx="72" cy="64" r="5" fill="#ff8a80" opacity=".55"/>`;
const smile = (y = 66) => `<path d="M44 ${y} q6 6 12 0" stroke="#2d2a26" stroke-width="3" fill="none" stroke-linecap="round"/>`;

const ART = {
  cat: { label: "Cat", svg:
    `<path d="M20 40 L24 12 L44 30Z M80 40 L76 12 L56 30Z" fill="#ffb74d"/><path d="M26 34 L27 20 L38 30Z M74 34 L73 20 L62 30Z" fill="#ffccbc"/>` +
    `<circle cx="50" cy="56" r="32" fill="#ffb74d"/>${eyes()}${cheeks}<path d="M47 60 h6 l-3 4z" fill="#e57373"/>${smile(66)}` +
    `<path d="M18 58 h14 M18 64 h14 M68 58 h14 M68 64 h14" stroke="#8d6e63" stroke-width="2" stroke-linecap="round"/>` },
  bunny: { label: "Bunny", svg:
    `<ellipse cx="36" cy="22" rx="9" ry="22" fill="#f5f5f5"/><ellipse cx="64" cy="22" rx="9" ry="22" fill="#f5f5f5"/>` +
    `<ellipse cx="36" cy="22" rx="4.5" ry="15" fill="#f8bbd0"/><ellipse cx="64" cy="22" rx="4.5" ry="15" fill="#f8bbd0"/>` +
    `<circle cx="50" cy="60" r="30" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="2"/>${eyes(56)}${cheeks}<ellipse cx="50" cy="64" rx="4" ry="3" fill="#f48fb1"/>${smile(70)}` },
  monkey: { label: "Monkey", svg:
    `<circle cx="18" cy="54" r="12" fill="#8d6e63"/><circle cx="82" cy="54" r="12" fill="#8d6e63"/><circle cx="18" cy="54" r="7" fill="#ffcc80"/><circle cx="82" cy="54" r="7" fill="#ffcc80"/>` +
    `<circle cx="50" cy="52" r="32" fill="#8d6e63"/><path d="M50 40 c-22 -6 -26 20 -14 26 c-4 14 32 14 28 0 c12 -6 8 -32 -14 -26z" fill="#ffcc80"/>` +
    `${eyes(50)}<ellipse cx="50" cy="62" rx="5" ry="3" fill="#5d4037"/>${smile(68)}` },
  dog: { label: "Puppy", svg:
    `<ellipse cx="22" cy="46" rx="11" ry="20" fill="#795548"/><ellipse cx="78" cy="46" rx="11" ry="20" fill="#795548"/>` +
    `<circle cx="50" cy="54" r="30" fill="#d7ccc8"/><circle cx="62" cy="46" r="9" fill="#a1887f"/>${eyes()}${cheeks}<ellipse cx="50" cy="62" rx="6" ry="4" fill="#3e2723"/>${smile(68)}` },
  bear: { label: "Bear", svg:
    `<circle cx="24" cy="28" r="12" fill="#a1673f"/><circle cx="76" cy="28" r="12" fill="#a1673f"/><circle cx="24" cy="28" r="6" fill="#d7a77a"/><circle cx="76" cy="28" r="6" fill="#d7a77a"/>` +
    `<circle cx="50" cy="54" r="32" fill="#a1673f"/><ellipse cx="50" cy="66" rx="14" ry="10" fill="#d7a77a"/>${eyes(50)}<ellipse cx="50" cy="62" rx="5" ry="3.5" fill="#3e2723"/>${smile(68)}` },
  panda: { label: "Panda", svg:
    `<circle cx="24" cy="28" r="12" fill="#263238"/><circle cx="76" cy="28" r="12" fill="#263238"/><circle cx="50" cy="54" r="32" fill="#fafafa" stroke="#e0e0e0" stroke-width="2"/>` +
    `<ellipse cx="37" cy="52" rx="9" ry="11" fill="#263238"/><ellipse cx="63" cy="52" rx="9" ry="11" fill="#263238"/>${eyes(52, "#fff")}${cheeks}<ellipse cx="50" cy="64" rx="4" ry="3" fill="#263238"/>${smile(69)}` },
  fox: { label: "Fox", svg:
    `<path d="M18 44 L22 12 L44 32Z M82 44 L78 12 L56 32Z" fill="#ff7043"/><circle cx="50" cy="56" r="30" fill="#ff7043"/>` +
    `<path d="M22 60 q28 34 56 0 q-28 10 -56 0z" fill="#fff3e0"/>${eyes()}<circle cx="50" cy="70" r="4" fill="#3e2723"/>` },
  frog: { label: "Frog", svg:
    `<circle cx="32" cy="32" r="14" fill="#66bb6a"/><circle cx="68" cy="32" r="14" fill="#66bb6a"/><ellipse cx="50" cy="60" rx="36" ry="28" fill="#66bb6a"/>` +
    `<circle cx="32" cy="32" r="8" fill="#fff"/><circle cx="68" cy="32" r="8" fill="#fff"/><circle cx="33" cy="33" r="4.5" fill="#2d2a26"/><circle cx="67" cy="33" r="4.5" fill="#2d2a26"/>${cheeks}` +
    `<path d="M34 64 q16 14 32 0" stroke="#2d2a26" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  owl: { label: "Owl", svg:
    `<path d="M22 30 L30 16 L40 28Z M78 30 L70 16 L60 28Z" fill="#8d6e63"/><ellipse cx="50" cy="56" rx="32" ry="34" fill="#8d6e63"/>` +
    `<circle cx="37" cy="48" r="12" fill="#fff8e1"/><circle cx="63" cy="48" r="12" fill="#fff8e1"/>${eyes(48)}<path d="M46 58 L54 58 L50 66Z" fill="#ffb300"/>` +
    `<ellipse cx="50" cy="78" rx="16" ry="9" fill="#d7ccc8"/>` },
  pig: { label: "Piggy", svg:
    `<path d="M22 36 L26 16 L42 30Z M78 36 L74 16 L58 30Z" fill="#f48fb1"/><circle cx="50" cy="56" r="32" fill="#f8bbd0"/>${eyes(48)}` +
    `<ellipse cx="50" cy="64" rx="12" ry="9" fill="#f48fb1"/><circle cx="46" cy="64" r="2.5" fill="#ad1457"/><circle cx="54" cy="64" r="2.5" fill="#ad1457"/>` },
};

export function avatarLabel(id) {
  return ART[id]?.label ?? "Animal";
}

export function avatarSvg(id) {
  const art = ART[id] ?? ART.cat;
  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-avatar="${ART[id] ? id : "cat"}">${art.svg}</svg>`;
}
