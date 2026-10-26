import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../utils/utils.service';

/**
 * Serviço de usuários do sistema.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backend = environment;

  constructor(private http: HttpClient, private utils: UtilsService) { }

  read(): Observable<any> {
    return this.http.get(`${this.backend}/users`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  readById(id: number | string): Observable<any> {
    return this.http.get(`${this.backend}/users/${id}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.backend}/auth/register`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  update(id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.backend}/users/${id}`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete(`${this.backend}/users/${id}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }
}
