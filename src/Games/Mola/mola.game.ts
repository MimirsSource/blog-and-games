import { Game, State, Player } from "../TwoPlayer/game";
import MolaState from "./mola.state";
import { Rule, SetRule, MoveRule, JumpRule } from "./mola.rules";

type GameState = {running: boolean, currentPlayer: MolaPlayer, currentState: MolaState};

const rules: Rule[] = [new SetRule(), new MoveRule(), new JumpRule()];

export class MolaGame {

    playerOne: MolaPlayer = new AIPlayer(1);
    playerTwo: MolaPlayer = new AIPlayer(2);
    // initialState: MolaState = new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    training: boolean = false;
    trainingGamesRemaining: number = 0;
    intervalId: any;

    gameState: GameState = {running: false, currentPlayer: this.playerOne, currentState: new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0])};

    runGame(uiStateHandler: (gameState: MolaState) => void) {
        uiStateHandler(this.gameState.currentState);
        console.log("Started game");
        this.gameState.running = true;
        this.playerOne.setOpponent(this.playerTwo);
        this.playerTwo.setOpponent(this.playerOne);
        this.intervalId = setInterval(() => this.gameIteration(uiStateHandler), this.training ? 10 : 2000);
    }

    gameIteration(uiStateHandler: (gameState: MolaState) => void) {
        if(this.gameState.running === true) {
            console.log("Do move!");
            this.doMove(this.gameState.currentPlayer, uiStateHandler);
            this.gameState.currentPlayer = this.gameState.currentPlayer.opponent;
        } else {
            console.log("Finish!");
            clearInterval(this.intervalId);
            if(this.trainingGamesRemaining-1 > 0) {
                this.gameState = {running: false, currentPlayer: this.playerOne, currentState: new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0])};
                this.trainingGamesRemaining--;
                this.runGame(uiStateHandler); // TODO cleanup
            } else {
                this.reset();
            }
        }
    }

    reset() {
        this.training = false;
        this.trainingGamesRemaining = 0;
        this.gameState = {running: false, currentPlayer: this.playerOne, currentState: new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0])};
    }

    trainAI(uiStateHandler: (gameState: MolaState) => void, games: number) {
        this.trainingGamesRemaining = games;
        this.training = true;
        this.runGame(uiStateHandler);
    }

    static getAllowedMoves(state: MolaState, player: MolaPlayer): MolaState[] {
        let result: MolaState[] = new Array();
        for (let i: number = 0; i < rules.length; i++) {
            result = result.concat(rules[i].resultingStates(state, player));
            console.log(result);
        }
        return result;
    }

    doMove(player: MolaPlayer, uiStateHandler: (gameState: MolaState) => void): void {
        this.gameState.currentState = player.chooseMove(MolaGame.getAllowedMoves(this.gameState.currentState, player));
        uiStateHandler(this.gameState.currentState);
        if (MolaGame.isWinningState(this.gameState.currentState, player)) {
            this.gameState.running = false;
            if (this.training) {
                player.endGame(true);
                player.opponent.endGame(false);
            }
            if(!this.training) { alert("Player " + player.getPlayerSymbol() + " wins!"); }
        }
    }

    static isWinningState(state: MolaState, player: MolaPlayer) {
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

    opponent!: MolaPlayer;

    constructor(private playerSymbol: number) {}

    setOpponent(player: MolaPlayer) {
        this.opponent = player;
    }

    getPlayerSymbol(): number {
        return this.playerSymbol;
    }

    abstract opponentStateInformation(state: MolaState): void;

    abstract chooseMove(states: MolaState[]): MolaState;

    abstract endGame(winner: boolean): void;

}

class AIPlayer extends MolaPlayer {

    minValue = -1000;
    maxValue = 1000;
    trainingMode: boolean = true;

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
        this.choiceHistory.push(choice.id+'m');
        return choice;
    }

    makeChoice(states: MolaState[]): MolaState {
        let stateValue: number = this.minValue;
        let choice: MolaState = states[0];
        for (let i = 0; i < states.length; i++) {
            if(MolaGame.isWinningState(states[i], this)) {
                return states[i];
            }
            let currentValue = (this.knowledgeBase.get(states[i].id.toString() + 'm') || 0) - this.getOpponentMaxValue(states[i])*0.95;
            if (currentValue != null && currentValue >= stateValue) {
                stateValue = currentValue;
                choice = states[i];
            }
        }
        return choice;
    }

    getOpponentMaxValue(state: MolaState) {
        let opponentStates = MolaGame.getAllowedMoves(state, this.opponent);
        let oppValue: number = 0;
        for(let oppState of opponentStates) {
            oppValue = Math.max(oppValue, (this.knowledgeBase.get(oppState.id + 'o') || 0));
        }
        return oppValue;
    }

    opponentStateInformation(state: MolaState): void {
        this.choiceHistory.push(state.id+'o');
    }

    endGame(winner: boolean): void {
        this.propagateFeedback(winner ? this.maxValue : this.minValue);
    }

    propagateFeedback(reward: number) {
        let currentReward: number = reward;
        for (let i = this.choiceHistory.length-1; i >= 0; i--) {
            if (this.knowledgeBase.has(this.choiceHistory[i])) {
                this.knowledgeBase.set(this.choiceHistory[i],
                    (this.knowledgeBase.get(this.choiceHistory[i]) || 0) / 2 + currentReward / 2)
            } else {
                this.knowledgeBase.set(this.choiceHistory[i], currentReward);
            }
            currentReward = currentReward / 2;
        }

        console.log("Knowledge Base " + this.getPlayerSymbol());
        this.knowledgeBase.forEach((key, value) => { console.log('State '+ value + ' Value ' + key)});
        
    }

}
