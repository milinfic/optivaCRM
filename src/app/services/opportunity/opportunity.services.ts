import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../utils/utils.service';

/**
 * Serviço de oportunidades do CRM.
 */
@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  private backend = environment;

  constructor(private http: HttpClient, private utils: UtilsService) { }

  read(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get(`${this.backend}/opportunities`, {
      params: httpParams,
      withCredentials: true
    }).pipe(map(response => this.utils.handleApiResponse(response)));
  }

  readById(id: number | string): Observable<any> {
    return this.http.get(`${this.backend}/opportunities/${id}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.backend}/opportunities`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  update(id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.backend}/opportunities/${id}`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete(`${this.backend}/opportunities/${id}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  statusHistory(id: number | string): Observable<any> {
    return this.http.get(`${this.backend}/opportunities/${id}/status-history`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  comments(id: number | string): Observable<any> {
    return this.http.get(`${this.backend}/opportunities/${id}/comments`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  addComment(id: number | string, detail: string): Observable<any> {
    return this.http.post(`${this.backend}/opportunities/${id}/comments`, { detail }, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }
}
