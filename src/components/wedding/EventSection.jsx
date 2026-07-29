import React from 'react';
import useInView from '../../hooks/useInView';
import { LeafBranch, FloralCorner, SmallFlower } from './FloralOrnament';

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
    <section id="event" ref={ref} className="relative py-16 overflow-hidden">
      {/* Venue background image */}
      <div className="absolute inset-0">
        <img src="/images/venue_background.jpg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[var(--color-bg)]/60" />
      </div>

      {/* Floral ornaments */}
      <LeafBranch className="absolute top-6 -left-6 opacity-50 rotate-12" />
      <LeafBranch className="absolute bottom-6 -right-6 opacity-50 -rotate-12" flip />
      <FloralCorner className="absolute bottom-0 left-0 -scale-y-100" size={70} />
      <FloralCorner className="absolute bottom-0 right-0 -scale-x-100 -scale-y-100" size={70} />
      <SmallFlower className="absolute top-12 right-10 opacity-60" size={22} />
      <SmallFlower className="absolute bottom-16 left-8 opacity-60" size={18} />

      <div className={`section-container relative z-10 ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title drop-shadow-sm">The Events</h2>
        <p className="section-subtitle text-[var(--color-primary)] font-semibold drop-shadow-sm">Join us to celebrate our love</p>

        <div className="space-y-6">
          {events.map((event, index) => (
            <div
              key={event.id || index}
              className="text-center p-6 rounded-3xl bg-white/70 backdrop-blur-sm border border-white/50"
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
                <p className="font-bold text-[var(--color-text)]">{event.venue}</p>
                <p className="text-xs">{event.address}</p>
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
    </section>
  );
}

export default EventSection;
