import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class TruckJobTypeService {

  constructor (private http: HttpClient, ) { }
  getTruckJobTypes(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetTruckJobTypeList/?active=' + active);
  }

  createTruckJobType(data: any) {
    return this.http.post<any>(environment.url + 'Master/SaveTruckJobType', data, httpOptions);
  }

  updateTruckJobType(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdateTruckJobType/', data, httpOptions);
  }

  deleteTruckJobType(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeleteTruckJobType/' + id, httpOptions);
  }
}
