import { computed, Injectable } from '@angular/core';
import { StoreKeys } from '../../constants';
import { LocalStore } from '../../utils/store';

export interface WidgetsBarState {
  weatherOpen: boolean;
  notesOpen: boolean;
  birthdaysOpen: boolean;
  translatorOpen: boolean;
  personalDataOpen: boolean;
  activitiesOpen: boolean;
  tripsOpen: boolean;
}

const initialState: WidgetsBarState = {
  birthdaysOpen: false,
  translatorOpen: false,
  notesOpen: true,
  weatherOpen: false,
  personalDataOpen: false,
  activitiesOpen: false,
  tripsOpen: false,
};

@Injectable({ providedIn: 'root' })
export class WidgetsBarService extends LocalStore<WidgetsBarState> {
  constructor() {
    super(StoreKeys.APP_BAR, initialState);
  }

  public weatherOpen = computed(() => this.state().weatherOpen);
  public notesOpen = computed(() => this.state().notesOpen);
  public birthdaysOpen = computed(() => this.state().birthdaysOpen);
  public personalDataOpen = computed(() => this.state().personalDataOpen);
  public translatorOpen = computed(() => this.state().translatorOpen);
  public activitiesOpen = computed(() => this.state().activitiesOpen);
  public tripsOpen = computed(() => this.state().tripsOpen);

  public toggleWeather(): void {
    this.setState({ weatherOpen: !this.state().weatherOpen });
  }

  public toggleNotes(): void {
    this.setState({ notesOpen: !this.state().notesOpen });
  }

  public toggleBirthdays(): void {
    this.setState({ birthdaysOpen: !this.state().birthdaysOpen });
  }

  public togglePersonalData(): void {
    this.setState({ personalDataOpen: !this.state().personalDataOpen });
  }

  public toggleTranslator(): void {
    this.setState({ translatorOpen: !this.state().translatorOpen });
  }

  public toggleActivities(): void {
    this.setState({ activitiesOpen: !this.state().activitiesOpen });
  }

  public toggleTrips(): void {
    this.setState({ tripsOpen: !this.state().tripsOpen });
  }

  public resetState(): void {
    this.setState({ ...initialState });
  }
}
