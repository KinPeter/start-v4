import { NotificationService } from './../../services/notification.service';
import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { StravaApiService } from './strava-api.service';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { NgOptimizedImage } from '@angular/common';
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
  StravaAthleteData,
} from '../../types';
import { StravaRoutesService } from './strava-routes.service';

type ActivityView = 'home' | 'chore' | 'goals';

@Component({
  selector: 'pk-activities',
  imports: [
    PkWidgetDirective,
    NgIcon,
    PkIconButtonComponent,
    PkLoaderComponent,
    NgOptimizedImage,
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
            [disabled]="loading() || needAuth() || disabled() || !activitiesData()">
            <ng-icon name="tablerTargetArrow" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button
            tooltip="Add Chore"
            (onClick)="currentView.set('chore')"
            [disabled]="loading() || needAuth() || disabled() || !activitiesData()">
            <ng-icon name="tablerBellPlus" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button
            tooltip="Refresh"
            (onClick)="refresh()"
            [disabled]="loading() || needAuth() || disabled()">
            <ng-icon name="tablerRefresh" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button
            tooltip="Copy token"
            (onClick)="copyToken()"
            [disabled]="loading() || needAuth() || disabled()">
            <ng-icon [name]="showCheckmark() ? 'tablerCheck' : 'tablerCopy'" size="1.2rem" />
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
        } @else if (needAuth()) {
          <div class="connect">
            <a [href]="stravaOauthUrl()">
              <img
                ngSrc="assets/connect.png"
                priority
                alt="Connect with Strava"
                height="48"
                width="193" />
            </a>
          </div>
        } @else if (disabled() || !stravaData() || !activitiesData()) {
          <div class="not-available">
            <p>Strava service is not available.</p>
          </div>
        } @else if (currentView() === 'home') {
          <pk-activities-wrapper
            [stravaData]="stravaData()!"
            [activitiesData]="activitiesData()!"
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
  public disabled: Signal<boolean>;
  public needAuth: Signal<boolean>;
  public loading: Signal<boolean>;
  public stravaOauthUrl: Signal<string>;
  public stravaData: Signal<StravaAthleteData | null>;
  public activitiesData: Signal<Activities | null>;
  public currentView = signal<ActivityView>('home');
  public choreToEdit: WritableSignal<CyclingChore | null> = signal(null);
  public showCheckmark = signal(false);

  constructor(
    private widgetsBarService: WidgetsBarService,
    private stravaApiService: StravaApiService,
    private stravaRoutesService: StravaRoutesService,
    private activitiesService: ActivitiesService,
    private notificationService: NotificationService
  ) {
    this.disabled = this.stravaApiService.disabled;
    this.needAuth = this.stravaApiService.needAuth;
    this.loading = this.stravaApiService.loading || this.activitiesService.loading;
    this.stravaOauthUrl = this.stravaApiService.stravaOauthUrl;
    this.stravaData = this.stravaApiService.data;
    this.activitiesData = this.activitiesService.data;
  }

  public close(): void {
    this.widgetsBarService.toggleActivities();
  }

  public refresh() {
    this.stravaApiService.fetchStravaData();
    this.stravaRoutesService.syncStravaRoutes();
  }

  public async copyToken() {
    try {
      const data = this.stravaApiService.stravaToken();
      if (!data) return;
      await navigator.clipboard.writeText(data);
      this.showCheckmark.set(true);
      setTimeout(() => {
        this.showCheckmark.set(false);
      }, 3000);
    } catch (_e) {
      this.notificationService.showError('Could not copy to clipboard.');
    }
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
