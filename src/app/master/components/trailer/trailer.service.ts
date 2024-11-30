import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

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
  
  // getDriverLicenseNo(active?:string):Observable<any[]>{
  //   const params=active?{active}:{};
  //   return this.http.get<any[]>(`${environment.url}Master/GetDriverList`,{params});
  // }
  deleteTrailer(id:any){
    return this.http.delete<any>(environment.url+'Master/DeleteTrailer/'+id,httpOptions);
  } 
}
