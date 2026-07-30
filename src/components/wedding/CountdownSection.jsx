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

  // Generate calendar week for the wedding date
  const getCalendarWeek = () => {
    if (!mainEvent?.event_date) return null;
    const weddingDay = new Date(mainEvent.event_date);
    const dayOfWeek = weddingDay.getDay(); // 0 = Sun
    const startOfWeek = new Date(weddingDay);
    startOfWeek.setDate(weddingDay.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d.getDate());
    }

    const month = weddingDay.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const highlightIndex = dayOfWeek;

    return { days, month, highlightIndex };
  };

  const calendar = getCalendarWeek();

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-[var(--color-bg)]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="/images/counting_days_background_fix.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[var(--color-bg)]/50" />
      </div>

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
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Min' },
              { value: timeLeft.seconds, label: 'Sec' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-[var(--color-primary)] rounded-xl p-2.5 shadow-md shadow-[var(--color-primary)]/20">
                  <span className="text-xl md:text-2xl font-bold text-[var(--color-bg-soft)]">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[9px] font-bold tracking-wider uppercase text-[var(--color-primary)] mt-1.5">
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
