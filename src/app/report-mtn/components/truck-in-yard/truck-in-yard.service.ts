import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 };
@Injectable({
  providedIn: 'root'
})
export class TruckInYardService {

  constructor (private http: HttpClient) { }
  getYardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetYardList/?active=' + active);
  }

  getTruckInCheckList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckInCheckList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard='+yard);
  }  

  GetTruckInList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckInList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard='+yard);
  }  

  GetTruckInWeightList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckInWeightList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard='+yard);
  }  

  GetTruckOperationList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckOperationList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard='+yard);
  }  

  GetTruckOutWeightList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckOutWeightList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard='+yard);
  }  

  GetTruckOutCheckList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckOutCheckList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard='+yard);
  }  

  GetTruckOutList(startDate:any,endDate:any,yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckOutList/?startDate=' + startDate+ '&endDate=' + endDate+ '&yard='+yard);
  }  
}
