import { useEffect,  useRef, useState } from "react";

/* ============================================================
   Animated counter (used in the Festival Impact band)
   ============================================================ */
const Counter = ({ value, prefix = "", suffix = "" }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1400;
            const start = performance.now();
            function tick(now) {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(Math.floor(eased * value));
              if (p < 1) requestAnimationFrame(tick);
              else setDisplay(value);
            }
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="u-num">
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default Counter;