import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[pkWidget]',
  standalone: true,
})
export class PkWidgetDirective {
  @HostBinding('class') elementClass = 'pk-widget';
}
