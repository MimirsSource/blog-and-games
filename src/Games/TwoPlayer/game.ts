export interface Game {

    getAllowedMoves<T extends State>(state: T, player: Player): T[];

    doMove(state: State, player: Player): boolean;

}

export interface Player {


}

export interface State {

}