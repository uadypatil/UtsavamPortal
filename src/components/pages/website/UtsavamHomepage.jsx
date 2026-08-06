import React, { useEffect } from "react";
// Bootstrap must be installed in the host project: npm install bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../App.css";
import Hero from "../../ui/Hero";
import MarigoldThread from "../../ui/MarigoldThread";
import Spirit from "../../ui/Spirit";
import Evolution from "../../ui/Evolution";
import Features from "../../ui/Features";
import Impact from "../../ui/Impact";
import Journey from "../../ui/Journey";
import Experience from "../../ui/Experience";
import { Truck } from "lucide-react";
import ConnectedMandals from "../../ui/ConnectedMandals";
import Testimonials from "../../ui/Testimonials";
import FAQ from "../../ui/FAQ";
import Join from "../../ui/Join";
import Footer from "../../ui/Footer";


/* ============================================================
   Root component
   ============================================================ */
export default function UtsavamHomepage() {
  useEffect(() => {
    document.body.classList.add("u-body");
    return () => document.body.classList.remove("u-body");
  }, []);

  return (
    <div className="u-page">
      <Hero />
      <MarigoldThread />
      <Spirit />
      <Evolution />
      <Features />
      <Impact />
      <Journey />
      <Experience />
      <Truck />
      <ConnectedMandals />
      <Testimonials />
      <FAQ />
      <Join />
      <Footer />
    </div>
  );
}