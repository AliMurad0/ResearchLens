/**
 * A small, hand-built line-icon set instead of a generic library.
 * Every icon shares: viewBox 0 0 24 24, stroke="currentColor", strokeWidth 1.6,
 * round caps/joins, no fill. This keeps the whole set visually coherent.
 */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Svg({ children, size = 18, className = "" }) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <Svg {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" />
    </Svg>
  );
}

export function IconDocument(props) {
  return (
    <Svg {...props}>
      <path d="M6.5 3.5h8l4 4v13a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 12.5h6M9 15.5h6M9 9.5h2.5" />
    </Svg>
  );
}

export function IconStack(props) {
  return (
    <Svg {...props}>
      <path d="M4 8.5 12 5l8 3.5-8 3.5-8-3.5Z" />
      <path d="M4 13 12 16.5 20 13" />
      <path d="M4 17.5 12 21l8-3.5" />
    </Svg>
  );
}

export function IconCompass(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2 13 13l-3.8 1.8L11 11l3.8-1.8Z" />
    </Svg>
  );
}

export function IconFolder(props) {
  return (
    <Svg {...props}>
      <path d="M3.5 6.5a1 1 0 0 1 1-1H10l2 2.2h7.5a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V6.5Z" />
    </Svg>
  );
}

export function IconClock(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

export function IconPlus(props) {
  return (
    <Svg {...props}>
      <path d="M12 5.5v13M5.5 12h13" />
    </Svg>
  );
}

export function IconChevronDown(props) {
  return (
    <Svg {...props}>
      <path d="M5.5 8.5 12 15l6.5-6.5" />
    </Svg>
  );
}

export function IconExternal(props) {
  return (
    <Svg {...props}>
      <path d="M9 6.5H6.5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V15" />
      <path d="M14 5.5h4.5V10M18.3 5.7 11 13" />
    </Svg>
  );
}

export function IconCopy(props) {
  return (
    <Svg {...props}>
      <rect x="8.5" y="8.5" width="11" height="11" rx="1.2" />
      <path d="M15.5 8.5V5.7a1 1 0 0 0-1-1H5.7a1 1 0 0 0-1 1v8.8a1 1 0 0 0 1 1h2.8" />
    </Svg>
  );
}

export function IconScales(props) {
  return (
    <Svg {...props}>
      <path d="M12 4v16M8 20h8" />
      <path d="M12 6.5 5 8l3.3 6.5a3.3 3.3 0 0 0 3.4 0L5 8" />
      <path d="M12 6.5 19 8l-3.3 6.5a3.3 3.3 0 0 1-3.4 0L19 8" />
    </Svg>
  );
}

export function IconTrend(props) {
  return (
    <Svg {...props}>
      <path d="M4 17 9.5 10l4 3.5L20 6" />
      <path d="M14.5 6H20v5.5" />
    </Svg>
  );
}

export function IconCluster(props) {
  return (
    <Svg {...props}>
      <circle cx="7" cy="7" r="2.3" />
      <circle cx="17" cy="6.5" r="1.8" />
      <circle cx="17.5" cy="17" r="2.3" />
      <circle cx="7.5" cy="16.5" r="1.6" />
      <path d="M9 8.3 15.3 6.8M9.2 15 16 16.3" />
    </Svg>
  );
}

export function IconDownload(props) {
  return (
    <Svg {...props}>
      <path d="M12 4v11.5M8 12l4 4 4-4" />
      <path d="M5 18.5h14" />
    </Svg>
  );
}

export function IconQuote(props) {
  return (
    <Svg {...props}>
      <path d="M5 9.5c0-2.2 1.6-3.8 3.8-4M5 9.5v5c0 1.4 1 2.5 2.5 2.5S10 15.9 10 14.5c0-1.3-.9-2.3-2.1-2.5" />
      <path d="M13.5 9.5c0-2.2 1.6-3.8 3.8-4M13.5 9.5v5c0 1.4 1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-1.3-.9-2.3-2.1-2.5" />
    </Svg>
  );
}

export function IconClose(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function IconArrowDown(props) {
  return (
    <Svg {...props}>
      <path d="M12 4.5v14M6 13l6 6 6-6" />
    </Svg>
  );
}

export function IconSliders(props) {
  return (
    <Svg {...props}>
      <path d="M5 7h9M17.5 7H19" />
      <path d="M5 12h4.5M12 12h7" />
      <path d="M5 17h11.5M19.5 17H19" />
      <circle cx="12.5" cy="7" r="1.8" />
      <circle cx="9.5" cy="12" r="1.8" />
      <circle cx="16.5" cy="17" r="1.8" />
    </Svg>
  );
}

export function IconCheck(props) {
  return (
    <Svg {...props}>
      <path d="M5 12.5 9.5 17 19 7" />
    </Svg>
  );
}

export function IconSun(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v2.2M12 18.8V21M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3 12h2.2M18.8 12H21M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </Svg>
  );
}

export function IconMoon(props) {
  return (
    <Svg {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
    </Svg>
  );
}
