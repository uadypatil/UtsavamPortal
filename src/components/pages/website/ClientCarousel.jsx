import React, { useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';

import event1 from '../../../assets/event1.jpeg';
import event2 from '../../../assets/event2.jpeg';
import event3 from '../../../assets/event3.jpeg';
import event4 from '../../../assets/event4.jpeg';
import event5 from '../../../assets/event5.jpeg';
import event6 from '../../../assets/event6.jpeg';

const events = [
  { src: event1, name: 'Ganesh Utsav' },
  { src: event2, name: 'Diwali Mela' },
  { src: event3, name: 'Navratri Fest' },
  { src: event4, name: 'Christmas Night' },
  { src: event5, name: 'Eid Celebration' },
  { src: event6, name: 'Ganesh Utsav' },
  { src: event1, name: 'Diwali Mela' },
  { src: event2, name: 'Navratri Fest' },
  { src: event3, name: 'Christmas Night' },
  { src: event4, name: 'Eid Celebration' },
];

function ClientCarousel() {
  const carouselRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    const items = carousel.querySelectorAll('.client-item');
    const wrapper = wrapperRef.current;

    const updateHighlight = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(wrapperCenter - itemCenter);
        if (distance < itemRect.width / 2) {
          item.classList.add('highlight');
        } else {
          item.classList.remove('highlight');
        }
      });
    };

    const loop = () => {
      updateHighlight();
      requestAnimationFrame(loop);
    };

    loop();
  }, []);

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="carousel-wrapper" ref={wrapperRef}>
      <div className="client-carousel-container" ref={carouselRef}>
        {events.map((event, index) => (
          <div className="client-item" key={index} data-aos="zoom-in">
            <img src={event.src} alt={event.name} />
            <div className="client-name">{event.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientCarousel;
