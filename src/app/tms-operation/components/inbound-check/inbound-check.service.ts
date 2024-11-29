import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
 const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 };

  @Injectable({
    providedIn: 'root'
  })
export class InboundCheckService {
  constructor (private http: HttpClient) { }
  getYardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetYardList/?active=' + active);
  }

  getGateList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetGateList/?active=' + active);
  }

  getCategoryList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetPCategoryList/?active=' + active);
  }

  getPCCodeList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetGateList/?active=' + active);
  }

  getTruckList(id: string) {
    return this.http.get<any>(environment.url + 'Master/GetTruckList/?id=' + id);
  }

  getTrailerList(id: string) {
    return this.http.get<any>(environment.url + 'Master/GetTrailerList/?id=' + id);
  }

  getDriverList(id: string) {
    return this.http.get<any>(environment.url + 'Master/GetDriverList/?id=' + id);
  }

  getInBoundCheckList(startDate:any,endDate:any,yard:string,status:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetInBoundCheckList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard=' + yard+ '&status=' + status);
  }

  createInBoundCheck(data: any) {
    return this.http.post<any>(environment.url + 'TMSOperation/SaveInBoundCheck', data, httpOptions);
  }

  deleteInBoundCheck(id: any) {
    return this.http.delete<any>(environment.url + 'TMSOperation/DeleteInBoundCheck/' + id, httpOptions);
  }
}
