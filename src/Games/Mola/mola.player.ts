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

    minValue = -1000;
    maxValue = 1000;
    trainingMode: boolean = false;

    knowledgeBase: Map<string, number> = new Map();
    choiceHistory: Array<string> = new Array();

    chooseMove(states: MolaState[]): MolaState {
        if (this.trainingMode) {
            return this.trainingChoice(states);
        }
        return this.makeChoice(states);
    }

    trainingChoice(states: MolaState[]): MolaState {
        let choice: MolaState;
        if (Math.random() <= 0.2) {
            choice = states[Math.floor((Math.random() * states.length))];
        } else {
            choice = this.makeChoice(states);
        }
        this.choiceHistory.push(choice.calculateId() + 'm');
        return choice;
    }

    makeChoice(states: MolaState[]): MolaState {
        let stateValue: number = this.minValue;
        let choice: MolaState = states[0];
        for (let i = 0; i < states.length; i++) {
            if (isWinningState(states[i], this)) {
                if(!this.trainingMode) {alert("Found winning state " + states[i].positions); }
                return new MolaState(states[i].positions);
            }
            let currentValue = (this.knowledgeBase.get(states[i].calculateId().toString() + 'm') || 0)
                + this.getOpponentMinValue(states[i]) * 0.95;
            if (currentValue != null && currentValue >= stateValue) {
                stateValue = currentValue;
                choice = states[i];
                if(!this.trainingMode) { alert("New value " + stateValue + " for state " +  choice.positions); }
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
            oppValue = Math.min(oppValue, (this.knowledgeBase.get(oppState.calculateId() + 'o') || 0));
        }
        return oppValue;
    }

    opponentStateInformation(state: MolaState): void {
        this.choiceHistory.push(state.calculateId() + 'o');
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

        console.log("Knowledge Base " + this.getPlayerSymbol());
        this.knowledgeBase.forEach((key, value) => { console.log('State ' + value + ' Value ' + key) });

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
        let copyChoice = new MolaState(Object.assign([], this.userChoice.positions));
        this.userChoice = null;
        console.log("Possible moves " + states.map(state => state.calculateId()));
        console.log("Choice " + copyChoice.calculateId());
        if (states.map(state => state.calculateId()).includes(copyChoice.calculateId())) {
            return copyChoice;
        }             
        alert("Move is not allowed!");
        return null;
    }

    endGame(winner: boolean): void {
        // nothing to do
    }


}