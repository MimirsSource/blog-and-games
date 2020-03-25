import { Game, State, Player } from "../TwoPlayer/game";
import MolaState from "./mola.state";
import { Rule, SetRule, MoveRule, JumpRule } from "./mola.rules";

export class MolaGame {

    playerOne: MolaPlayer = new MolaPlayer(1);
    playerTwo: MolaPlayer = new MolaPlayer(-1);

    state: MolaState = new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    rules: Rule[] = [new SetRule(), new MoveRule(), new JumpRule()];

    runGame(uiStateHandler: (gameState: MolaState) => void) {
        console.log("Started game");
        let running: boolean = true;
        let count = 0;
        while (running) {
            console.log("Turn " + count);
            count++;
            this.doMove(this.playerOne.chooseMove(this.getAllowedMoves(this.state, this.playerOne)), this.playerOne);
            uiStateHandler(this.state);
            if (this.isWinningState(this.state, this.playerOne)) {
                running = false;
            } else {
                this.doMove(this.playerTwo.chooseMove(this.getAllowedMoves(this.state, this.playerTwo)), this.playerTwo);
                uiStateHandler(this.state);
                if (this.isWinningState(this.state, this.playerTwo)) {
                    running = false;
                }
            }
        }
    }

    getAllowedMoves(state: MolaState, player: MolaPlayer): MolaState[] {
        let result: MolaState[] = new Array();
        for(let i: number = 0; i<this.rules.length; i++) {
            result = result.concat(this.rules[i].resultingStates(state, player));
            console.log(result);
        }
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

class AIPlayer extends MolaPlayer {

    minValue = -1000;
    maxValue = 1000;

    knowledgeBase: Map<number, number> = new Map();

    chooseMove(states: MolaState[]): MolaState {
        let stateValue : number = this.minValue;
        let choice: MolaState = states[0];
        for(let i=0; i<states.length; i++) {
            let currentValue = this.knowledgeBase.get(states[i].id);
            if(currentValue != null && currentValue >= stateValue) {
                stateValue = currentValue;
                choice = states[i];
            }
        }
        return choice;
    }

}
