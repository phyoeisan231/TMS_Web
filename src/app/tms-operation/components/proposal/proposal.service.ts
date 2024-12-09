import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 };

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  constructor (private http: HttpClient) { }

  getYardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetYardList/?active=' + active);
  }

  getTransporterList() {
    return this.http.get<any>(environment.url + 'TMSOperation/GetTransporterDataList');
  }

  getGateList(yard: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetGateInBoundList/?yard=' + yard);
  }

  getAreaList(yard: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetOperationAreaDataList/?yard=' + yard);
  }

  getCategoryList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetPCategoryList/?active=' + active);
  }

  getCardICDList(yard: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetCardICDList/?yard=' + yard);
  }

  getTruckList(id: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetTruckList/?id=' + id);
  }

  getTrailerList(searchedText: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetTrailerList/?searchedText=' + searchedText);
  }

  getDriverList(id: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetDriverDataList/?id=' + id);
  }

  getInBoundCheckList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetInBoundCheckList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard=' + yard);
  }

  createOutBoundCheck(data: any) {
    return this.http.post<any>(environment.url + 'TMSOperation/CreateOutBoundCheck', data, httpOptions);
  }

  deleteInBoundCheck(id: any,user:string) {
    return this.http.delete<any>(environment.url + 'TMSOperation/DeleteInBoundCheck/?id=' + id+ '&user=' + user, httpOptions);
  }

  getInBoundCheckById(id: string) {
    return this.http.get<any>(environment.url + 'TMSOperation/GetInBoundCheckById/?id=' + id);
  }

  updateInBoundCheck(data: any) {
    return this.http.put<any>(environment.url + 'TMSOperation/UpdateInBoundCheck', data, httpOptions);
  }

  updateInBoundCheckDocument(docList:string,id:number,user:string) {
    return this.http.put<any>(environment.url + 'TMSOperation/UpdateInBoundCheckDocument/?id=' + id+ '&docList=' + docList +'&user=' + user, httpOptions);
  }

  deleteInBoundCheckDocument(id: any,code:string) {
    return this.http.delete<any>(environment.url + 'TMSOperation/DeleteInBoundCheckDocument/?id=' + id+ '&code=' + code, httpOptions);
  }
}
