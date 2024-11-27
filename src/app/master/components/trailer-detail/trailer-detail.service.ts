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
export class TrailerDetailService {

  constructor(private Injector:Injector,private http:HttpClient) {}

  createTrailer(data:any){
    return this.http.post<any>(environment.url+'Master/SaveTrailer/',data,{
      reportProgress:true,
    });
  }

  getTransporterNames():Observable<any[]>{
    return this.http.get<any[]>(environment.url+'Master/GetTransporterList');
  }
  
  getTrailerId(id:any){
    return this.http.get<any>(environment.url+'Master/GetTrailerId/?id='+id);
  }

  updateTrailer(data:any){
    return this.http.put<any>(environment.url+'Master/UpdateTrailer',data,{
      reportProgress:true,
    });
  }
  
}
