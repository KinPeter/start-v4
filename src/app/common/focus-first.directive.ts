import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[pkFocusFirst]' })
export class FocusFirstDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  public ngAfterViewInit(): void {
    const nativeElement = this.el.nativeElement;
    if (nativeElement.tagName.toLowerCase() === 'button') {
      nativeElement.focus();
    } else {
      const buttonElement = nativeElement.querySelector('button');
      if (buttonElement) {
        buttonElement.focus();
      }
    }
  }
}
