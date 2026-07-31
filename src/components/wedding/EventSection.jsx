import React from 'react';
import useInView from '../../hooks/useInView';

function EventSection({ weddingData }) {
  const [ref, inView] = useInView();
  const events = weddingData?.events || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const generateCalendarUrl = (event) => {
    const startDate = new Date(`${event.event_date}T${event.start_time}`);
    const endDate = event.end_time
      ? new Date(`${event.event_date}T${event.end_time}`)
      : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatCalDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatCalDate(startDate)}/${formatCalDate(endDate)}&location=${encodeURIComponent(event.venue + ', ' + event.address)}&details=${encodeURIComponent('Wedding Event')}`;
  };

  return (
    <section id="event" ref={ref} className="relative pt-32 pb-16 overflow-hidden bg-[var(--color-bg-soft)]">
      {/* Background border */}
      <div className="absolute inset-0">
        <img src="/images/background_border_fix.png" alt="" className="w-full h-full object-fill" />
      </div>

      <div className={`section-container relative z-10 px-10 pt-20 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">The Events</h2>
        <p className="section-subtitle font-bold drop-shadow-sm">Join us to celebrate our love</p>

        <div className="relative">
          {/* Venue image behind cards */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img src="/images/venue_background.jpg.jpg" alt="" className="w-full h-full object-cover opacity-50" />
          </div>

          <div className="relative z-10 space-y-6">
          {events.map((event, index) => (
            <div
              key={event.id || index}
              className="text-center p-6 rounded-3xl bg-white/40 backdrop-blur-sm border border-white/30"
            >
              <h3 className="font-couple text-2xl text-[var(--color-primary)] mb-3">
                {event.title}
              </h3>

              <div className="space-y-1.5 text-sm text-[var(--color-text-muted)]">
                <p className="font-medium">{formatDate(event.event_date)}</p>
                <p>
                  {formatTime(event.start_time)}
                  {event.end_time ? ` - ${formatTime(event.end_time)}` : ' - Selesai'}
                </p>
                <p className="font-bold text-[var(--color-primary)]">{event.venue}</p>
                <p className="text-xs font-medium text-[var(--color-text)]">{event.address}</p>
              </div>

              <div className="flex flex-col gap-2 mt-5">
                {event.maps_url && (
                  <a
                    href={event.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-xs py-2.5"
                  >
                    Open Maps
                  </a>
                )}
                <a
                  href={generateCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[var(--color-primary)] hover:underline tracking-wider uppercase"
                >
                  + Add to Calendar
                </a>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventSection;
