type Name = 'chevron-left' | 'chevron-right' | 'lock' | 'star';

const PATHS: Record<Name, JSX.Element> = {
  'chevron-left': <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  'chevron-right': <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="3" fill="currentColor" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </>
  ),
  star: <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="currentColor" strokeLinejoin="round" />,
};

export default function Icon({ name, className }: { name: Name; className?: string }) {
  return (
    <svg className={`icon ${className ?? ''}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  );
}

export function Stars({ count, label }: { count: number; label?: boolean }) {
  return (
    <span className="stars" role="img" aria-label={`${count} yıldız`}>
      {[1, 2, 3].map((i) => (
        <Icon key={i} name="star" className={i <= count ? 'on' : 'off'} />
      ))}
      {label && <span className="visually-hidden">{count} / 3</span>}
    </span>
  );
}
