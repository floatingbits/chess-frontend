import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { AppConfig } from "../app.config";

@Injectable()
export class ChessAIService {

    constructor (private http: Http, private appConfig: AppConfig) {}
    private gameApiUrl = 'v1/matches';

    getBestMove(matchId: number) {
        return this.http.get(this.appConfig.apiEndpoint + this.gameApiUrl + '/' + matchId + '/bestmove')
            .map(res => res.text())
            .do(data => console.log(data))
            .catch(this.errorHandler);
    }
    private errorHandler (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}