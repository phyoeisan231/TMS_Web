import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions={
  headers:new HttpHeaders({'Content-Type':'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class TransporterService {

  constructor(private http:HttpClient) { }

  getTransporterList(active: string, isBlack: string) {
    const params = new HttpParams()
      .set('active', active)
      .set('isBlack', isBlack);
    return this.http.get<any>(`${environment.url}Master/GetTransporterList`, { params });
  }

  onBlackForm(data: any) {
    return this.http.put<any>(environment.url + 'Master/BlackFormForTransporter/', data, httpOptions);
  }
  
  deleteTransporter(id:any){
    return this.http.delete<any>(environment.url+'Master/DeleteTransporter/'+id,httpOptions);
  }

}
