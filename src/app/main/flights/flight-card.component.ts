import {
  Component,
  computed,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Flight } from '@kinpeter/pk-common';
import { PkCardDirective } from '../../common/pk-card.directive';
import { interval, map, startWith, Subscription } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { FlightDataComponent } from './flight-data.component';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
}

@Component({
  selector: 'pk-flight-card',
  imports: [PkCardDirective, NgIcon, FlightDataComponent],
  providers: [],
  styles: `
    .countdown {
      padding: 0.25rem 1.5rem;
      background-color: var(--color-bg-darker);
      border-radius: var(--radius-sm);
      text-align: right;
      color: var(--color-text-accent);
      display: flex;
      align-items: baseline;
      justify-content: space-between;

      span {
        font-family: 'Orbitron', monospace;
        font-optical-sizing: auto;
        font-weight: 500;
        font-style: normal;
        font-size: 2rem;
        margin-left: 0.5rem;
      }

      span > span {
        font-size: 1rem;
        margin: 0;
      }
    }
  `,
  template: `
    <div pkCard>
      <pk-flight-data [flight]="flight()" [dateTime]="dateTime()" />
      @if (countdown()) {
        <div class="countdown">
          <ng-icon name="tablerPlaneDeparture" size="1.15rem" />
          <div>
            <span>{{ countdown()!.days }}<span>d</span></span>
            <span
              >{{ countdown()!.hours < 10 ? '0' : '' }}{{ countdown()!.hours }}<span>h</span></span
            >
            <span
              >{{ countdown()!.minutes < 10 ? '0' : '' }}{{ countdown()!.minutes
              }}<span>m</span></span
            >
          </div>
        </div>
      }
    </div>
  `,
})
export class FlightCardComponent implements OnInit, OnChanges, OnDestroy {
  public flight = input.required<Flight>();

  public countdown = signal<Countdown | null>(null);

  public dateTime = computed(() => {
    return new Date(`${this.flight().date}T${this.flight().departureTime}`);
  });

  private countdown$ = interval(1000 * 60).pipe(
    startWith(0),
    map(() => this.getCountdownTime(this.dateTime()))
  );

  private countdownSub: Subscription | null = null;

  ngOnInit() {
    this.subscribeToCountdown();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['flight']) {
      this.subscribeToCountdown();
    }
  }

  ngOnDestroy() {
    this.unsubscribeFromCountdown();
  }

  private subscribeToCountdown() {
    this.unsubscribeFromCountdown();
    this.countdownSub = this.countdown$.subscribe(value => {
      this.countdown.set(value);
    });
  }

  private unsubscribeFromCountdown() {
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
    }
  }

  private getCountdownTime(targetDate: Date): Countdown {
    const now = new Date().getTime();
    const timeLeft = targetDate.getTime() - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  }
}
