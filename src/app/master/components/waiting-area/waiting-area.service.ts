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
export class WaitingAreaService {

  constructor (private http: HttpClient, ) { }

  getWaitingAreaList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetWaitingAreaList/?active=' + active);
  }

  getYardList(active?: string): Observable<any[]> {
    const params = active ? { active } : {}; // If active is provided, use it as a query param
    return this.http.get<any[]>(`${environment.url}Master/GetYardList`, { params });
  }
  
  createWaitingArea(data: any) {
    return this.http.post<any>(environment.url + 'Master/SaveWaitingArea', data, httpOptions);
  }

  updateWaitingArea(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdateWaitingArea/', data, httpOptions);
  }

  deleteWaitingArea(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeleteWaitingArea/' + id, httpOptions);
  }
}
