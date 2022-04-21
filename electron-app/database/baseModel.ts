
export abstract class Model{
    abstract add(): void;
    abstract delete(): void;
}

export class ForeignKey{

    public chunk:string;
    public id:string;
}

export class Relationship{

    private _type: string;
    private _table: string;

    constructor(type: string, table: string){
        this.type = type;
        this.table = table;
    }

    public get type() : string {
        return this._type;
    }

    private set type(v : string) {
        if (v === 'toMany' || v === 'toOne') {
            this._type = v;
        }
        else{
            throw new Error("type can only be toMany or toOne");
        }
    }
    
    public get table() : string {
        return this._table;
    }

    private set table(v : string) {
        this.table = v;
    }
        
}