import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions={
  headers:new HttpHeaders({'Content-Type':'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class TrailerService {

  constructor(private http:HttpClient) { }
  getTrailerList(){
    return this.http.get<any>(environment.url+'Master/GetTrailerList');
  }
  
  deleteTrailer(id:any){
    return this.http.delete<any>(environment.url+'Master/DeleteTrailer/'+id,httpOptions);
  } 
}
