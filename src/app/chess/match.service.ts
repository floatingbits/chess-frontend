import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ChessAIService} from './chess-ai.service';
import {MatchPersistenceService} from './match-persistence.service';
import {Match} from './match';
import { Subject } from 'rxjs/Subject';
var chess = require('chess');

@Injectable()
export class MatchService {
    private match: Match;
    private chessLogic;
    private newPositionSource = new Subject<string>();
    private moveMadeSource = new Subject<string>();
    private isThinking: boolean;
    newPosition$: Observable<string>;
    moveMade$: Observable<string>;

    constructor (private matchPersistence: MatchPersistenceService, private chessAI: ChessAIService) {
        this.newPosition$ = this.newPositionSource.asObservable();
        this.moveMade$= this.moveMadeSource.asObservable();
        this.chessLogic = chess.create();
        this.isThinking = false;
    }
    playMatch(match: Match) {

        this.chessLogic = chess.create();
        this.match = match;
        match.movesString.split(' ').forEach((move) => {
            if (move.length) {
                let notatedMove = this.getNotatedKey(move);
                if (notatedMove) {
                    this.chessLogic.move(notatedMove);
                }
                else {
                    //Exception???
                }
            }


        });
        this.newPositionSource.next(match.fenString);
    }

    getCurrentSide() {
        return this.chessLogic.game.getCurrentSide().name;
    }
    isAIThinking() {
        return this.isThinking;
    }

    makeMove(sourceSan: string, targetSan: string) {

        this.matchPersistence.storeMove(this.match.id, sourceSan + targetSan).subscribe(
            (match) => {
                this.chessLogic.move(this.getNotatedKey(sourceSan +  targetSan));
                this.isThinking = false;
                this.match = match;
                this.newPositionSource.next(match.fenString);
                this.moveMadeSource.next(sourceSan + targetSan);
            }
        );

    }
    playBestMove() {
        this.isThinking = true;
        this.chessAI.getBestMove(this.match.id).subscribe(
            (bestMove) => {
                this.makeMove(bestMove.substring(0,2), bestMove.substring(2,4));
            }
        );
    }
    isMoveValid(sanMove: string) {
       return this.getNotatedKey(sanMove).length > 0;
    }
    getMatches() {
        return this.matchPersistence.getMatches();
    }
    createMatch(description: string) {
        return this.matchPersistence.createMatch(description);
    }
    private getNotatedKey(sanMove: string) {
        let possibleMoves = this.chessLogic.getStatus().notatedMoves;
        for (let i = 0; i < Object.keys(possibleMoves).length; i++) {
            let key = Object.keys(possibleMoves)[i];

            let src = possibleMoves[key].src;
            let dest = possibleMoves[key].dest;
            let possibleSanString = src.file + src.rank + dest.file + dest.rank;
            if (sanMove == possibleSanString) {
                return key;
            }
        }
        return '';
    }

}