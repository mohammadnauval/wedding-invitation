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
    <section ref={ref} className="py-16 bg-[var(--color-bg-soft)]">
      <div className={`section-container ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">Counting Days</h2>
        <p className="section-subtitle">Menuju Hari Bahagia</p>

        {isPast ? (
          <div className="text-center">
            <p className="font-script text-2xl text-[var(--color-primary)]">
              {weddingData?.content?.countdown_message || 'Today is Our Special Day'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: timeLeft.days, label: 'Hari' },
              { value: timeLeft.hours, label: 'Jam' },
              { value: timeLeft.minutes, label: 'Menit' },
              { value: timeLeft.seconds, label: 'Detik' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-[var(--color-bg)] rounded-xl p-3 shadow-sm border border-[var(--color-border)]">
                  <span className="text-2xl md:text-3xl font-semibold text-[var(--color-primary)]">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[10px] tracking-wider uppercase text-[var(--color-text-muted)] mt-2">
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
