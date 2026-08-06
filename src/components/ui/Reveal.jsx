import { useEffect, useRef, useState } from "react";

/* ============================================================
   Reveal-on-scroll wrapper (replaces AOS — no extra dependency)
   ============================================================ */
const Reveal = ({ children, delay = 0, as: Tag = "div", className = "" }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`u-reveal ${inView ? "u-in-view" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;