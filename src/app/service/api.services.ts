import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*
  Service to communicate with to reach the API backend.
*/
@Injectable()
export class ApiService {
  // The url at which the API is listening.
  readonly CONNECTOR = 'http://localhost:1234/';
  
  // Constructor
  constructor(private http: HttpClient) { }

  // Post the login object to retrieve the current game state for the session.
  async postLogin(requestJson : any) : Promise<object> {
    return this.post(requestJson, "login");
  }

  // Post a request to receive the current mad lib for the session.
  async postMadLib(requestJson : any)  : Promise<object> {
    return this.post(requestJson, "madlib");
  }

  /*
    This function actually does the posting. It sends an https request and returns it
    as a Promise. This promise can then be sent all the way back to calling component
    allowing the code to wait for the result of the http request.
  */
  async post(requestJson : any, action : string) {
    return new Promise<object>((resolve, reject) => {
      let params = new HttpHeaders().set('requestJson', JSON.stringify(requestJson));
      this.http.get( this.CONNECTOR + action, 
      {
        headers: params
      }).subscribe((result) => {
        resolve(result);
      });
    });
  }
}