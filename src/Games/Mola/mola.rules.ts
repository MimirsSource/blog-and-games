import { MolaPlayer } from "./mola.game";
import MolaState from "./mola.state";

export interface Rule {

    isApplicable(state: MolaState, player: MolaPlayer): boolean;

    resultingStates(state: MolaState, player: MolaPlayer): MolaState[];
}

export class SetRule implements Rule {

    isApplicable(state: MolaState, player: MolaPlayer): boolean {
        return !allStonesSet(state, player);
    }

    resultingStates(state: MolaState, player: MolaPlayer): MolaState[] {
        let result: MolaState[] = new Array();
        console.log("Sets");
        if (this.isApplicable(state, player)) {
            console.log(state.positions);
            for (var i = 0; i < 9; i++) {
                if (state.positions[i] === 0) {
                    result.push(putStone(state, player.getPlayerSymbol(), i));
                }
            }
        }
        console.log(result);
        return result;
    }

}

export class MoveRule implements Rule {
    isApplicable(state: MolaState, player: MolaPlayer): boolean {
        return allStonesSet(state, player);
    }

    resultingStates(state: MolaState, player: MolaPlayer): MolaState[] {
        let result: MolaState[] = new Array();
        if (this.isApplicable(state, player)) {
            for (var i = 0; i < 9; i++) {
                if (state.positions[i] === player.getPlayerSymbol()) {
                    if ((i - 1) % 3 != 2 && state.positions[i - 1] === 0) {
                        result.push(moveStone(state, i, i-1));
                    }
                    if ((i + 1) % 3 != 0 && state.positions[i + 1] === 0) {
                        result.push(moveStone(state, i, i+1));
                    }
                    if (i - 3 >= 0 && state.positions[i - 3] === 0) {
                        result.push(moveStone(state, i, i-3));
                    }
                    if (i + 3 < 9 && state.positions[i + 3] === 0) {
                        result.push(moveStone(state, i, i+3));
                    }
                }
            }
        }
        return result;
    }

}

export class JumpRule implements Rule {
    isApplicable(state: MolaState, player: MolaPlayer): boolean {
        return allStonesSet(state, player);
    }

    resultingStates(state: MolaState, player: MolaPlayer): MolaState[] {
        let result: MolaState[] = new Array();
        if (this.isApplicable(state, player)) {
            for (var i = 0; i < 9; i++) {
                if (state.positions[i] === player.getPlayerSymbol()) {
                    if ((i - 2) % 3 != 1 && state.positions[i - 1] !== 0 && 
                        state.positions[i - 1] !== player.getPlayerSymbol() && 
                        state.positions[i - 2] === 0) {
                            result.push(moveStone(state, i, i-2));
                    }
                    if ((i + 2) % 3 != 1 && state.positions[i + 1] !== 0 && 
                        state.positions[i + 1] !== player.getPlayerSymbol() && 
                        state.positions[i + 2] === 0) {
                            result.push(moveStone(state, i, i+2));
                    }
                    if (i - 6 >= 0 && state.positions[i - 3] !== 0 && 
                        state.positions[i - 3] !== player.getPlayerSymbol() && 
                        state.positions[i - 6] === 0) {
                            result.push(moveStone(state, i, i-6));
                    }
                    if (i + 6 < 9 && state.positions[i + 3] !== 0 && 
                        state.positions[i + 3] !== player.getPlayerSymbol() && 
                        state.positions[i + 6] === 0) {
                            result.push(moveStone(state, i, i+6));
                    }
                }
            }
        }
        return result;
    }


}

const allStonesSet = (state: MolaState, player: MolaPlayer): boolean => {
    let count = 0;
    for (var i = 0; i < 9; i++) {
        if (state.positions[i] == player.getPlayerSymbol()) {
            count++;
            if (count > 2) {
                return true;
            }
        }
    }
    return false;
}

const putStone = (state: MolaState, symbol: number, position: number): MolaState => {
    let newPositions: number[] = Object.assign([], state.positions);
    newPositions[position] = symbol;
    return new MolaState(newPositions);
}

const moveStone = (state: MolaState, fromPosition: number, toPosition: number) => {
    let newPositions: number[] = Object.assign([], state.positions);
    newPositions[toPosition] = newPositions[fromPosition];
    newPositions[fromPosition] = 0;
    return new MolaState(newPositions);
}
