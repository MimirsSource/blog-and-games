import MolaState from "./mola.state";

import { isWinningState, getAllowedMoves } from "./mola.rules";

export abstract class MolaPlayer {

    opponent!: MolaPlayer;

    constructor(private playerSymbol: number) { }

    setOpponent(player: MolaPlayer) {
        this.opponent = player;
    }

    getPlayerSymbol(): number {
        return this.playerSymbol;
    }

    abstract opponentStateInformation(state: MolaState): void;

    abstract chooseMove(states: MolaState[]): MolaState | null;

    abstract endGame(winner: boolean): void;

}

export class AIPlayer extends MolaPlayer {

    private readonly minValue = -1000;
    private readonly maxValue = 1000;
    public trainingMode: boolean = false;

    private knowledgeBase: Map<string, number> = new Map();
    private choiceHistory: Array<string> = new Array();

    public chooseMove(states: MolaState[]): MolaState {
        if (this.trainingMode) {
            return this.trainingChoice(states);
        }
        return this.makeChoice(states);
    }

    private trainingChoice(states: MolaState[]): MolaState {
        let choice: MolaState;
        if (Math.random() <= 0.2) {
            choice = states[Math.floor((Math.random() * states.length))];
        } else {
            choice = this.makeChoice(states);
        }
        this.choiceHistory.push(choice.getId() + 'm');
        return choice;
    }

    private makeChoice(states: MolaState[]): MolaState {
        let stateValue: number = this.minValue;
        let choice: MolaState = states[0];
        for (let i = 0; i < states.length; i++) {
            if (isWinningState(states[i], this)) {
                return states[i];
            }
            let currentValue = (this.knowledgeBase.get(states[i].getId().toString() + 'm') || 0)
                + this.getOpponentMinValue(states[i]) * 0.95;
            if (currentValue != null && currentValue >= stateValue) {
                stateValue = currentValue;
                choice = states[i];
            }
        }
        return choice;
    }

    getOpponentMinValue(state: MolaState) {
        let opponentStates = getAllowedMoves(state, this.opponent);
        let oppValue: number = 0;
        for (let oppState of opponentStates) {
            if (isWinningState(oppState, this.opponent)) {
                return this.minValue;
            }
            oppValue = Math.min(oppValue, (this.knowledgeBase.get(oppState.getId() + 'o') || 0));
        }
        return oppValue;
    }

    opponentStateInformation(state: MolaState): void {
        this.choiceHistory.push(state.getId() + 'o');
    }

    endGame(winner: boolean): void {
        this.propagateFeedback(winner ? this.maxValue : this.minValue);
    }

    propagateFeedback(reward: number) {
        let currentReward: number = reward;
        for (let i = this.choiceHistory.length - 1; i >= 0; i--) {
            if (this.knowledgeBase.has(this.choiceHistory[i])) {
                this.knowledgeBase.set(this.choiceHistory[i],
                    (this.knowledgeBase.get(this.choiceHistory[i]) || 0) / 2 + currentReward / 2)
            } else {
                this.knowledgeBase.set(this.choiceHistory[i], currentReward);
            }
            currentReward = currentReward / 2;
        }
    }

}

export class HumanPlayer extends MolaPlayer {

    userChoice: MolaState | null = null;

    opponentStateInformation(state: MolaState): void {
        // nothing to do
    }

    chooseMove(states: MolaState[]): MolaState | null {
        if (this.userChoice == null) {
            return null;
        }
        let copyChoice: MolaState = this.userChoice.copy();
        this.userChoice = null;
        if (states.map(state => state.getId()).includes(copyChoice.getId())) {
            return copyChoice;
        }             
        alert("Move is not allowed!");
        return null;
    }

    endGame(winner: boolean): void {
        // nothing to do
    }


}