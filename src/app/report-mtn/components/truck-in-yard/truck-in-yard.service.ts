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

  getTruckInCheckList(yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckInCheckList/?yard='+yard);
  }  

  GetTruckInList(yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckInList/?yard='+yard);
  }  

  GetTruckInWeightList(yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckInWeightList/?yard='+yard);
  }  

  GetTruckOperationList(yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckOperationList/?yard='+yard);
  }  

  GetTruckOutWeightList(yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckOutWeightList/?yard='+yard);
  }  

  GetTruckOutCheckList(yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckOutCheckList/?yard='+yard);
  }  

  GetTruckOutList(yard:string) {
    return this.http.get<any>(environment.url + 'Report/GetTruckOutList/?yard='+yard);
  }  
}
