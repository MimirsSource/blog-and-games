import { Game, State, Player } from "../TwoPlayer/game";
import MolaState from "./mola.state";
import { Rule, SetRule, MoveRule, JumpRule } from "./mola.rules";

export class MolaGame {

    playerOne: MolaPlayer = new AIPlayer(1);
    playerTwo: MolaPlayer = new AIPlayer(-1);

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


export abstract class MolaPlayer implements Player {

    constructor(private playerSymbol: number) {

    }

    getPlayerSymbol(): number {
        return this.playerSymbol;
    }

    chooseMove(states: MolaState[]): MolaState {
        return states[0]; // TODO knowledge base & training
    }

    abstract endGame(winner: boolean): void;

}

class AIPlayer extends MolaPlayer {

    minValue = -1000;
    maxValue = 1000;
    trainingMode: boolean = true;

    knowledgeBase: Map<number, number> = new Map();
    choiceHistory: Array<number> = new Array();

    chooseMove(states: MolaState[]): MolaState {
        if(this.trainingMode) {
            return this.trainingChoice(states);
        }
        return this.makeChoice(states);
    }

    trainingChoice(states: MolaState[]): MolaState {
        let choice: MolaState;
        if(Math.random() <= 0.2) {
            choice = states[Math.floor((Math.random() * states.length))];
        } else {
            choice = this.makeChoice(states);
        }
        this.choiceHistory.push(choice.id);
        return choice;
    }

    makeChoice(states: MolaState[]): MolaState {
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

    endGame(winner: boolean): void {
        this.propagateFeedback(winner ? this.maxValue : this.minValue);
    }

    propagateFeedback(reward: number) {
        let currentReward: number = reward;
        for(let i=this.choiceHistory.length; i >= 0; i--) {
            if(this.knowledgeBase.has(this.choiceHistory[i])) {
                this.knowledgeBase.set(this.choiceHistory[i], 
                (this.knowledgeBase.get(this.choiceHistory[i]) || 0)/2 + currentReward/2)
            } else {
                this.knowledgeBase.set(this.choiceHistory[i], currentReward);
            }
            currentReward = currentReward/2;
        }
    }
 
}
