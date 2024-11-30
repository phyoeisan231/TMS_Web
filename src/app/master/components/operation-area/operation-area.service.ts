import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class OperationAreaService {

  constructor (private http: HttpClient, ) { }

  getOperationAreas(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetOperationAreaList/?active=' + active);
  }
  
  getYardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetYardList/?active=' + active);
  }
  
  createOperationArea(data: any) {
    return this.http.post<any>(environment.url + 'Master/SaveOperationArea', data, httpOptions);
  }

  updateOperationArea(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdateOperationArea/', data, httpOptions);
  }

  deleteOperationArea(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeleteOperationArea/' + id, httpOptions);
  }  
}
