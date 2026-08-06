import React, { useState, useEffect } from 'react';

const BASE_NAV_ITEMS = [
  { id: 'home',      label: 'Home',      icon: '♡' },
  { id: 'greeting',  label: 'Doa',       icon: '✿' },
  { id: 'couple',    label: 'Couple',    icon: '✦' },
  { id: 'event',     label: 'Event',     icon: '◆' },
  { id: 'countdown', label: 'Countdown', icon: '◎' },
  { id: 'rsvp',      label: 'RSVP',      icon: '✉', setting: 'rsvp_enabled' },
  { id: 'gallery',   label: 'Gallery',   icon: '▣' },
];

function FloatingNav({ weddingData }) {
  const [activeSection, setActiveSection] = useState('home');

  // Only show nav items whose corresponding section is actually rendered
  const navItems = BASE_NAV_ITEMS.filter(item => {
    if (item.id === 'gallery') return true; // Gallery always rendered (reads manifest.json)
    if (item.setting) {
      return weddingData?.settings?.[item.setting] === '1';
    }
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.id,
        el: document.getElementById(item.id),
      })).filter(s => s.el);

      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-primary)] rounded-full px-5 py-2.5 shadow-xl shadow-[var(--color-primary)]/30">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollTo(item.id)}
              className={`flex flex-col items-center px-3 py-1 rounded-full text-[10px] transition-all ${
                activeSection === item.id
                  ? 'text-[var(--color-bg)] bg-white/20'
                  : 'text-[var(--color-bg-soft)]/70'
              }`}
              aria-label={item.label}
            >
              <span className="text-sm">{item.icon}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default FloatingNav;
