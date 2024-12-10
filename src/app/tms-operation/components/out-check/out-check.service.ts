import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 };
  @Injectable({
    providedIn: 'root'
  })
export class OutCheckService {
  constructor (private http: HttpClient) { }
  getYardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetYardList/?active=' + active);
  }

  getGateList(yard: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetGateOutBoundList/?yard=' + yard);
  }

  // getWBDataList(yard: string) {
  //   return this.http.get<any>(environment.url + 'TMSOperation/GetWBDataList/?id=' + yard);
  // }

  // getAreaList(yard: string) {
  //   return this.http.get<any>(environment.url + 'TMSOperation/GetOperationAreaDataList/?yard=' + yard);
  // }

  getCategoryList() {
    return this.http.get<any>(environment.url + 'TMSOperation/GetCategoryICDOList');
  }

  getCardICDList(card:string,yard: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetCardICDOInList/?card=' + card+ '&yard=' + yard);
  }


  getOutBoundCheckList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetOutBoundCheckList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard=' + yard);
  }

  createOutBoundCheck(data: any) {
    return this.http.post<any>(environment.url + 'TMSOperation/SaveOutCheck', data, httpOptions);
  }

  deleteOutBoundCheck(id: any,user:string) {
    return this.http.delete<any>(environment.url + 'TMSOperation/DeleteOutCheck/?id=' + id+ '&user=' + user, httpOptions);
  }

  getOutBoundCheckById(id: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetOutBoundCheckById/?id=' + id);
  }

  getDocumentSettingList(id: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetDocumentSettingList/?id=' + id);
  }
}
