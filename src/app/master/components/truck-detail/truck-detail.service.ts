import { Injectable, Injector } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
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
    return this.http.post<any>(environment.url+'Master/SaveTruck/',data,{
      reportProgress:true,
    });
  }

  getTruckTypes(active?: string): Observable<any[]> {
    const params = active ? { active } : {}; // If active is provided, use it as a query param
    return this.http.get<any[]>(`${environment.url}Master/GetTruckTypeList`, { params });
  }

  getTransporterNames():Observable<any[]>{
    return this.http.get<any[]>(environment.url+'Master/GetTransporterList');
  }

  getTruckId(id:any){
    return this.http.get<any>(environment.url+'Master/GetTruckId/?id='+id);
  }

  updateTruck(data:any){
    return this.http.put<any>(environment.url+'Master/UpdateTruck/',data,{
      reportProgress:true,
    });
  }  
}
