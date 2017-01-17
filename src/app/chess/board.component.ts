import './board.css';
import 'dragula/dist/dragula.css';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Row} from './row';
import {DragulaService} from 'ng2-dragula';
import {MatchService} from './match.service';
import { ISubscription }   from 'rxjs/Subscription';

const PIECE_CONFIG: Object = {
    'r': '&#9820;',
    'n': '&#9822;',
    'b': '&#9821;',
    'q': '&#9819;',
    'k': '&#9818;',
    'p': '&#9823;',
    'R': '&#9814;',
    'N': '&#9816;',
    'B': '&#9815;',
    'Q': '&#9813;',
    'K': '&#9812;',
    'P': '&#9817;'
};

const START_FEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const DRAGULA_BAG_NAME: string = "piece-bag";

@Component({
    selector: 'board',
    templateUrl: './board.component.html',

})
export class BoardComponent implements OnInit, OnDestroy {
    rows: Row[];
    subscription: ISubscription;

    constructor (private dragulaService: DragulaService, private matchService: MatchService) {
        this.subscription = matchService.newPosition$.subscribe(
            fenString => {
                this.movePiecesAccordingToFEN(fenString);
            });

        this.initBoard();
        this.initPieces();
        dragulaService.dropModel.subscribe((value) => {
            let source = value[3];
            let target = value[2];
            this.handlePossibleCapture(target.getAttribute('sancode'));
            this.matchService.makeMove(source.getAttribute('sancode'), target.getAttribute('sancode'));
        });
        dragulaService.drag.subscribe((value) => {
            let piece = this.getPieceBySanCode(value[2].getAttribute('sancode'));
            if (piece) {
                piece.lifted = true;
            }
        });
        dragulaService.cancel.subscribe((value) => {
            let piece = this.getPieceBySanCode(value[3].getAttribute('sancode'));
            if (piece) {
                piece.lifted = false;
            }
        });
    }
    private getPieceBySanCode(sanSquare: string) {
        var piece = null;
        this.rows.forEach((row) => {
            row.fields.forEach((field) => {
                if (field.sanCode == sanSquare) {
                    piece = field.pieces[0];
                }
            });
        });
        return piece;
    }

    /**
     * if there are two pieces on the indicated sqaure, remove the one without a "lifted" flag, bc obviously it's the
     * one that has been captured.
     * @param sanSquare
     */
    private handlePossibleCapture(sanSquare: string) {
        this.rows.forEach((row) => {
            row.fields.forEach((field) => {
                if (field.sanCode == sanSquare) {
                    let pieces = [];
                    field.pieces.forEach((piece) => {
                        //Keep the capturing piece
                       if (piece.lifted) {
                           piece.lifted = false;
                           pieces.push(piece);
                       }
                    });
                    field.pieces = pieces;
                }
            });
        });
    }

    /**
     * init the dragula drag + drop
     */
    ngOnInit() {
        if (this.dragulaService.find(DRAGULA_BAG_NAME)) {
            this.dragulaService.destroy(DRAGULA_BAG_NAME);
        }
        this.dragulaService.setOptions(DRAGULA_BAG_NAME, {
            accepts: (el, target, source, sibling):boolean => {
                let sourceSquare = source.getAttribute('sancode');
                let targetSquare = target.getAttribute('sancode');
                return this.matchService.isMoveValid(sourceSquare + targetSquare);
            }
        });
    }


    private initBoard() {
        this.rows = [];
        let firstColor = 'white';
        for (let rowNumber=8; rowNumber>0; rowNumber--) {
            let color = firstColor;
            let fields = [];
            for (let column = 0; column < 8; column++) {
                let columnChar: string = String.fromCharCode('a'.charCodeAt(0) + column);
                let pieces = [];
                let field = {
                    color: color,
                    pieces: pieces,
                    sanCode: columnChar + rowNumber
                }
                fields.push(field);
                color = ((color === 'white') ? 'black' : 'white');
            }
            let row = {
                fields: fields
            };
            this.rows[rowNumber - 1] = row;
            firstColor = ((firstColor === 'white') ? 'black' : 'white');
        }
    }

    private initPieces() {
        this.movePiecesAccordingToFEN(START_FEN);
    }

    private movePiecesAccordingToFEN(fenString: string) {
        let positions: string = fenString.split(' ')[0];
        let rowNumber: number = 7;
        positions.split('/').forEach((rowString) => {
            let fieldIndex: number = 0;

            for (var rowStringPos = 0; rowStringPos<rowString.length; rowStringPos++) {
                let currentChar: string = rowString.charAt(rowStringPos);
                if (parseInt(currentChar) > 0 ) {
                    let numberOfEmptyFields = parseInt(currentChar);
                    for (let emptyFieldIndex = 0; emptyFieldIndex < numberOfEmptyFields; emptyFieldIndex ++ ) {
                        this.rows[rowNumber].fields[fieldIndex].pieces = [
                        ];
                        fieldIndex++;
                    }
                }
                else {
                    let piece = {
                        'char': PIECE_CONFIG[currentChar]
                    };
                    this.rows[rowNumber].fields[fieldIndex].pieces = [
                        piece
                    ];
                    fieldIndex++;
                }
            }
            rowNumber--;
        });
    }
    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    }
}

