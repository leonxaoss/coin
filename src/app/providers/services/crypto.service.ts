import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Params } from '../../shared/classes/params';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  getCoins(searchParams: Params): Observable<any> {
    let params = new HttpParams()
      .set('search', searchParams.search)
      .set('timePeriod', searchParams.timePeriod)
      .set('orderDirection', searchParams.orderDirection)
      .set('limit', searchParams.limit)
      .set('offset', searchParams.offset);
    searchParams.uuids.forEach((name) => {
      params = params.append('uuids[]', name)
    })
    if(searchParams.orderBy) {
      params = params.append('orderBy', searchParams.orderBy)
    }
    return this.http.get(`${this.url}/coins`, {
      params: params
    });
  }

  getCoin(coinId: string, timePeriod = '30d'): Observable<any> {
    return this.http.get(`${this.url}/coin/${coinId}?timePeriod=${timePeriod}`);
  }

  getCoinHistory(uuid: string, timePeriod = '30d'): Observable<any> {
    return this.http.get(`${this.url}/coin/${uuid}/history?timePeriod=${timePeriod}`);
  }

}
