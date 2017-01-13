import './board.css';
import 'dragula/dist/dragula.css';
import {Component} from '@angular/core';
import {Row} from './row';
import {Dragula, DragulaService} from 'ng2-dragula';
@Component({
    selector: 'board',
    templateUrl: './board.component.html',
    directives: [Dragula]
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
                let pieces =[ {
                  color: 'black',
                    char: '&#9812;'
                }];
                if (j > 0) {
                    pieces = [];
                }
                let field = {
                    color: color,
                    piece: pieces
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

