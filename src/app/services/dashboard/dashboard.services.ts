import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../utils/utils.service';

/**
 * Indicadores do dashboard.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private backend = environment;

  constructor(private http: HttpClient, private utils: UtilsService) { }

  summary(): Observable<any> {
    return this.http.get(`${this.backend}/dashboard/summary`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }
}
