import { React, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import NavbarCustom from '../includes/NavbarCustom';
import UtsavamHomepage from './UtsavamHomepage';

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: true,     // whether animation should happen only once
    });
  }, []);

  return (
    <>
      <NavbarCustom />
      <UtsavamHomepage />
    </>
  )
}

export default Home
