import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'pk-auth',
  standalone: true,
  imports: [FormsModule],
  template: `
    <p>auth works!</p>
    <input type="text" [(ngModel)]="email" />
    <input type="text" [(ngModel)]="password" />
    <button (click)="onClick()">Log in</button>
  `,
  styles: ``,
})
export class AuthComponent {
  public email = '';
  public password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public onClick(): void {
    this.authService.verifyPassword({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
    });
  }
}
