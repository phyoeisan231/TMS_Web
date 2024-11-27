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
export class WeightBridgeService {

  constructor (private http: HttpClient, ) { }
  getWBList(){
    return this.http.get<any>(environment.url+'Master/GetWeightBridgeList');
  }

  getYardList(active?: string): Observable<any[]> {
    const params = active ? { active } : {}; // If active is provided, use it as a query param
    return this.http.get<any[]>(`${environment.url}Master/GetYardList`, { params });
  }

  createWeightBridge(data: any) {
    return this.http.post<any>(environment.url + 'Master/SaveWeightBridge', data, httpOptions);
  }

  updateWeightBridge(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdateWeightBridge/', data, httpOptions);
  }

  deleteWeightBridge(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeleteWeightBridge/' + id, httpOptions);
  }
  
}
