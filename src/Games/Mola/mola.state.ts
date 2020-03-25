export default class MolaState {

    id: number;

    constructor(public positions: number[]) {
        this.id = this.calculateId();
    }

    calculateId(): number {
        let tempId: number = 0;
        for(let i=0; i<this.positions.length; i++) {
            tempId += this.positions[i]*Math.pow(10, i);
        }
        return tempId;
    }

}