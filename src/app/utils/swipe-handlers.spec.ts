import { detectSwipeRight } from './swipe-handlers';

describe('detectSwipeRight', () => {
  let element: HTMLElement;
  let callback: jasmine.Spy;

  beforeEach(() => {
    element = document.createElement('div');
    callback = jasmine.createSpy('callback');
    detectSwipeRight(element, callback);
  });

  function createTouchEvent(type: string, x: number): TouchEvent {
    const touch = new Touch({
      identifier: Date.now(),
      target: element,
      screenX: x,
      screenY: 0,
      clientX: x,
      clientY: 0,
      pageX: x,
      pageY: 0,
      radiusX: 0,
      radiusY: 0,
      rotationAngle: 0,
      force: 0,
    });

    return new TouchEvent(type, {
      changedTouches: [touch],
      bubbles: true,
      cancelable: true,
    });
  }

  it('should not trigger callback if swipe starts beyond 50 pixels', () => {
    element.dispatchEvent(createTouchEvent('touchstart', 60));
    element.dispatchEvent(createTouchEvent('touchend', 200));
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not trigger callback if swipe is less than 100 pixels', () => {
    element.dispatchEvent(createTouchEvent('touchstart', 30));
    element.dispatchEvent(createTouchEvent('touchend', 80));
    expect(callback).not.toHaveBeenCalled();
  });

  it('should trigger callback if swipe is at least 100 pixels and starts within 50 pixels', () => {
    element.dispatchEvent(createTouchEvent('touchstart', 30));
    element.dispatchEvent(createTouchEvent('touchend', 150));
    expect(callback).toHaveBeenCalled();
  });

  it('should not trigger callback if swipe is in the opposite direction', () => {
    element.dispatchEvent(createTouchEvent('touchstart', 30));
    element.dispatchEvent(createTouchEvent('touchend', 10));
    expect(callback).not.toHaveBeenCalled();
  });
});
