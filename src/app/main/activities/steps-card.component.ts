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
      padding: 1.5rem 0 0.25rem 0.5rem;
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
      margin-top: -1.5rem;
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
    .bar-tooltip {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .bar-tooltip .tooltip-text {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      bottom: 50%;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-bg-darker);
      color: var(--color-text);
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
      transition: opacity 0.15s ease;
      margin-bottom: 4px;
      border: 1px solid var(--color-border);
      z-index: 1;
    }
    .bar-tooltip:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
    .bar {
      width: 10px;
      border-radius: 2px 2px 0 0;
      background: var(--color-primary);
      transition: height 0.2s ease;
      min-height: 1px;
      cursor: pointer;
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
              <div class="bar-tooltip">
                <div class="bar" [style.height.%]="item.percent"></div>
                <span class="tooltip-text">{{ item.steps }}</span>
              </div>
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
