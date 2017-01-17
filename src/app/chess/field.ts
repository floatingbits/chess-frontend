/**
 * Created by soeren on 13.01.17.
 */
import {Piece} from './piece';
export interface Field {
    color: string;
    pieces: Piece[];
    sanCode: string;
}