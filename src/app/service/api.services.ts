import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoreService } from './localStore.services';


@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient
  ) { }

  async postLogin(requestJson : any) : Promise<object> {
    return this.post(requestJson, "login");
  }

  async postMadLib(requestJson : any)  : Promise<object> {
    return this.post(requestJson, "madlib");
  }

  async post(requestJson : any, action : string) {
    return new Promise<object>((resolve, reject) => {
      let params = new HttpHeaders()
      .set('requestJson', JSON.stringify(requestJson));
      this.http.get( 'http://localhost:1234/' + action, 
      {
        headers: params
      }).subscribe((result) => {
        resolve(result);
      });
    });
  }
}