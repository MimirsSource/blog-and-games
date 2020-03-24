import { Game, State, Player } from "../TwoPlayer/game";

export class MolaGame {

    playerOne: MolaPlayer = new MolaPlayer(1);
    playerTwo: MolaPlayer = new MolaPlayer(-1);

    state: MolaState = new MolaState([0,0,0,0,0,0,0,0,0]);
    rules: Rule[] = [new SetRule(), new MoveRule(), new JumpRule()];

    runGame() {
        let running: boolean = false;
        while(running) {
            this.doMove(this.playerOne.chooseMove(this.getAllowedMoves(this.state, this.playerOne)), this.playerOne);
        }
    }

    getAllowedMoves(state: MolaState, player: MolaPlayer): MolaState[] {
        let result: MolaState[] = new Array();
        this.rules.forEach(rule => {
            result.concat(rule.resultingStates(state, player));
        });
        return result;
    }    
    
    doMove(state: MolaState, player: MolaPlayer): boolean {
        // if(!this.getAllowedMoves(state, player).includes)
        // TODO check if status is allowed
        this.state = new MolaState(state.positions);
        return true;
    }

    isWinningState(state: MolaState, player: MolaPlayer) {
        let symbol: number = player.getPlayerSymbol();
        // horizontal
        return state.positions[0] === symbol && state.positions[1] === symbol && state.positions[2] === symbol ||
        state.positions[3] === symbol && state.positions[4] === symbol && state.positions[5] === symbol ||
        state.positions[6] === symbol && state.positions[7] === symbol && state.positions[8] === symbol ||
        // vertical
        state.positions[0] === symbol && state.positions[3] === symbol && state.positions[6] === symbol ||
        state.positions[1] === symbol && state.positions[4] === symbol && state.positions[7] === symbol ||
        state.positions[2] === symbol && state.positions[5] === symbol && state.positions[8] === symbol ||
        // diagonal
        state.positions[0] === symbol && state.positions[4] === symbol && state.positions[8] === symbol ||
        state.positions[2] === symbol && state.positions[4] === symbol && state.positions[6] === symbol;
    }

}

export interface Rule {

    isApplicable(state: MolaState, player: MolaPlayer): boolean;

    resultingStates(state: MolaState, player: MolaPlayer): MolaState[];
}

class SetRule implements Rule {

    isApplicable(state: MolaState, player: MolaPlayer): boolean {
        return !allStonesSet(state, player);
    }    
    
    resultingStates(state: MolaState, player: MolaPlayer): MolaState[] {
        let result: MolaState[] = new Array();
        if(this.isApplicable(state, player)) {
            for(var i=0; i<9; i++) {
                if(state.positions[i] == 0) {
                    let newPositions: number[] = Object.assign([], state.positions);
                    newPositions[i] = player.getPlayerSymbol();
                    result.push(new MolaState(newPositions));
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
    
    resultingStates(state: MolaState, player: MolaPlayer): MolaState[] {
        let result: MolaState[] = new Array();
        if(this.isApplicable(state, player)) {
            for(var i=0; i<9; i++) {
                if(state.positions[i] === player.getPlayerSymbol()) {
                    if(i-1 % 3 != 2 && state.positions[i-1] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i-1] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.push(new MolaState(newPositions));
                    }
                    if(i+1 % 3 != 0 && state.positions[i+1] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i+1] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.push(new MolaState(newPositions));
                    }
                    if(i-3 >= 0 && state.positions[i-3] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i-3] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.push(new MolaState(newPositions));
                    }
                    if(i+3 < 9 && state.positions[i+3] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i+3] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.push(new MolaState(newPositions));
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
    
    resultingStates(state: MolaState, player: MolaPlayer): MolaState[] {
        let result: MolaState[] = new Array();
        if(this.isApplicable(state, player)) {
            for(var i=0; i<9; i++) {
                if(state.positions[i] === player.getPlayerSymbol()) {
                    if(i-2 % 3 != 1 && state.positions[i-1] !== 0 && state.positions[i-1] !== player.getPlayerSymbol() && state.positions[i-2] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i-2] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.push(new MolaState(newPositions));
                    }
                    if(i+2 % 3 != 1 && state.positions[i+1] !== 0 && state.positions[i+1] !== player.getPlayerSymbol() && state.positions[i+2] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i+2] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.push(new MolaState(newPositions));
                    }
                    if(i-6 >= 0 && state.positions[i-3] !== 0 && state.positions[i-3] !== player.getPlayerSymbol() && state.positions[i-6] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i-3] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.push(new MolaState(newPositions));
                    }
                    if(i+6 < 9 && state.positions[i+3] !== 0 && state.positions[i+3] !== player.getPlayerSymbol() && state.positions[i+6] === 0) {
                        let newPositions: number[] = Object.assign([], state.positions);
                        newPositions[i+3] = player.getPlayerSymbol();
                        newPositions[i] = 0;
                        result.push(new MolaState(newPositions));
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

    chooseMove(states: MolaState[]): MolaState {
        return states[0]; // TODO knowledge base & training
    }

}

export class MolaState implements State {

    constructor(public positions: number[]) {
        
    }

}

