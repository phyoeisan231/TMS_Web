import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 };
  @Injectable({
    providedIn: 'root'
  })
export class InCheckService {
  constructor (private http: HttpClient) { }
  getYardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetYardList/?active=' + active);
  }

  getGateList(yard: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetGateInBoundList/?yard=' + yard);
  }

  getWBDataList(yard: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetWBDataList/?id=' + yard);
  }

  getAreaList(yard: string,gpName:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetOperationAreaDataList/?yard=' + yard+ '&gpName='+ gpName);
  }

  getCategoryList(type:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetCategoryInList/?type=' + type);
  }

  getCardICDList(yard: string,gpName:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetCardList/?yard=' + yard+ '&gpName='+ gpName);
  }

  getTruckList(id: string,type:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetTruckDataList/?id=' + id+ '&type='+ type );
  }

  getTrailerList() {
    return this.http.get<any>(environment.url + 'TMSOperation/GetTrailerDataList');
  }

  getTransporterList() {
    return this.http.get<any>(environment.url + 'TMSOperation/GetTransporterDataList');
  }

  getDriverList(id: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetDriverDataList/?id=' + id);
  }

  getInBoundCheckList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetInBoundCheckList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard=' + yard);
  }

  createInBoundCheck(data: any) {
    return this.http.post<any>(environment.url + 'TMSOperation/SaveInCheck', data, httpOptions);
  }

  deleteInBoundCheck(id: any,user:string) {
    return this.http.delete<any>(environment.url + 'TMSOperation/DeleteInCheck/?id=' + id+ '&user=' + user, httpOptions);
  }

  getInBoundCheckById(id: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetInBoundCheckById/?id=' + id);
  }

  getDocumentSettingList(id: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetDocumentSettingList/?id=' + id);
  }

}
