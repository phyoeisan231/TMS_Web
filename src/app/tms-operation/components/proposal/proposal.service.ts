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

  getYardList() {
    return this.http.get<any>(environment.url + 'TMSProposal/GetYardList');
  }

  getRailDailyJobList(jobType:string,yard:string){
    return this.http.get<any>(environment.url + 'TMSProposal/GetRailDailyJobList/?jobType=' + jobType+'&yard='+yard);
  }


  getWHDailyJobList(jobType:string,yard:string){
    return this.http.get<any>(environment.url + 'TMSProposal/GetWHDailyJobList/?jobType=' + jobType+'&yard='+yard);
  }

  getCCADailyJobList(jobType:string,yard:string){
    return this.http.get<any>(environment.url + 'TMSProposal/GetCCADailyJobList/?jobType=' + jobType+'&yard='+yard);
  }

  addTMSProposal(data: any) {
    return this.http.post<any>(environment.url + 'TMSProposal/CreateTMSProposal', data, httpOptions);
  }
  getProposalList(startDate:any,endDate:any,deptType) {
    return this.http.get<any>(environment.url + 'TMSProposal/GetProposalList/?startDate=' + startDate+ '&endDate=' + endDate+ '&deptType=' + deptType);
  }

  createProposalDetail(data: any) {
    return this.http.post<any>(environment.url + 'TMSProposal/CreateProposalDetail', data, httpOptions);
  }

  getTruckList(type: string,jobType:string) {
    return this.http.get<any>(environment.url + 'TMSProposal/GetTruckList/?type=' + type+'&jobType='+jobType);
  }

  getProposalDetailList(propNo:string){
    return this.http.get<any>(environment.url + 'TMSProposal/GetProposalDetailList/?propNo=' + propNo);
  }


  getCusTruckList(){
    return this.http.get<any>(environment.url + 'Master/GetTruckList');
  }

  getOperationAreas(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetOperationAreaList/?active=' + active);
  }

  getCategoryList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetPCategoryList/?active=' + active);
  }

  getBLNoList(code:string,dept:string){
    return this.http.get<any>(environment.url + 'TMSProposal/GetBLNoList/?code=' + code+'&dept='+dept);
  }

  deleteProposal(id: any) {
    return this.http.delete<any>(environment.url + 'TMSProposal/DeleteProposal/?id=' + id, httpOptions);
  }

  getProposalListById(id: string) {
    return this.http.get<any>(environment.url + 'TMSProposal/GetProposalListById/?id=' + id);
  }

  updateTMSProposal(data: any) {
    return this.http.put<any>(environment.url + 'TMSProposal/UpdateTMSProposal', data, httpOptions);
  }

  deleteProposalDetail(id: any,truckNo:any) {
    return this.http.delete<any>(environment.url + 'TMSProposal/DeleteProposalDetail/?id=' + id+'&truckNo='+truckNo, httpOptions);
  }

  completeProposal(id: any,user:any) {
    return this.http.put<any>(environment.url + 'TMSProposal/CompleteProposal/?id=' + id+'&user='+user, httpOptions);
  }

  statusChange(data: any) {
    return this.http.post<any>(environment.url + 'TMSProposal/StatusChange', data, {
      reportProgress: true,
    });
  }

}
