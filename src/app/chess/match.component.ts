import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Match} from './match';
import {MatchService} from './match.service';
import {MatchPersistenceService} from './match-persistence.service';
import {ChessAIService} from './chess-ai.service';

@Component({
    selector: 'match-chooser',
    templateUrl: './match.component.html',
    providers: [MatchService, MatchPersistenceService, ChessAIService]
})
export class MatchComponent implements OnInit {
    private matches: Match[];
    private activeAIs: any;
    private initialized: boolean;
    constructor (private matchService: MatchService) {
        this.activeAIs = {
            black: false,
            white: false
        }
        this.initialized = false;
        this.matchService.moveMade$.subscribe(
            (moveString) => {
                this.onMoveMade(moveString);
            }
        );
    }
    private onMoveMade(moveString) {
        this.updateMatches(this.matchService.getCurrentMatch());
        if (this.isAI(this.matchService.getCurrentSide())) {
            this.matchService.playBestMove();
        }
    }
    aiChanged() {
        if (this.isAI(this.matchService.getCurrentSide()) && !this.matchService.isAIThinking()) {
            this.matchService.playBestMove();
        }
    }
    private updateMatches(match: Match) {
        this.matches.forEach((m,i) => {
            if (m.id == match.id) {
                this.matches[i] = match;
            }
        });
    }
    private isAI(sideString: string) {
        return this.activeAIs[sideString];
    }
    ngOnInit() {
        this.matchService.getMatches().subscribe(
            (matches) => {
                this.matches = <Match[]>matches;
                this.initialized = true;
            }
        );
    }

    playMatch(match: Match) {
        console.log(match.fenString);
        this.matchService.playMatch(match);
    }
    deleteMatch(match: Match) {
        this.matchService.deleteMatch(match).subscribe();
        this.matches.forEach((m,i) => {
            if (m.id == match.id) {
                this.matches.splice(i,1);
            }
        });
    }

    createMatch(description: string) {
        this.matchService.createMatch(description).subscribe(
            (match) => {
                this.matches.push(match);
            }
        );
    }
}

