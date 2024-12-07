import { Injectable, Injector } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions={
  headers:new HttpHeaders({'Content-Type':'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class TruckDetailService {

  constructor(private injector:Injector,private http:HttpClient) { }

  createTruck(data:any){
    return this.http.post<any>(environment.url+'Master/SaveTruck/',data);
  }

  getTruckTypes(active?: string): Observable<any[]> {
    const params = active ? { active } : {}; // If active is provided, use it as a query param
    return this.http.get<any[]>(`${environment.url}Master/GetTruckTypeList`, { params });
  }

  getDriverList(active: string, isBlack: string): Observable<any[]> {
    const params = new HttpParams()
      .set('active', active)
      .set('isBlack', isBlack);
    return this.http.get<any[]>(environment.url+'Master/GetDriverList', { params });
  }

  getTransporterList(active: string, isBlack: string) {
    const params = new HttpParams()
      .set('active', active)
      .set('isBlack', isBlack);
    return this.http.get<any>(`${environment.url}Master/GetTransporterList`, { params });
  }

  getTruckId(id:any){
    return this.http.get<any>(environment.url+'Master/GetTruckId/?id='+id);
  }

  updateTruck(data:any){
    return this.http.put<any>(environment.url+'Master/UpdateTruck/',data);
  }  
}
