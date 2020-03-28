import MolaState from "./mola.state";
import { getAllowedMoves, isWinningState } from "./mola.rules";
import { MolaPlayer, AIPlayer, HumanPlayer } from "./mola.player";

type GameState = {running: boolean, currentPlayer: MolaPlayer, currentState: MolaState};

const aiPlayerOne = new AIPlayer(1);
const aiPlayerTwo = new AIPlayer(2);
const humanPlayerOne = new HumanPlayer(1);
const humanPlayerTwo = new HumanPlayer(2);

export class MolaGame {

    training: boolean = false;
    trainingGamesRemaining: number = 0;
    intervalId: any;
    playerOneAI: boolean = false;
    playerTwoAI: boolean = false;

    gameState: GameState = {running: false, currentPlayer: this.playerSetup(), currentState: new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0])} ;

    runGame(uiStateHandler: (gameState: MolaState) => void) {
        this.gameState = {running: true, currentPlayer: this.playerSetup(), currentState: new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0])};
        if(this.gameState.currentPlayer instanceof AIPlayer) {
            (this.gameState.currentPlayer as AIPlayer).trainingMode = this.training;
        }
        if(this.gameState.currentPlayer.opponent instanceof AIPlayer) {
            (this.gameState.currentPlayer.opponent as AIPlayer).trainingMode = this.training;
        }
        uiStateHandler(this.gameState.currentState);
        console.log("Started game");
        this.intervalId = setInterval(() => this.gameIteration(uiStateHandler), this.training ? 10 : 2000);
    }

    gameIteration(uiStateHandler: (gameState: MolaState) => void) {
        if(this.gameState.running === true) {
            console.log("Do move!");
            if(this.doMove(this.gameState.currentPlayer, uiStateHandler)) {
                this.gameState.currentPlayer = this.gameState.currentPlayer.opponent;
            }
        } else {
            console.log("Finish!");
            clearInterval(this.intervalId);
            if(this.trainingGamesRemaining-1 > 0) {
                this.gameState.running = false;
                this.gameState.currentState = new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
                this.trainingGamesRemaining--;
                this.runGame(uiStateHandler); // TODO cleanup
            } else {
                this.reset();
            }
        }
    }

    playerSetup(): MolaPlayer {
        let playerOne = this.playerOneAI ? aiPlayerOne : humanPlayerOne;
        let playerTwo = this.playerTwoAI ? aiPlayerTwo : humanPlayerTwo;
        playerOne.setOpponent(playerTwo);
        playerTwo.setOpponent(playerOne);
        return playerOne;
    }

    setHumanPlayerOne(human: boolean) {
        this.playerOneAI = !human;
    }

    setHumanPlayerTwo(human: boolean) {
        this.playerTwoAI = !human;
    }

    reset() {
        this.training = false;
        this.trainingGamesRemaining = 0;
        this.gameState.currentState = new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    trainAI(uiStateHandler: (gameState: MolaState) => void, games: number) {
        this.trainingGamesRemaining = games;
        this.training = true;
        this.runGame(uiStateHandler);
    }

    doMove(player: MolaPlayer, uiStateHandler: (gameState: MolaState) => void): boolean {
        let stateChoice = player.chooseMove(getAllowedMoves(this.gameState.currentState, player));
        if(stateChoice === null) {
            return false;
        }
        this.gameState.currentState = stateChoice;
        uiStateHandler(this.gameState.currentState);
        if (isWinningState(this.gameState.currentState, player)) {
            this.gameState.running = false;
            if (this.training) {
                player.endGame(true);
                player.opponent.endGame(false);
            }
            if(!this.training) { alert("Player " + player.getPlayerSymbol() + " wins!"); }
        }
        return true;
    }

    getCurrentPlayer(): MolaPlayer {
        return this.gameState.currentPlayer;
    }

}

