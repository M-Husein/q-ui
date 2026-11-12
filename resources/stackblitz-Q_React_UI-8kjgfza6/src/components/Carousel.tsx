import './Carousel.css';

import React, { useRef, useState, useEffect, useEffectEvent } from 'react';
// import { Progress } from './Progress';

export interface CarouselItemProps {
  id: string;
  children: React.ReactNode;
}

export interface CarouselProps {
  items: CarouselItemProps[];
  ariaLabel?: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  // showProgress?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  ariaLabel = 'Image Carousel',
  className,
  autoPlay,
  autoPlayInterval = 3000,
  // showProgress,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // 1. Calculate progress percentage per slide (0% for item 1, 100% for last item)
  // const totalItems = items.length;
  // const progressPercent =
  //   totalItems > 1 ? (activeIndex / (totalItems - 1)) * 100 : 100;

  // 1. Listen for document visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(!document.hidden);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 2. React 19 useEffectEvent: Extracts non-reactive scroll action logic
  const onAutoPlayTick = useEffectEvent(() => {
    const scroller = trackRef.current;
    if (!scroller) return;

    const { scrollLeft, clientWidth, scrollWidth } = scroller;

    // Fixed: Use scrollTo({ left: 0 }) to reset to start instead of scrollBy({ left: 0 })
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      scroller.scrollTo({ left: 0, behavior: 'instant' });
    } else {
      scroller.scrollBy({ left: clientWidth, behavior: 'smooth' });
    }
  });

  // 3. Autoplay timer effect
  useEffect(() => {
    // Fixed: Pause autoplay if hovered, focused, touched, or tab is hidden
    if (!autoPlay || isHovered || isFocused || isTouching || !isVisible) return;

    const timer = setInterval(onAutoPlayTick, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isHovered, isFocused, isTouching, isVisible]);

  // 4. Update active slide index ONLY when scroll-snap animation completes
  const handleScrollEnd = () => {
    const scroller = trackRef.current;
    if (!scroller) return;

    const { scrollLeft, clientWidth } = scroller;
    setActiveIndex(Math.round(scrollLeft / clientWidth));
  };

  // Scroll to a specific item index using native smooth scrolling
  const scrollToSlide = (index: number) => {
    const scroller = trackRef.current;
    if (!scroller) return;

    scroller.scrollTo({
      left: scroller.clientWidth * index,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const handlePrev = () => {
    scrollToSlide(Math.max(0, activeIndex - 1));
  };

  const handleNext = () => {
    scrollToSlide(Math.min(items.length - 1, activeIndex + 1));
  };

  const handleBlur = (evt: React.FocusEvent<HTMLElement>) => {
    // Only unpause if focus moves outside the entire carousel section
    if (!evt.currentTarget.contains(evt.relatedTarget as Node)) {
      setIsFocused(false);
    }
  };

  return (
    <section
      aria-label={ariaLabel}
      className={'carousel' + (className ? ' ' + className : '')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onTouchStart={() => setIsTouching(true)}
      onTouchEnd={() => setIsTouching(false)}
    >
      {/* {showProgress && autoPlay && (
        <Progress
          key={activeIndex}
          value={Math.round(progressPercent)}
          style={{
            animation: `carousel-progress ${autoPlayInterval}ms linear forwards`,
            animationPlayState:
              isHovered || isFocused || isTouching || !isVisible
                ? 'paused'
                : 'running',
          }}
        />
      )} */}

      {/* 1. Track Container */}
      <div
        ref={trackRef}
        onScrollEnd={handleScrollEnd}
        className="carousel-track"
        tabIndex={0}
      >
        {items.map((item, index) => (
          <div key={item.id ?? index} className="carousel-slide">
            {item.children}
          </div>
        ))}
      </div>

      {/* 2. Controls (Previous / Next Buttons) */}
      <div className="carousel-controls">
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="carousel-btn prev-btn"
          aria-label="Previous" // Previous slide
        >
          ‹
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={activeIndex === items.length - 1}
          className="carousel-btn next-btn"
          aria-label="Next" // Next slide
        >
          ›
        </button>
      </div>

      {/* 3. Pagination Dots */}
      <div className="carousel-pagination" role="tablist">
        {items.map((item, index) => (
          <button
            key={item.id ?? index}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            onClick={() => scrollToSlide(index)}
            className={
              'pagination-dot' + (activeIndex === index ? ' active' : '')
            }
            aria-label={'Go to slide ' + (index + 1)}
          />
        ))}
      </div>
    </section>
  );
};
