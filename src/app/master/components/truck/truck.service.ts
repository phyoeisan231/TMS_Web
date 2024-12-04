import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions={
  headers:new HttpHeaders({'Content-Type':'application/json'}),
};
@Injectable({
  providedIn: 'root'
})
export class TruckService {

  constructor(private http:HttpClient) { }
  
  getTruckList(){
    return this.http.get<any>(environment.url+'Master/GetTruckList');
  }
  
  onBlackForm(data: any) {
    return this.http.put<any>(environment.url + 'Master/BlackFormForTruck/', data, httpOptions);
  }

  deleteTruck(id:any){
    return this.http.delete<any>(environment.url+'Master/DeleteTruck/'+id,httpOptions);
  }
   
}
