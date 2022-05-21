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

    constructor(toTable: tableNames, toChunk: number, toId: string){
        this.tableName = toTable;
        this.chunk = toChunk;
        this.id = toId;
    }

    public tableName: tableNames;
    public chunk:number;
    public id:string;

}

export class Relationship{

    public type: string;
    public table: tableNames;
    
    constructor(type: string, table: tableNames){
        this.type = type;
        this.table = table;
    }
        
}