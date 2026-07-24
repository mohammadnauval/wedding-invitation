import React from 'react';
import useInView from '../../hooks/useInView';

function LoveStorySection({ weddingData }) {
  const [ref, inView] = useInView();
  const stories = weddingData?.loveStories || [];

  if (stories.length === 0) return null;

  return (
    <section ref={ref} className="py-16 bg-[var(--color-bg-soft)]">
      <div className={`section-container ${inView ? 'fade-up' : 'opacity-0'}`}>
        <h2 className="section-title">Our Love Story</h2>
        <p className="section-subtitle">Perjalanan Cinta Kami</p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-border)]" />

          {stories.map((story, index) => (
            <div key={story.id || index} className="relative pl-12 pb-10 last:pb-0">
              {/* Timeline dot */}
              <div className="absolute left-3 top-1 w-3 h-3 rounded-full bg-[var(--color-primary-light)] border-2 border-white" />

              <p className="text-xs tracking-wider text-[var(--color-primary)] mb-1">
                {story.date}
              </p>
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2">
                {story.title}
              </h4>
              <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                {story.description}
              </p>
              {story.image_url && (
                <img
                  src={story.image_url}
                  alt={story.title}
                  className="mt-3 w-full h-32 object-cover rounded-lg"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LoveStorySection;
