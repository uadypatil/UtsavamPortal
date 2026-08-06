
const Icon = ({ path, size = 22, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    {path}
  </svg>
);

export default Icon;