import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*
  Service to communicate with to reach the API backend.
*/
@Injectable()
export class ApiService {
  // The url at which the API is listening.
  readonly CONNECTOR = 'http://localhost:1234/';
  // readonly CONNECTOR = "http://madderlibs.koreacentral.azurecontainer.io/MadderLibsAPI/";
  
  // Constructor
  constructor(private http: HttpClient) { }

  /*
    This function actually does the posting. It sends an https request and returns it
    as a Promise. This promise can then be sent all the way back to calling component
    allowing the code to wait for the result of the http request.
  */
  async post(requestJson : any, endpoint : string) {
    return new Promise<object>((resolve, reject) => {
      let params = new HttpHeaders().set('requestJson', JSON.stringify(requestJson));
      this.http.get( this.CONNECTOR + endpoint, 
      {
        headers: params
      }).subscribe((result) => {
        resolve(result);
      });
    });
  }
}