import React, { useRef, useState, useEffect } from 'react';

export interface CarouselItem {
  id: string;
  children: React.ReactNode;
}

export interface CarouselProps {
  items: CarouselItem[];
  ariaLabel?: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  ariaLabel = 'Image Carousel',
  className,
  autoPlay,
  autoPlayInterval = 3000,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (!autoPlay || hovered || focused || !visible) return;
    const t = setInterval(() => {
      const scroller = trackRef.current;
      if (!scroller) return;
      const { scrollLeft, clientWidth, scrollWidth } = scroller;
      if (scrollLeft + clientWidth >= scrollWidth - 10) scroller.scrollTo({ left: 0, behavior: 'instant' as ScrollBehavior });
      else scroller.scrollBy({ left: clientWidth, behavior: 'smooth' });
    }, autoPlayInterval);
    return () => clearInterval(t);
  }, [autoPlay, hovered, focused, visible, autoPlayInterval]);

  const onScrollEnd = () => {
    const scroller = trackRef.current;
    if (!scroller) return;
    const { scrollLeft, clientWidth } = scroller;
    setActive(Math.round(scrollLeft / clientWidth));
  };

  const scrollTo = (i: number) => {
    const scroller = trackRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: scroller.clientWidth * i, behavior: 'smooth' });
    setActive(i);
  };

  const prev = () => scrollTo(Math.max(0, active - 1));
  const next = () => scrollTo(Math.min(items.length - 1, active + 1));

  return (
    <section
      aria-label={ariaLabel}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <div ref={trackRef} onScrollEnd={onScrollEnd} className="q-carousel-track" tabIndex={0}>
        {items.map((item, i) => (
          <div key={item.id ?? i} className="q-carousel-slide">
            {item.children}
          </div>
        ))}
      </div>
      <div className="q-carousel-controls">
        <button type="button" onClick={prev} disabled={active === 0} className="q-carousel-btn" aria-label="Previous">
          ‹
        </button>
        <button type="button" onClick={next} disabled={active === items.length - 1} className="q-carousel-btn" aria-label="Next">
          ›
        </button>
      </div>
      <div className="q-carousel-pagination" role="tablist">
        {items.map((item, i) => (
          <button
            key={item.id ?? i}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => scrollTo(i)}
            className={`q-carousel-dot ${active === i ? 'q-active' : ''}`.trim()}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
