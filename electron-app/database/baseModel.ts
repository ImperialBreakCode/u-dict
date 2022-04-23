import { tableNames } from "./tableNames";

export abstract class Model{

    constructor(tablename: tableNames, idPrefix: string){
        this.tableName = tablename;
        this.id = `${idPrefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    public readonly tableName: tableNames;
    public readonly id: string;
}

export class ForeignKey{

    public tableName: tableNames;
    public chunk:string;
    public id:string;

}

export class Relationship{

    private _type: string;
    private _table: tableNames;

    constructor(type: string, table: tableNames){
        this.type = type;
        this.table = table;
    }

    public get type() : string {
        return this._type;
    }

    private set type(v : string) {
        if (v === 'to-many' || v === 'to-one') {
            this._type = v;
        }
        else{
            throw new Error("type can only be toMany or toOne");
        }
    }
    
    public get table() : tableNames {
        return this._table;
    }

    private set table(v : tableNames) {
        this._table = v;
    }
        
}