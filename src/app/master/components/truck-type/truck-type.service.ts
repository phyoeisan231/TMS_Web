import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  @Injectable({
    providedIn: 'root'
  })
  export class TruckTypeService {
    constructor (private http: HttpClient, ) { }

    getTruckTypeList(active: string) {
      return this.http.get<any>(environment.url + 'Master/GetTruckTypeList/?active=' + active);
    }
    createTruckType(data: any) {
      return this.http.post<any>(environment.url + 'Master/SaveTruckType', data, httpOptions);
    }

    updateTruckType(data: any) {
      return this.http.put<any>(environment.url + 'Master/UpdateTruckType/', data, httpOptions);
    }

    deleteTruckType(id: any) {
      return this.http.delete<any>(environment.url + 'Master/DeleteTruckType/' + id, httpOptions);
    }
}
