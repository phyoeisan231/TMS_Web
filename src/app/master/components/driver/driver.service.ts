import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const httpOptions={
  headers:new HttpHeaders({'Content-Type':'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http:HttpClient) { }
  
  getDriverList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetDriverList/?active=' + active);
  }
 
  deleteDriver(id: any) {
    const encodedId = encodeURIComponent(id); // Encode the ID
    return this.http.delete<any>(`${environment.url}Master/DeleteDriver/${encodedId}`,httpOptions);
  }

}
