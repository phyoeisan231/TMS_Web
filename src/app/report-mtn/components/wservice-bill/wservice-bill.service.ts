import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 };
@Injectable({
  providedIn: 'root'
})
export class WserviceBillService {

  constructor (private http: HttpClient) { }
  GetYardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetYardList/?active=' + active);
  }

  GetGateList(active:string){
    return this.http.get<any>(environment.url+'Master/GetGateList/?active='+active);
  }
  
  getServiceBillList(startDate:any,endDate:any,yard:string,gate:string) {
    return this.http.get<any>(environment.url + 'WeightSupport/GetWeightServiceBillList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard=' + yard+'&gate='+gate);
  }
}
