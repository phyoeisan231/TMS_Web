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
export class TransporterDetailService {

  constructor(private injector:Injector,private http:HttpClient) { }

  createTransporter(data: any) {
    return this.http.post<any>(environment.url + 'Master/SaveTransporter/',  data,{
      reportProgress: true,
    });
  }

  getTransporterById(id:any){
    return this.http.get<any>(environment.url+'Master/GetTransporterId/?id='+id);
  }

  getTransporterTypes(active?: string): Observable<any[]> {
    const params = active ? { active } : {}; // If active is provided, use it as a query param
    return this.http.get<any[]>(`${environment.url}Master/GetTransporterTypeList`, { params });
  }
 
  updateTransporter(data:any){
    return this.http.put<any>(environment.url+'Master/UpdateTransporter/',data,{
      reportProgress:true,
    });
  }    
}
