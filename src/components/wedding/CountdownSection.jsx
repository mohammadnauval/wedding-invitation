import React, { useState, useEffect } from 'react';
import useInView from '../../hooks/useInView';

function CountdownSection({ weddingData }) {
  const [ref, inView] = useInView();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  const mainEvent = weddingData?.events?.find(e => e.is_main_event) || weddingData?.events?.[0];
  const targetDate = mainEvent?.event_date && mainEvent?.start_time
    ? new Date(`${mainEvent.event_date}T${mainEvent.start_time}`)
    : null;

  useEffect(() => {
    if (!targetDate) return;

    const calculate = () => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        setIsPast(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) return null;

  return (
    <section ref={ref} className="relative py-16 overflow-hidden" style={{
      background: 'linear-gradient(135deg, var(--color-bg-soft) 0%, var(--color-bg-muted) 50%, var(--color-bg-soft) 100%)'
    }}>
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />

      <div className={`section-container relative z-10 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">Counting Days</h2>
        <p className="section-subtitle">Until we say "I do"</p>

        {isPast ? (
          <div className="text-center">
            <p className="font-couple text-3xl text-[var(--color-primary)]">
              {weddingData?.content?.countdown_message || "Today is Our Day! 💍"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Min' },
              { value: timeLeft.seconds, label: 'Sec' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-[var(--color-primary)] rounded-2xl p-4 shadow-lg shadow-[var(--color-primary)]/20 border border-[var(--color-primary-dark)]/20">
                  <span className="text-3xl md:text-4xl font-bold text-[var(--color-bg-soft)]">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-primary)] mt-2">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CountdownSection;
