export type ClearSwipeHandlers = () => void;

export function detectSwipeRight(element: HTMLElement, callback: () => void): ClearSwipeHandlers {
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX = event.changedTouches[0].screenX;
    if (touchStartX > 50) {
      touchStartX = -1; // Ignore swipes that don't start from the first 50 pixels
    }
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStartX < 0) return;
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
  };

  element.addEventListener('touchstart', handleTouchStart);

  element.addEventListener('touchend', handleTouchEnd);

  function handleSwipe(): void {
    if (touchEndX > touchStartX + 50 && touchEndX - touchStartX >= 100) {
      callback();
    }
  }

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}
