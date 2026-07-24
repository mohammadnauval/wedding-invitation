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
    <section id="event" ref={ref} className="py-16 bg-[var(--color-bg)]">
      <div className={`section-container ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">Wedding Events</h2>
        <p className="section-subtitle">Rangkaian Acara</p>

        <div className="space-y-8">
          {events.map((event, index) => (
            <div
              key={event.id || index}
              className="text-center p-6 border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-soft)]"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                {event.title}
              </h3>

              <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
                <p>{formatDate(event.event_date)}</p>
                <p>
                  {formatTime(event.start_time)}
                  {event.end_time ? ` - ${formatTime(event.end_time)}` : ' - Selesai'}
                </p>
                <p className="font-medium text-[var(--color-text)]">{event.venue}</p>
                <p className="text-xs">{event.address}</p>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                {event.maps_url && (
                  <a
                    href={event.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-xs py-2"
                  >
                    Buka Google Maps
                  </a>
                )}
                <a
                  href={generateCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--color-primary)] hover:underline"
                >
                  Save the Date
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
