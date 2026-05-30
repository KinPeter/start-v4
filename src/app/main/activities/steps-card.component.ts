import { Component, input, computed, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { NgIconComponent } from '@ng-icons/core';
import { StepsItem } from '../../types';

@Component({
  selector: 'pk-steps-card',
  imports: [PkCardDirective, NgIconComponent],
  styles: `
    :host {
      display: block;
    }
    .chart-header {
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: var(--color-text);

      ng-icon {
        font-size: 1.2rem;
        margin-right: 0.25rem;
      }
    }
    .chart-scroll {
      overflow-x: auto;
      overflow-y: hidden;
      padding-bottom: 0.25rem;
      scroll-behavior: auto;
    }
    .chart-scroll::-webkit-scrollbar {
      height: 4px;
    }
    .chart-scroll::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 2px;
    }
    .chart {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 80px;
    }
    .bar-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      flex-shrink: 0;
      width: 22px;
      height: 100%;
    }
    .bar-value {
      font-size: 0.6rem;
      color: var(--color-text-disabled);
      margin-bottom: 2px;
    }
    .bar {
      width: 10px;
      border-radius: 2px 2px 0 0;
      background: var(--color-primary);
      transition: height 0.2s ease;
      min-height: 1px;
    }
    .bar-label {
      font-size: 0.55rem;
      color: var(--color-text-disabled);
      margin-top: 3px;
      white-space: nowrap;
    }
  `,
  template: `
    <div pkCard class="card">
      <div class="chart-header"><ng-icon name="tablerWalk" />Steps</div>
      <div #scrollContainer class="chart-scroll">
        <div class="chart">
          @for (item of chartData().items; track item.date) {
            <div class="bar-group">
              <span class="bar-value">{{ item.steps }}</span>
              <div class="bar" [style.height.%]="item.percent"></div>
              <span class="bar-label">{{ shortDate(item.date) }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class StepsCardComponent implements AfterViewInit {
  public stepsData = input.required<StepsItem[]>();

  private scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  protected chartData = computed(() => {
    const sorted = [...this.stepsData()].sort((a, b) => a.date.localeCompare(b.date));
    const max = sorted.reduce((m, item) => Math.max(m, item.steps), 0);
    return {
      items: sorted.map(item => ({
        ...item,
        percent: max > 0 ? (item.steps / max) * 100 : 0,
      })),
    };
  });

  ngAfterViewInit() {
    const el = this.scrollContainer()?.nativeElement;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollLeft = el.scrollWidth;
      });
    }
  }

  shortDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return String(d.getDate());
  }
}
