import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 };
@Injectable({
  providedIn: 'root'
})
export class TruckStatusService {

  constructor (private http: HttpClient) { }
  getYardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetYardList/?active=' + active);
  }

  getTruckProcessList(startDate:any,endDate:any,status:string,yard:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetTruckProcessList/?startDate=' + startDate+ '&endDate=' + endDate+ '&status=' + status+ '&yard='+yard);
  }

  startOperation(data: any) {
    return this.http.put<any>(environment.url + 'TMSOperation/StartOperation', data, httpOptions);
  }

  endOperation(data: any) {
    return this.http.put<any>(environment.url + 'TMSOperation/EndOperation', data, httpOptions);
  }

}
