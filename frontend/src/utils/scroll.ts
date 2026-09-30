/**
 * Utility to reliably reset scroll positions to top across all viewport modes:
 * 1. Standard window / document scroll (native mobile & full desktop)
 * 2. Mobile smartphone simulator viewport container (.mobile-screen-viewport)
 */
export const scrollToTop = () => {
  // Instant window scroll reset
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  if (typeof document !== 'undefined') {
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Reset all application-level scrollable viewports
    const scrollContainers = document.querySelectorAll<HTMLElement>(
      '[data-scroll-container], .mobile-screen-viewport, main'
    );
    scrollContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }
};
