import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const httpOptions={
  headers:new HttpHeaders({'Content-Type':'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http:HttpClient) { }
  
  // getDriverList(active: string) {
  //   return this.http.get<any>(environment.url + 'Master/GetDriverList/?active=' + active);
  // }

  getDriverList(active: string, isBlack: string) {
    const params = new HttpParams()
      .set('active', active)
      .set('isBlack', isBlack);
    return this.http.get<any>(`${environment.url}Master/GetDriverList`, { params });
  }

  onBlackForm(data: any) {
    return this.http.put<any>(environment.url + 'Master/BlackFormForDriver/', data, httpOptions);
  }
  
 
  deleteDriver(id: any) {
    const encodedId = encodeURIComponent(id); // Encode the ID
    return this.http.delete<any>(`${environment.url}Master/DeleteDriver/${encodedId}`,httpOptions);
  }

}
