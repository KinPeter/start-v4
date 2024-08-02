import { computed, Injectable } from '@angular/core';
import { StoreKeys } from '../../constants/constants';
import { LocalStore } from '../../utils/store';

export interface AppBarState {
  weatherOpen: boolean;
  notesOpen: boolean;
  birthdaysOpen: boolean;
  koreanOpen: boolean;
  personalDataOpen: boolean;
  cyclingOpen: boolean;
}

const initialState: AppBarState = {
  birthdaysOpen: false,
  koreanOpen: false,
  notesOpen: true,
  weatherOpen: false,
  personalDataOpen: false,
  cyclingOpen: false,
};

@Injectable({ providedIn: 'root' })
export class AppBarService extends LocalStore<AppBarState> {
  constructor() {
    super(StoreKeys.APP_BAR, initialState);
  }

  public weatherOpen = computed(() => this.state().weatherOpen);
  public notesOpen = computed(() => this.state().notesOpen);
  public birthdaysOpen = computed(() => this.state().birthdaysOpen);
  public personalDataOpen = computed(() => this.state().personalDataOpen);
  public koreanOpen = computed(() => this.state().koreanOpen);
  public cyclingOpen = computed(() => this.state().cyclingOpen);

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

  public toggleKorean(): void {
    this.setState({ koreanOpen: !this.state().koreanOpen });
  }

  public toggleCycling(): void {
    this.setState({ cyclingOpen: !this.state().cyclingOpen });
  }

  public resetState(): void {
    this.setState({ ...initialState });
  }
}
