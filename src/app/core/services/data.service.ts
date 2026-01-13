import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly url = 'assets/data/';
  private readonly fileType = '.json';
  private readonly http = inject(HttpClient);

  public getDataFromJson<T>(jsonKey: string): Observable<T> {
    return this.http.get<T>(this.url + jsonKey + this.fileType);
  }

  public loadLocalStorage<T>(key: string): T | null {
    const value: string | null = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  public saveLocalStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
