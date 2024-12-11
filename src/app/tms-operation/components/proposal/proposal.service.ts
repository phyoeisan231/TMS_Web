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

  getRailDailyJobList(sDate:any,jobType:string,yard:string){
    return this.http.get<any>(environment.url + 'TMSProposal/GetRailDailyJobList/?sDate=' + sDate+ '&jobType=' + jobType+ '&yard='+yard);
  }

  getCustomerList(){
    return this.http.get<any>(environment.url + 'TMSProposal/GetCustomerList');

  }

  getWHDailyJobList(sDate:any,jobType:string){
    return this.http.get<any>(environment.url + 'TMSProposal/GetWHDailyJobList/?sDate=' + sDate+ '&jobType=' + jobType);
  }

  getCCADailyJobList(sDate:any,jobType:string){
    return this.http.get<any>(environment.url + 'TMSProposal/GetCCADailyJobList/?sDate=' + sDate+ '&jobType=' + jobType);
  }

  addTMSProposal(data: any) {
    console.log(data)
    return this.http.post<any>(environment.url + 'TMSProposal/CreateTMSProposal', data, httpOptions);
  }
  getProposalList(startDate:any,endDate:any,deptType) {
    alert("access")
    return this.http.get<any>(environment.url + 'TMSProposal/GetProposalList/?startDate=' + startDate+ '&endDate=' + endDate+ '&deptType=' + deptType);
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
