import { ForeignKey, Model, Relationship } from "./baseModel";

class Language extends Model{

    public readonly langId: string;
    public langName: string;

    // relationships
    public relWords: Relationship;
    public relPhrases: Relationship;

    add(): void {
        throw new Error("Method not implemented.");
    }
    delete(): void {
        throw new Error("Method not implemented.");
    }
}

class Phrase extends Model{
    add(): void {
        throw new Error("Method not implemented.");
    }
    delete(): void {
        throw new Error("Method not implemented.");
    }
}

class Word extends Model{
    
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