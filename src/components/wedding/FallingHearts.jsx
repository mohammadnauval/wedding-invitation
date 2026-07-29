import React, { useEffect, useState } from 'react';

function FallingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Create initial hearts
    const initialHearts = Array.from({ length: 15 }, (_, i) => createHeart(i));
    setHearts(initialHearts);

    // Add new hearts periodically
    const interval = setInterval(() => {
      setHearts(prev => {
        const filtered = prev.filter(h => h.createdAt > Date.now() - 10000);
        return [...filtered, createHeart(Date.now())];
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  function createHeart(id) {
    return {
      id,
      left: Math.random() * 100,
      size: Math.random() * 12 + 8,
      duration: Math.random() * 4 + 6,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
      createdAt: Date.now(),
    };
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute -top-4"
          style={{
            left: `${heart.left}%`,
            animation: `heartFall ${heart.duration}s linear ${heart.delay}s infinite`,
            opacity: heart.opacity,
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 20 20"
            fill="var(--color-primary)"
          >
            <path d="M10 18 C5 13, 0 9, 0 5 C0 2, 2 0, 5 0 C7 0, 9 1.5, 10 3 C11 1.5, 13 0, 15 0 C18 0, 20 2, 20 5 C20 9, 15 13, 10 18Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default FallingHearts;
