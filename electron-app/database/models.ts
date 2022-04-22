import { ForeignKey, Model, Relationship } from "./baseModel";

export class Language extends Model{

    public readonly langId: string;
    public langName: string;

    // relationships
    public relWords: Relationship;
    public relPhrases: Relationship;

    // items from relationships
    public get words() : string {
        // get words
        return null;
    }
    

    add(): void {
        throw new Error("Method not implemented.");
    }
    delete(): void {
        throw new Error("Method not implemented.");
    }
}

export class Phrase extends Model{
    add(): void {
        throw new Error("Method not implemented.");
    }
    delete(): void {
        throw new Error("Method not implemented.");
    }
}

export class Word extends Model{
    
    public readonly wordId: string;
    public article?: string;
    public word: string;
    public plural?: string;
    public meanings: string[];
    public info?: string;
    public gramGender?: string;
    public groups?: string[];
    public maps?: any[];

    public language?: ForeignKey;

    add(): void {
        throw new Error("Method not implemented.");
    }
    delete(): void {
        throw new Error("Method not implemented.");
    }

}