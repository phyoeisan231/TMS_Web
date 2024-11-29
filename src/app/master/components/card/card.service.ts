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
export class CardService {

  constructor (private http: HttpClient, ) { }
  getCardList(active: string) {
    return this.http.get<any>(environment.url + 'Master/GetPCardList/?active=' + active);
  }

  getYardList(active?: string): Observable<any[]> {
    const params = active ? { active } : {}; // If active is provided, use it as a query param
    return this.http.get<any[]>(`${environment.url}Master/GetYardList`, { params });
  }

  createCard(data: any) {
    return this.http.post<any>(environment.url + 'Master/SavePCard', data, httpOptions);
  }

  updateCard(data: any) {
    return this.http.put<any>(environment.url + 'Master/UpdatePCard/', data, httpOptions);
  }

  deleteCard(id: any) {
    return this.http.delete<any>(environment.url + 'Master/DeletePCard/' + id, httpOptions);
  }

}
