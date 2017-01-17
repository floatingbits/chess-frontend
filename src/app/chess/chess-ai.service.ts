import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class ChessAIService {

    constructor (private http: Http) {}
    private gameApiUrl = 'http://localhost:8000/api/v1/matches';
    getBestMove(matchId: number) {
        return this.http.get(this.gameApiUrl + '/' + matchId + '/bestmove')
            .map(res => res.text())
            .do(data => console.log(data))
            .catch(this.errorHandler);
    }
    private errorHandler (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}