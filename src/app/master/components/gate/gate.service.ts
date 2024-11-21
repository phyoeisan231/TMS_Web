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
export class GateService {
  constructor (private http: HttpClient, ) { }

  getGateList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetGateList/?active=' + active);
  }

  getYardList(active?: string): Observable<any[]> {
    const params = active ? { active } : {}; // If active is provided, use it as a query param
    return this.http.get<any[]>(`${environment.url}Master/GetYardList`, { params });
  }
  
  createGate(data: any) {
    return this.http.post<any>(environment.url + 'Master/SaveGate', data, httpOptions);
  }

  updateGate(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdateGate/', data, httpOptions);
  }

  deleteGate(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeleteGate/' + id, httpOptions);
  }
}
