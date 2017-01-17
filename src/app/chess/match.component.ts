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
    constructor (private matchService: MatchService) {
        this.matchService.moveMade$.subscribe(
            (moveString) => {
                if (this.isAI(this.matchService.getCurrentSide())) {
                    this.matchService.playBestMove();
                }
            }
        );
    }
    private isAI(sideString: string) {
        console.log(sideString);
        return sideString == 'black';
    }
    ngOnInit() {
        this.matchService.getMatches().subscribe((matches) => this.matches = <Match[]>matches);
    }

    playMatch(match: Match) {
        console.log(match.fenString);
        this.matchService.playMatch(match);
    }

    createMatch(description: string) {
        this.matchService.createMatch(description).subscribe(
            (match) => {
                this.matches.push(match);
            }
        );
    }
}

