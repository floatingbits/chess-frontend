import {Observable} from 'rxjs/Rx';
import {Injectable} from '@angular/core';

import {Match} from './match';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { AppConfig } from "../app.config";

@Injectable()
export class MatchPersistenceService {

    constructor (private http: Http, private appConfig: AppConfig) {}
    private gameApiUrl = 'v1/matches';

    storeMove(matchId: number, sanString: string) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.appConfig.apiEndpoint + this.gameApiUrl + '/' + matchId +'/move', {moveString: sanString}, options)
            .map(res => <Match> res.json())
            .do(data => console.log(data))
            .catch(this.errorHandler);
    }

    getMatches() {
        return this.http.get(this.appConfig.apiEndpoint + this.gameApiUrl)
            .map(res => <Match[]> res.json())
            .do(data => console.log(data))
            .catch(this.errorHandler);
    }
    deleteMatch(matchId: number) {

        return this.http.delete(this.appConfig.apiEndpoint + this.gameApiUrl + '/' + matchId)
            .catch(this.errorHandler);
    }
    createMatch(description: string) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.appConfig.apiEndpoint + this.gameApiUrl, {description: description}, options)
            .map(res => <Match> res.json())
            .do(data => console.log(data))
            .catch(this.errorHandler);
    }
    private errorHandler (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}