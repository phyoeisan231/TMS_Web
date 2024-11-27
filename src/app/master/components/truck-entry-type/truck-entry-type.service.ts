import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class TruckEntryTypeService {

  constructor (private http: HttpClient, ) { }
  getTruckEntryTypeList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetTruckEntryTypeList/?active=' + active);
  }

  createTruckEntryType(data: any) {
    return this.http.post<any>(environment.url + 'Master/SaveTruckEntryType', data, httpOptions);
  }

  updateTruckEntryType(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdateTruckEntryType/', data, httpOptions);
  }

  deleteTruckEntryType(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeleteTruckEntryType/' + id, httpOptions);
  }  
}
