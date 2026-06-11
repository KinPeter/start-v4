import { NotificationService } from './../../services/notification.service';
import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { ActivitiesService } from './activities.service';
import { ActivitiesWrapperComponent } from './activities-wrapper.component';
import { ChoreFormComponent } from './chore-form.component';
import { GoalsFormComponent } from './goals-form.component';
import { FocusFirstDirective } from '../../common/focus-first.directive';
import {
  Activities,
  CyclingChore,
  CyclingChoreRequest,
  SetGoalsRequest,
  UUID,
  StepsItem,
} from '../../types';
import { StepsService } from './steps.service';

type ActivityView = 'home' | 'chore' | 'goals';

@Component({
  selector: 'pk-activities',
  imports: [
    PkWidgetDirective,
    NgIcon,
    PkIconButtonComponent,
    PkLoaderComponent,
    ActivitiesWrapperComponent,
    ChoreFormComponent,
    GoalsFormComponent,
    FocusFirstDirective,
  ],
  providers: [],
  styles: `
    .container {
      min-height: 300px;
    }

    .loader,
    .not-available,
    .connect {
      margin-top: 25%;
      display: flex;
      justify-content: center;

      p {
        text-align: center;
      }
    }
  `,
  template: `
    <div pkWidget class="container">
      <header>
        <h1>Activities</h1>
        <div class="actions">
          <pk-icon-button
            tooltip="Set Goals"
            (onClick)="currentView.set('goals')"
            [disabled]="loading() || !activitiesData()">
            <ng-icon name="tablerTargetArrow" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button
            tooltip="Add Chore"
            (onClick)="currentView.set('chore')"
            [disabled]="loading() || !activitiesData()">
            <ng-icon name="tablerBellPlus" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button tooltip="Refresh" (onClick)="refresh()" [disabled]="loading()">
            <ng-icon name="tablerRefresh" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button tooltip="Close" (onClick)="close()" pkFocusFirst>
            <ng-icon name="tablerX" size="1.2rem" />
          </pk-icon-button>
        </div>
      </header>
      <main>
        @if (loading()) {
          <div class="loader">
            <pk-loader size="sm" />
          </div>
        } @else if (!activitiesData()) {
          <div class="not-available">
            <p>Activities service is not available.</p>
          </div>
        } @else if (currentView() === 'home') {
          <pk-activities-wrapper
            [activitiesData]="activitiesData()!"
            [stepsData]="stepsData()!"
            (editChore)="handleEditChore($event)"
            (deleteChore)="handleDeleteChore($event)" />
        } @else if (currentView() === 'chore') {
          <pk-chore-form
            [data]="choreToEdit()"
            [loading]="loading()"
            (cancel)="handleCancelChore()"
            (save)="handleSaveChore($event)" />
        } @else if (currentView() === 'goals') {
          <pk-goals-form
            [data]="activitiesData()"
            [loading]="loading()"
            (cancel)="currentView.set('home')"
            (save)="handleSaveGoals($event)" />
        }
      </main>
    </div>
  `,
})
export class ActivitiesComponent {
  public loading: Signal<boolean>;
  public activitiesData: Signal<Activities | null>;
  public stepsData: Signal<StepsItem[] | null>;
  public currentView = signal<ActivityView>('home');
  public choreToEdit: WritableSignal<CyclingChore | null> = signal(null);
  public showCheckmark = signal(false);

  constructor(
    private widgetsBarService: WidgetsBarService,
    private activitiesService: ActivitiesService,
    private notificationService: NotificationService,
    private stepsService: StepsService
  ) {
    this.loading = this.activitiesService.loading || this.stepsService.loading;
    this.activitiesData = this.activitiesService.data;
    this.stepsData = this.stepsService.data;
  }

  public close(): void {
    this.widgetsBarService.toggleActivities();
  }

  public refresh() {
    this.stepsService.syncSteps();
  }

  public handleSaveGoals(goals: SetGoalsRequest): void {
    this.activitiesService.setGoals(goals);
    this.currentView.set('home');
  }

  public handleEditChore(id: UUID): void {
    const chore = this.activitiesData()?.chores?.find(chore => chore.id === id) ?? null;
    this.choreToEdit.set(chore);
    this.currentView.set('chore');
  }

  public handleDeleteChore(id: UUID): void {
    this.activitiesService.deleteChore(id);
  }

  public handleCancelChore(): void {
    this.choreToEdit.set(null);
    this.currentView.set('home');
  }

  public handleSaveChore(chore: CyclingChoreRequest): void {
    if (this.choreToEdit()) {
      this.activitiesService.editChore(this.choreToEdit()!.id, chore);
    } else {
      this.activitiesService.addNewChore(chore);
    }
    this.currentView.set('home');
  }
}
