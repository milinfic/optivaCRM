import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../utils/utils.service';

/**
 * Serviço das tabelas de apoio (segmentos, grupos, tipos...).
 *
 * O backend expõe tudo em `/lookups/:resource`.
 */
@Injectable({
  providedIn: 'root'
})
export class LookupService {

  private backend = environment;

  constructor(private http: HttpClient, private utils: UtilsService) { }

  read(resource: string, params: any = {}): Observable<any> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get(`${this.backend}/lookups/${resource}`, {
      params: httpParams,
      withCredentials: true
    }).pipe(map(response => this.utils.handleApiResponse(response)));
  }

  create(resource: string, data: any): Observable<any> {
    return this.http.post(`${this.backend}/lookups/${resource}`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  update(resource: string, id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.backend}/lookups/${resource}/${id}`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  delete(resource: string, id: number | string): Observable<any> {
    return this.http.delete(`${this.backend}/lookups/${resource}/${id}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }
}
