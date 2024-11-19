import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

@Injectable({
  providedIn: 'root'
})
export class TrailerTypeService {

 constructor (private http: HttpClient, ) { }

    getTrailerTypeList(active: string) {
      return this.http.get<any>(environment.url + 'Master/GetTrailerTypeList/?active=' + active);
    }
    createTrailerType(data: any) {
      return this.http.post<any>(environment.url + 'Master/SaveTrailerType', data, httpOptions);
    }

    updateTrailerType(data: any) {
      return this.http.put<any>(environment.url + 'Master/UpdateTrailerType/', data, httpOptions);
    }

    deleteTrailerType(id: any) {
      return this.http.delete<any>(environment.url + 'Master/DeleteTrailerType/' + id, httpOptions);
    }}
