import { Injectable, Injector } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

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

  getTransporterList(active: string, isBlack: string) {
    const params = new HttpParams()
      .set('active', active)
      .set('isBlack', isBlack);
    return this.http.get<any>(`${environment.url}Master/GetTransporterList`, { params });
  }

  getDriverList(active: string, isBlack: string): Observable<any[]> {
    const params = new HttpParams()
      .set('active', active)
      .set('isBlack', isBlack);
    return this.http.get<any[]>(environment.url+'Master/GetDriverList', { params });
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
