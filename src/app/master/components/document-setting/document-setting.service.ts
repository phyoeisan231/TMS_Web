import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class DocumentSettingService {

  constructor (private http: HttpClient, ) { }

  getDocumentSettings(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetDocumentSettingList/?active=' + active);
  }

  // getYardList(active?: string): Observable<any[]> {
  //   const params = active ? { active } : {}; // If active is provided, use it as a query param
  //   return this.http.get<any[]>(`${environment.url}Master/GetPCategoryList`, { params });
  // }
  getCategoryList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetPCategoryList/?active=' + active);
  }
  
  createDocumentSetting(data: any) {
    return this.http.post<any>(environment.url + 'Master/SaveDocumentSetting', data, httpOptions);
  }

  updateDocumentSetting(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdateDocumentSetting/', data, httpOptions);
  }

  deleteDocumentSetting(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeleteDocumentSetting/' + id, httpOptions);
  }  
}
