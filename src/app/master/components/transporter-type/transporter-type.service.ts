import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class TransporterTypeService {

  constructor (private http: HttpClient, ) { }

  getTransporterTypes(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetTransporterTypeList/?active=' + active);
  }

  createTransporterType(data: any) {
    return this.http.post<any>(environment.url + 'Master/SaveTransporterType', data, httpOptions);
  }

  updateTransporterType(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdateTransporterType/', data, httpOptions);
  }

  deleteTransporterType(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeleteTransporterType/' + id, httpOptions);
  }  
}
