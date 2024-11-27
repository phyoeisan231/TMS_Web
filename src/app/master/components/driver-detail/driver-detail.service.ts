import { Injectable, Injector } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const httpOptions={
headers:new HttpHeaders({'Content-Type':'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class DriverDetailService {

  constructor(private Injector:Injector,private http:HttpClient) {}

  createDriver(data:any){
    return this.http.post<any>(environment.url+'Master/SaveDriver/',data,{
      reportProgress:true,
    });
  }

  // getTransporterNames():Observable<any[]>{
  //   return this.http.get<any[]>(environment.url+'Master/GetTransporterNames');
  // }

  getDriverId(id:any){
    return this.http.get<any>(environment.url+'Master/GetDriverId/?id='+id);
  }

  updateDriver(data:any){
    return this.http.put<any>(environment.url+'Master/UpdateDriver/',data,{
      reportProgress:true,
    });
  }

  
  
  
}
