import { Component, signal } from '@angular/core';
import { DrawerComponent } from '../common/drawer.component';
import { PkButtonComponent } from '../common/pk-button.component';

@Component({
  selector: 'pk-main',
  standalone: true,
  imports: [DrawerComponent, PkButtonComponent],
  template: ` <p>main works!</p>
    <pk-button (onClick)="open.set(true)">Open drawer</pk-button>
    <pk-drawer [size]="drawerSize()" title="Start v4" [open]="open()" (onClose)="open.set(false)">
      <pk-button (onClick)="changeSize()">Go!</pk-button>
    </pk-drawer>`,
  styles: ``,
})
export class MainComponent {
  public open = signal(false);
  public drawerSize = signal<'sm' | 'md'>('sm');

  public changeSize() {
    this.drawerSize.update(size => (size === 'md' ? 'sm' : 'md'));
  }
}
