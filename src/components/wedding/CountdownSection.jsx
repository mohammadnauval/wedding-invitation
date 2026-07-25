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

        {/* Calendar visual */}
        {calendar && (
          <div className="mb-8 mx-auto max-w-[320px]">
            <div className="bg-[#faf8f5] rounded-2xl overflow-hidden shadow-sm">
              {/* Calendar top bar - thick hand-drawn style */}
              <div className="h-4 bg-[var(--color-text)] rounded-t-2xl" style={{
                borderRadius: '16px 16px 0 0',
                borderBottom: '3px solid var(--color-text)',
              }} />
              
              {/* Month name */}
              <div className="pt-5 pb-3 text-center">
                <p className="text-base tracking-[0.4em] text-[var(--color-text)] font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {calendar.month}
                </p>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 px-5">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center py-1">
                    <span className="text-xs font-medium text-[var(--color-text)]">{day}</span>
                  </div>
                ))}
              </div>

              {/* Day numbers */}
              <div className="grid grid-cols-7 px-5 pb-6 pt-2">
                {calendar.days.map((date, index) => (
                  <div key={index} className="text-center py-1">
                    {index === calendar.highlightIndex ? (
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-bg)] text-[var(--color-text)] font-bold text-lg">
                        {date}
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-10 h-10 text-base font-bold text-[var(--color-text)]">
                        {date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
