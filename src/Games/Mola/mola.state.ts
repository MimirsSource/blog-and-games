export default class MolaState {

    private static readonly initialState: MolaState = new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

    private readonly id: number;

    private constructor(private readonly positions: number[]) {
        if(this.positions.length != 9) {
            throw new Error('Illegal state description with number of positions '+ this.positions.length);
        }
        this.id = this.calculateId();
    }

    private calculateId(): number {
        let tempId: number = 0;
        for(let i=0; i<this.positions.length; i++) {
            tempId += this.positions[i]*Math.pow(10, i);
        }
        return tempId;
    }

    public getId(): number {
        return this.id;
    }

    public getPositions(): number[] {
        return [ ...this.positions ];
    }

    public putStone (symbol: number, position: number): MolaState {
        let newPositions: number[] = this.getPositions();
        newPositions[position] = symbol;
        return new MolaState(newPositions);
    }

    public moveStone(fromPosition: number, toPosition: number) {
        let newPositions: number[] = this.getPositions();
        newPositions[toPosition] = newPositions[fromPosition];
        newPositions[fromPosition] = 0;
        return new MolaState(newPositions);
    }

    public copy(): MolaState {
        return new MolaState(this.getPositions());
    }

    public static getInitialState(): MolaState {
        return MolaState.initialState;
    }

}