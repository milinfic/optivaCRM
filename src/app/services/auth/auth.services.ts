import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backend = environment; // API em desenvolvimento

  constructor(private http: HttpClient, private utils: UtilsService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.backend}/auth/login`, 
      { email, password }, 
      { withCredentials: true }
    ).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.backend}/auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.backend}/auth/profile`,
      { withCredentials: true }).pipe(
        map(response => this.utils.handleApiResponse(response))
      );
  }

  refresh() {
    return this.http.post(`${this.backend}/auth/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }
}
