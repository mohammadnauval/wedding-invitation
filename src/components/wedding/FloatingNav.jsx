import React, { useState, useEffect } from 'react';

const navItems = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'couple', label: 'Couple', icon: '♥' },
  { id: 'event', label: 'Event', icon: '◈' },
  { id: 'gallery', label: 'Gallery', icon: '▣' },
  { id: 'rsvp', label: 'RSVP', icon: '✉' },
  { id: 'wishes', label: 'Wishes', icon: '✧' },
];

function FloatingNav() {
  const [activeSection, setActiveSection] = useState('home');

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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-[var(--color-border)] rounded-full px-4 py-2 shadow-lg">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollTo(item.id)}
              className={`flex flex-col items-center px-3 py-1 rounded-full text-[10px] transition-all ${
                activeSection === item.id
                  ? 'text-[var(--color-primary)] bg-[var(--color-bg-muted)]'
                  : 'text-[var(--color-text-light)]'
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
