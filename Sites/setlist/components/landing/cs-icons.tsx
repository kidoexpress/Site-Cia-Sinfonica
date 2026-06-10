export function Arrow({ s = 16 }: { s?: number }) {
  return (
    <svg className="arrow" width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function Play({ s = 13 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 13 13" fill="none">
      <path d="M3 2.2v8.6L11 6.5 3 2.2Z" fill="currentColor"/>
    </svg>
  );
}

export function Check({ s = 15 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function Star({ s = 13 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l1.9 4 4.3.5-3.2 2.9.9 4.3L8 11.9 4.1 13.2l.9-4.3L1.8 6l4.3-.5L8 1.5Z" fill="currentColor"/>
    </svg>
  );
}

export function Mark({ s = 26, color = "currentColor" }: { s?: number; color?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M6 20c0-5 3.2-8.5 7-8.5 5.2 0 7.8 8.5 14 8.5 3.8 0 7-3.5 7-8.5"
            stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M34 20c0 5-3.2 8.5-7 8.5-5.2 0-7.8-8.5-14-8.5-3.8 0-7 3.5-7 8.5"
            stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity=".55"/>
    </svg>
  );
}
