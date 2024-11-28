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
export class CategoryService {

  constructor (private http: HttpClient, ) { }
  getCategoryList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetPCategoryList/?active=' + active);
  }

  createCategory(data: any) {
    return this.http.post<any>(environment.url + 'Master/SavePCategory', data, httpOptions);
  }

  updateCategory(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdatePCategory/', data, httpOptions);
  }

  deleteCategory(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeletePCategory/' + id, httpOptions);
  }
}
