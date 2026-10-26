import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../utils/utils.service';

/**
 * Cliente HTTP da API do CRM.
 *
 * Todas as respostas do backend seguem `{ success: boolean, data: any }`,
 * tratadas por `UtilsService.handleApiResponse`.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private backend = environment;

  constructor(private http: HttpClient, private utils: UtilsService) { }

  /**
   * Lista clientes paginados.
   */
  read(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get(`${this.backend}/clients`, {
      params: httpParams,
      withCredentials: true
    }).pipe(map(response => this.utils.handleApiResponse(response)));
  }

  readById(id: number | string): Observable<any> {
    return this.http.get(`${this.backend}/clients/${id}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.backend}/clients`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  update(id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.backend}/clients/${id}`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete(`${this.backend}/clients/${id}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  /* ----------------------------- Endereços ----------------------------- */

  readAddresses(clientId: number | string): Observable<any> {
    return this.http.get(`${this.backend}/clients/${clientId}/addresses`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  createAddress(clientId: number | string, data: any): Observable<any> {
    return this.http.post(`${this.backend}/clients/${clientId}/addresses`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  updateAddress(clientId: number | string, addressId: number | string, data: any): Observable<any> {
    return this.http.put(`${this.backend}/clients/${clientId}/addresses/${addressId}`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  deleteAddress(clientId: number | string, addressId: number | string): Observable<any> {
    return this.http.delete(`${this.backend}/clients/${clientId}/addresses/${addressId}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  /* ------------------------------ Contatos ----------------------------- */

  readContacts(clientId: number | string): Observable<any> {
    return this.http.get(`${this.backend}/clients/${clientId}/contacts`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  createContact(clientId: number | string, data: any): Observable<any> {
    return this.http.post(`${this.backend}/clients/${clientId}/contacts`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  updateContact(clientId: number | string, contactId: number | string, data: any): Observable<any> {
    return this.http.put(`${this.backend}/clients/${clientId}/contacts/${contactId}`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  deleteContact(clientId: number | string, contactId: number | string): Observable<any> {
    return this.http.delete(`${this.backend}/clients/${clientId}/contacts/${contactId}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  /* ----------------------------- Documentos ---------------------------- */

  readDocuments(clientId: number | string): Observable<any> {
    return this.http.get(`${this.backend}/clients/${clientId}/documents`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  createDocument(clientId: number | string, data: any): Observable<any> {
    return this.http.post(`${this.backend}/clients/${clientId}/documents`, data, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }

  deleteDocument(clientId: number | string, documentId: number | string): Observable<any> {
    return this.http.delete(`${this.backend}/clients/${clientId}/documents/${documentId}`, { withCredentials: true })
      .pipe(map(response => this.utils.handleApiResponse(response)));
  }
}
