import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 };
  @Injectable({
    providedIn: 'root'
  })
export class GateInService {
  constructor (private http: HttpClient) { }

  getYardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetYardList/?active=' + active);
  }

  getGateInList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetGateInList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard=' + yard);
  }

}

