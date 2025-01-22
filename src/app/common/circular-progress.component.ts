import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'pk-circular-progress',
  styles: [
    `
      :host,
      div {
        display: inline-block;
      }

      .progress-circle {
        transform: rotate(-90deg); /* Start the progress from the top */
      }

      .background {
        stroke: var(--color-dark-5); /* Set the color of the background */
      }

      .progress {
        stroke: var(--color-primary); /* Set the color of the progress */
        transition: stroke-dashoffset 0.35s; /* Smooth transition */
        transform-origin: 50% 50%;
      }

      .percentage-text {
        text-anchor: middle;
        dominant-baseline: middle;
        fill: var(--color-primary);
        transform-origin: 50% 50%;
        transform: rotate(90deg);
      }
    `,
  ],
  template: `
    <div>
      <svg
        [attr.width]="radius() * 2 + strokeWidth()"
        [attr.height]="radius() * 2 + strokeWidth()"
        [attr.viewBox]="
          '0 0 ' + (radius() * 2 + strokeWidth()) + ' ' + (radius() * 2 + strokeWidth())
        "
        class="progress-circle">
        <circle
          [attr.cx]="radius() + strokeWidth() / 2"
          [attr.cy]="radius() + strokeWidth() / 2"
          [attr.r]="radius()"
          [attr.stroke-width]="strokeWidth()"
          fill="none"
          class="background" />
        <circle
          [attr.cx]="radius() + strokeWidth() / 2"
          [attr.cy]="radius() + strokeWidth() / 2"
          [attr.r]="radius()"
          [attr.stroke-width]="strokeWidth()"
          fill="none"
          class="progress"
          [attr.stroke-dashoffset]="dashOffset()"
          [attr.stroke-dasharray]="circumference()" />
        <text
          [attr.x]="radius() + strokeWidth() / 2"
          [attr.y]="radius() + strokeWidth() / 2"
          [attr.font-size]="fontSize() + 'em'"
          class="percentage-text">
          {{ roundedPercentage() }}%
        </text>
      </svg>
    </div>
  `,
})
export class CircularProgressComponent {
  public percentage = input.required<number>();
  public radius = input<number>(45);

  public roundedPercentage = computed(() => {
    if (this.percentage() === Infinity) {
      return '-';
    }
    return Math.round(this.percentage());
  });

  public circumference = computed(() => {
    return 2 * Math.PI * this.radius();
  });

  public strokeWidth = computed(() => {
    return this.radius() * 0.2;
  });

  public fontSize = computed(() => {
    return this.radius() / 25; // 1em for radius 25px
  });

  public dashOffset = computed(() => {
    const percentage = this.percentage() === Infinity ? 0 : this.percentage();
    const clampedPercentage = Math.min(100, Math.max(0, percentage));
    return this.circumference() - (clampedPercentage / 100) * this.circumference();
  });
}
