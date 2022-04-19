import { Model, Relationship } from "./baseModel";

class Language extends Model{

    public readonly langId: string;
    public langName: string;

    public relwords: Relationship;

    add(): void {
        throw new Error("Method not implemented.");
    }
    remove(): void {
        throw new Error("Method not implemented.");
    }

}