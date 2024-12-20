import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 };
  @Injectable({
    providedIn: 'root'
  })
export class TmsInCheckPorposalService {
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
    return this.http.get<any>(environment.url + 'TMSOperation/GetCategoryList/?type=' + type);
  }

  getCardICDList(yard: string,gpName:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetCardList/?yard=' + yard+ '&gpName='+ gpName);
  }

  getTruckList(id: string,poNo:any) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetTruckDataListByProposal/?id=' + id+ '&poNo='+ poNo );
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

  getTMSProposalList(startDate:any,endDate:any,yard:string,deptType:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetTMSProposalList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard=' + yard+ '&deptType=' + deptType);
  }

  getDocumentSettingList(id: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetDocumentSettingList/?id=' + id);
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

  getTMSProposalById(id: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetTMSProposalById/?id=' + id);
  }

  getInBoundCheckTMSList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetInBoundCheckTMSList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard=' + yard);
  }


}
