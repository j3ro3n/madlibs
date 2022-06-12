import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { StoreService } from './localStore.services';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient, private store: StoreService) { }

  postLogin(requestJson : any) {
    var player2 = "";
    var player3 = "";
    var player4 = "";
    if (requestJson.value.sessieid !== '') {
        player2 = "Bobby";
        player3 = "Buddy";
        player4 = "Johnny";
    }
    
    var login_response = {
        "sessieid": requestJson.value.sessieid || "80008",
        "player_1": requestJson.value.nickname,
        "player_2": player2 || "",
        "player_3": player3 || "",
        "player_4": player4 || "",
        "player_5": "",
        "player_6": ""
    }

    this.store.setGameState(login_response);
  }
}