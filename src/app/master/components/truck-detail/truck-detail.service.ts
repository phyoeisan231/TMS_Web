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

  getTruckTypes(): Observable<any[]> {
    return this.http.get<any[]>(environment.url+'Master/GetOnlyTruckTypes');
  }

  getTransporterNames():Observable<any[]>{
    return this.http.get<any[]>(environment.url+'Master/GetTransporterNames');
  }

  getTruckId(id:any){
    return this.http.get<any>(environment.url+'Master/GetTruckId/?id='+id);
  }

  updateTruck(data:any){
    return this.http.put<any>(environment.url+'Master/UpdateTruck',data,{
      reportProgress:true,
    });
  }  
}
