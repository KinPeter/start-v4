import { Injectable } from '@angular/core';
import { PkStartSettings, PkStartSettingsRequest } from '@kinpeter/pk-common';
import { Observable } from 'rxjs';
import { ApiRoutes } from '../../constants/api-routes';
import { ApiService } from '../../services/api.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private apiService: ApiService) {}

  public saveSettings(settings: PkStartSettingsRequest): Observable<PkStartSettings> {
    return this.apiService.put<PkStartSettingsRequest, PkStartSettings>(
      ApiRoutes.SETTINGS,
      settings
    );
  }
}
