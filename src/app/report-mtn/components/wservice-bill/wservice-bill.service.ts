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
  GetGateList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetGateList/?active=' + active);
  }
  
  getServiceBillList(fromDate:any,toDate:any,gate:any){
    return this.http.get<any>(environment.url+'WeightSupport/GetServiceBillList/?fromDate='+fromDate+'&toDate='+toDate+'&gate='+gate);
  }  
}
