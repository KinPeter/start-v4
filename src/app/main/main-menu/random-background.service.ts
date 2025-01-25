import { computed, effect, Injectable } from '@angular/core';
import { Store } from '../../utils/store';
import { SettingsStore } from '../settings/settings.store';
import { HttpClient } from '@angular/common/http';

interface State {
  enabled: boolean;
  apiKey: string | null;
  imageUrl: string | null;
  description: string | null;
}

const initialState: State = {
  enabled: false,
  apiKey: null,
  imageUrl: null,
  description: null,
};

interface UnsplashResponse {
  urls: { full: string };
  description: string | null;
  location: {
    city: string | null;
    country: string | null;
    name: string | null;
  };
}

@Injectable({ providedIn: 'root' })
export class RandomBackgroundService extends Store<State> {
  public imageUrl = computed(() => this.state().imageUrl);
  public description = computed(() => this.state().description);
  public enabled = computed(() => this.state().enabled);
  private fetchTimer: ReturnType<typeof setTimeout> | undefined;
  private initialFetchDone = false;

  constructor(
    private settingsStore: SettingsStore,
    private http: HttpClient
  ) {
    super(initialState);
    effect(() => {
      const { unsplashApiKey } = this.settingsStore.apiKeys();
      this.setState({ apiKey: unsplashApiKey, enabled: !!unsplashApiKey });
      if (unsplashApiKey && !this.initialFetchDone) {
        this.initialFetchDone = true;
        this.getNewImage();
      }
    });
  }

  public getNewImage(): void {
    if (this.state().enabled && this.state().apiKey && window.innerWidth > 430) {
      const topics = '6sMVjTLSkeQ,bo8jQKTaE0Y,Fzo3zuOHN6w'; // Nature, Travel, Wallpapers / scroll down for topics
      this.http
        .get<UnsplashResponse>(
          `https://api.unsplash.com/photos/random?client_id=${this.state().apiKey}&orientation=landscape&topics=${topics}`
        )
        .subscribe(res => {
          const imageUrl = `url('${res?.urls?.full}')`;
          const description = this.getDescription(res);
          this.setState({ imageUrl, description });
        });
      this.setFetchTimer();
    }
  }

  public removeBackground(): void {
    this.setState({ imageUrl: null, description: null });
    if (this.fetchTimer) {
      clearInterval(this.fetchTimer);
      this.fetchTimer = undefined;
    }
  }

  public getDescription(res: UnsplashResponse): string {
    const descriptionArr = [];
    if (res?.description) {
      descriptionArr.push(res.description);
    }
    if (res?.location?.name) {
      descriptionArr.push(res.location.name);
    }
    if (res?.location?.city) {
      descriptionArr.push(res.location.city);
    }
    if (res?.location?.country) {
      descriptionArr.push(res.location.country);
    }
    if (!descriptionArr.length) {
      return 'No description';
    }
    return descriptionArr.length === 1 ? descriptionArr[0] : descriptionArr.join(', ');
  }

  private setFetchTimer(): void {
    if (this.fetchTimer) clearInterval(this.fetchTimer);
    this.fetchTimer = setInterval(() => this.getNewImage(), 1000 * 60 * 60);
  }
}

/**
 * TOPICS:
 *
 * Cool Tones                :  iXRd8cmpUDI
 * Wallpapers                :  bo8jQKTaE0Y
 * Nature                    :  6sMVjTLSkeQ
 * 3D Renders                :  CDwuwXJAbEw
 * Travel                    :  Fzo3zuOHN6w
 * Architecture & Interiors  :  M8jVbLbTRws
 * Textures & Patterns       :  iUIsnVtjB0Y
 * Street Photography        :  xHxYTMHLgOc
 * Film                      :  hmenvQhUmxM
 * Archival                  :  E--_pnIirG4
 * Experimental              :  qPYsDzvJOYc
 * Animals                   :  Jpg6Kidl-Hk
 * Fashion & Beauty          :  S4MKLAsBB74
 * People                    :  towJZFskpGg
 * Spirituality              :  _8zFHuhRhyo
 * Business & Work           :  aeu6rL-j6ew
 * Food & Drink              :  xjPR4hlkBGA
 * Health & Wellness         :  _hb-dl4Q-4U
 * Sports                    :  Bn-DjrcBrwo
 * Current Events            :  BJJMtteDJA4
 */
