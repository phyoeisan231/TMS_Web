import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class YardService {

  constructor (private http: HttpClient, ) { }

  getYardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetYardList/?active=' + active);
  }

  createYard(data: any) {
    return this.http.post<any>(environment.url + 'Master/SaveYard', data, httpOptions);
  }

  editYard(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdateYard/', data, httpOptions);
  }

  deleteYard(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeleteYard/' + id, httpOptions);
  }

}
