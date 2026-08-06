

const BrandMark = ({ size = 26 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="url(#u-g1)" strokeWidth="2" />
      <path d="M16 9c-2 3-2 5 0 7 2-2 2-4 0-7z" fill="url(#u-g1)" />
      <path d="M11 20c1.6-2.4 3.2-3.6 5-3.6s3.4 1.2 5 3.6" stroke="url(#u-g1)" strokeWidth="1.6" strokeLinecap="round" />
      <defs>
        <linearGradient id="u-g1" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#DD7A3E" /><stop offset="1" stopColor="#A63E2E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default BrandMark;