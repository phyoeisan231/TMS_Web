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

  // getDriverId(id:any){
  //   return this.http.get<any>(environment.url+'Master/GetDriverId/?id='+id);
  // }

  getDriverId(id: any) {
    const encodedId = encodeURIComponent(id); // Encode the ID
    return this.http.get<any>(`${environment.url}Master/GetDriverId/?id=${encodedId}`);
}


  updateDriver(data:any){
    return this.http.put<any>(environment.url+'Master/UpdateDriver/',data,{
      reportProgress:true,
    });
  }

  
  
  
}
