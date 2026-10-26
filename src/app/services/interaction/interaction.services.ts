import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../utils/utils.service';

/**
 * Serviço de interações (histórico de contato com o cliente).
 */
@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private backend = environment;

  constructor(private http: HttpClient, private utils: UtilsService) { }

  read(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get(`${this.backend}/interactions`, {
      params: httpParams,
      withCredentials: true
    }).pipe(map(response => this.utils.handleApiResponse(response)));
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.backend}/interactions`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete(`${this.backend}/interactions/${id}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }
}
