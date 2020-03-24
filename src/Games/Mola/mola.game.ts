import { Game, State, Player } from "../TwoPlayer/game";

export class MolaGame implements Game {

    playerOne: Player = new MolaPlayer(1);
    playerTwo: Player = new MolaPlayer(-1);

    state: State = new MolaState([0,0,0,0,0,0,0,0,0]);

    runGame() {
        let playerTurn: Player = this.playerOne;
    }

    getAllowedMoves<MolaState>(state: MolaState, player: Player): MolaState[] {
        let result: MolaState[] = new Array();
        result.concat(new SetRule().resultingStates(state, player))
        return result;
    }    
    
    doMove(move: State, player: Player): boolean {
        throw new Error("Method not implemented.");
    }

}

export interface Rule {

    isApplicable(state: MolaState, player: MolaPlayer): boolean;

    resultingStates(state: MolaState, player: MolaPlayer): Set<MolaState>;
}

class SetRule implements Rule {

    isApplicable(state: MolaState, player: MolaPlayer): boolean {
        return !allStonesSet(state, player);
    }    
    
    resultingStates(state: MolaState, player: MolaPlayer): Set<MolaState> {
        let result: Set<MolaState> = new Set<MolaState>();
        if(this.isApplicable(state, player)) {
            for(var i=0; i<9; i++) {
                if(state.positions[i] == 0) {
                    let newPositions: number[] = Object.assign([], state.positions);
                    newPositions[i] = player.getPlayerSymbol();
                    result.add(new MolaState(newPositions));
                }
            }
        }
        return result;
    }
   
}

class MoveRule implements Rule {
    isApplicable(state: MolaState, player: MolaPlayer): boolean {
        return allStonesSet(state, player);
    }    
    
    resultingStates(state: MolaState, player: MolaPlayer): Set<MolaState> {
        let result: Set<MolaState> = new Set<MolaState>();
        if(this.isApplicable(state, player)) {
            for(var i=0; i<9; i++) {
                if(state.positions[i] === player.getPlayerSymbol()) {
                    if(i-1 % 3 != 2 && state.positions[i-1] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i-1] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.add(new MolaState(newPositions));
                    }
                    if(i+1 % 3 != 0 && state.positions[i+1] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i+1] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.add(new MolaState(newPositions));
                    }
                    if(i-3 >= 0 && state.positions[i-3] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i-3] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.add(new MolaState(newPositions));
                    }
                    if(i+3 < 9 && state.positions[i+3] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i+3] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.add(new MolaState(newPositions));
                    }
                }
            }
        }
        return result;
    }

}

class JumpRule implements Rule {
    isApplicable(state: MolaState, player: MolaPlayer): boolean {
        return allStonesSet(state, player);
    }    
    
    resultingStates(state: MolaState, player: MolaPlayer): Set<MolaState> {
        let result: Set<MolaState> = new Set<MolaState>();
        if(this.isApplicable(state, player)) {
            for(var i=0; i<9; i++) {
                if(state.positions[i] === player.getPlayerSymbol()) {
                    if(i-2 % 3 != 1 && state.positions[i-1] !== 0 && state.positions[i-1] !== player.getPlayerSymbol() && state.positions[i-2] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i-2] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.add(new MolaState(newPositions));
                    }
                    if(i+2 % 3 != 1 && state.positions[i+1] !== 0 && state.positions[i+1] !== player.getPlayerSymbol() && state.positions[i+2] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i+2] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.add(new MolaState(newPositions));
                    }
                    if(i-6 >= 0 && state.positions[i-3] !== 0 && state.positions[i-3] !== player.getPlayerSymbol() && state.positions[i-6] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i-3] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.add(new MolaState(newPositions));
                    }
                    if(i+6 < 9 && state.positions[i+3] !== 0 && state.positions[i+3] !== player.getPlayerSymbol() && state.positions[i+6] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i+3] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.add(new MolaState(newPositions));
                    }
                }
            }
        }
        return result;
    }

    
}

function allStonesSet(state: MolaState, player: MolaPlayer): boolean {
    let count = 0;
    for(var i=0; i<9; i++) {
        if(state.positions[i] == player.getPlayerSymbol()) {
            count++;
            if(count > 2) {
                return true;
            }
        }
    }
    return false;
}

export class MolaPlayer implements Player {

    constructor(private playerSymbol: number) {

    }

    getPlayerSymbol(): number {
        return this.playerSymbol;
    }

}

export class MolaState implements State {

    constructor(public positions: number[]) {
        // TODO: length check
    }

}

