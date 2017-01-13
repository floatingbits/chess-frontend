import './board.css';
import {Component} from '@angular/core';
import {Row} from './row';
@Component({
    selector: 'board',
    templateUrl: './board.component.html'
})
export class BoardComponent {
    rows: Row[];
    constructor () {
        this.rows = [];
        let firstColor = 'white';
        for (var i=0; i<8; i++) {
            let color = firstColor;
            let fields = [];
            for (var j=0; j<8; j++) {
                let piece = {
                  color: 'black',
                    char: '&#9812;'
                };
                let field = {
                    color: color,
                    piece: piece
                }
                fields.push(field);
                color = ((color === 'white') ? 'black' : 'white');
            }
            let row = {
              fields: fields
            };
            this.rows.push(row);
            firstColor = ((firstColor === 'white') ? 'black' : 'white');
        }
    }
}

