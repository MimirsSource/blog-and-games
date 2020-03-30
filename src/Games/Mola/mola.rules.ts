import MolaState from "./mola.state";
import { MolaPlayer } from "./mola.player";

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
        if (this.isApplicable(state, player)) {
            let positions: number[] = state.getPositions();
            for (var i = 0; i < 9; i++) {
                if (positions[i] === 0) {
                    result.push(state.putStone(player.getPlayerSymbol(), i));
                }
            }
        }
        // console.log(result);
        return result;
    }

}

class MoveRule implements Rule {
    isApplicable(state: MolaState, player: MolaPlayer): boolean {
        return allStonesSet(state, player);
    }

    resultingStates(state: MolaState, player: MolaPlayer): MolaState[] {
        let result: MolaState[] = new Array();
        if (this.isApplicable(state, player)) {
            let positions: number[] = state.getPositions();
            for (var i = 0; i < 9; i++) {
                if (positions[i] === player.getPlayerSymbol()) {
                    if ((i - 1) % 3 != 2 && positions[i - 1] === 0) {
                        result.push(state.moveStone(i, i-1));
                    }
                    if ((i + 1) % 3 != 0 && positions[i + 1] === 0) {
                        result.push(state.moveStone(i, i+1));
                    }
                    if (i - 3 >= 0 && positions[i - 3] === 0) {
                        result.push(state.moveStone(i, i-3));
                    }
                    if (i + 3 < 9 && positions[i + 3] === 0) {
                        result.push(state.moveStone(i, i+3));
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
        if (this.isApplicable(state, player)) {
            let positions: number[] = state.getPositions();
            for (let i = 0; i < 9; i++) {
                if (positions[i] === player.getPlayerSymbol()) {
                    if (i % 3 === 2 && positions[i - 1] !== 0 && 
                        positions[i - 1] !== player.getPlayerSymbol() && 
                        positions[i - 2] === 0) {
                            result.push(state.moveStone(i, i-2));
                    }
                    if (i % 3 === 0 && positions[i + 1] !== 0 && 
                        positions[i + 1] !== player.getPlayerSymbol() && 
                        positions[i + 2] === 0) {
                            result.push(state.moveStone(i, i+2));
                    }
                    if (i - 6 >= 0 && positions[i - 3] !== 0 && 
                        positions[i - 3] !== player.getPlayerSymbol() && 
                        positions[i - 6] === 0) {
                            result.push(state.moveStone(i, i-6));
                    }
                    if (i + 6 < 9 && positions[i + 3] !== 0 && 
                        positions[i + 3] !== player.getPlayerSymbol() && 
                        positions[i + 6] === 0) {
                            result.push(state.moveStone(i, i+6));
                    }
                }
            }
        }
        return result;
    }


}

export const allStonesSet = (state: MolaState, player: MolaPlayer): boolean => {
    let count = 0;
    for (var i = 0; i < 9; i++) {
        if (state.getPositions()[i] == player.getPlayerSymbol()) {
            count++;
            if (count > 2) {
                return true;
            }
        }
    }
    return false;
}

export const rules: Rule[] = [new SetRule(), new MoveRule(), new JumpRule()];

export const getAllowedMoves = (state: MolaState, player: MolaPlayer): MolaState[] => {
    let result: MolaState[] = new Array();
    for (let i: number = 0; i < rules.length; i++) {
        result = result.concat(rules[i].resultingStates(state, player));
        // console.log(result);
    }
    return result;
}

export const isWinningState = (state: MolaState, player: MolaPlayer): boolean => {
    let symbol: number = player.getPlayerSymbol();
    let positions: number[] = state.getPositions();
    // horizontal
    return positions[0] === symbol && positions[1] === symbol && positions[2] === symbol ||
        positions[3] === symbol && positions[4] === symbol && positions[5] === symbol ||
        positions[6] === symbol && positions[7] === symbol && positions[8] === symbol ||
        // vertical
        positions[0] === symbol && positions[3] === symbol && positions[6] === symbol ||
        positions[1] === symbol && positions[4] === symbol && positions[7] === symbol ||
        positions[2] === symbol && positions[5] === symbol && positions[8] === symbol ||
        // diagonal
        positions[0] === symbol && positions[4] === symbol && positions[8] === symbol ||
        positions[2] === symbol && positions[4] === symbol && positions[6] === symbol;
}
