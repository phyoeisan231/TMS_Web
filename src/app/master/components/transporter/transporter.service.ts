import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions={
  headers:new HttpHeaders({'Content-Type':'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class TransporterService {

  constructor(private http:HttpClient) { }

  getTransporterList(){
    return this.http.get<any>(environment.url+'Master/GetTransporterList');
  }
  
  deleteTransporter(id:any){
    return this.http.delete<any>(environment.url+'Master/DeleteTransporter/'+id,httpOptions);
  }

}
