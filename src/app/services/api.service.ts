import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthStore } from '../auth/auth.store';

interface RequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  observe?: 'body';
  params?: HttpParams | Record<string, string | string[]>;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: unknown;
}

const defaultOptions: RequestOptions = {
  observe: 'body',
  responseType: 'json',
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.PK_API_URL;

  constructor(
    private http: HttpClient,
    private auth: AuthStore
  ) {}

  public get<T>(path: string, options: RequestOptions = defaultOptions): Observable<T> {
    this.setAuthorization(options);
    return this.http.get<T>(`${this.apiUrl}${path}`, options);
  }

  public post<Q, T>(
    path: string,
    data: Q,
    options: RequestOptions = defaultOptions
  ): Observable<T> {
    this.setAuthorization(options);
    return this.http.post<T>(`${this.apiUrl}${path}`, data, options);
  }

  public put<Q, T>(path: string, data: Q, options: RequestOptions = defaultOptions): Observable<T> {
    this.setAuthorization(options);
    return this.http.put<T>(`${this.apiUrl}${path}`, data, options);
  }

  public patch<Q, T>(
    path: string,
    data: Q,
    options: RequestOptions = defaultOptions
  ): Observable<T> {
    this.setAuthorization(options);
    return this.http.patch<T>(`${this.apiUrl}${path}`, data, options);
  }

  public delete<T>(path: string, options: RequestOptions = defaultOptions): Observable<T> {
    this.setAuthorization(options);
    return this.http.delete<T>(`${this.apiUrl}${path}`, options);
  }

  private setAuthorization(options: RequestOptions): void {
    if (!this.auth.isAuth || !this.auth.current.token) return;
    const token = this.auth.current.token;

    if (!options) {
      options = {
        ...defaultOptions,
      };
    }

    if (!options.headers) {
      options.headers = { Authorization: `Bearer ${token}` };
    } else if (options.headers instanceof HttpHeaders) {
      options.headers.set('Authorization', `Bearer ${token}`);
    } else {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  protected setApiUrl(url: string): void {
    this.apiUrl = url;
  }
}
