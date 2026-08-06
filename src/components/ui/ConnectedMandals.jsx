
import Reveal from './Reveal';
/* ============================================================
   Connected Mandals (marquee)
   ============================================================ */
   
const MANDAL_NAMES = [
  "Shree Ganesh Mitra Mandal", "Lokmanya Seva Mandal", "Sarvajanik Utsav Mandal",
  "Ganraj Mitra Mandal", "Ekta Sarvajanik Mandal", "Vighnaharta Mandal",
  "Navjeevan Mitra Mandal", "Om Ganesh Sarvajanik Mandal", "Sarvoday Mitra Mandal",
  "Shivneri Sarvajanik Mandal",
];

const ConnectedMandals = () => {
  const row1 = [...MANDAL_NAMES, ...MANDAL_NAMES];
  const row2 = [...MANDAL_NAMES].reverse();
  const row2dup = [...row2, ...row2];

  const Chip = ({ name }) => (
    <div className="u-mandal-chip">
      <span className="u-mandal-badge">{name.charAt(0)}</span>
      {name}
    </div>
  );

  return (
    <section className="u-section" style={{ background: "var(--warm-white)" }}>
      <div className="container">
        <Reveal>
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 620 }}>
            <div className="u-eyebrow justify-content-center">Connected Mandals</div>
            <h2 className="u-title mx-auto">Who already trusts UTSAVAM.</h2>
          </div>
        </Reveal>
      </div>
      <Reveal delay={60}>
        <div className="u-marquee-row">
          <div className="u-marquee">{row1.map((n, i) => <Chip name={n} key={i} />)}</div>
        </div>
        <div className="u-marquee-row u-reverse">
          <div className="u-marquee">{row2dup.map((n, i) => <Chip name={n} key={i} />)}</div>
        </div>
      </Reveal>
    </section>
  );
}

export default ConnectedMandals;