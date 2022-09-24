import { ForeignKey, Model, Relationship } from "./baseModel";
import { tableNames } from "./tableNames";


export class Language extends Model{

    constructor(langName: string){
        super(tableNames.Language, 'lng');

        this.langName = langName;

        this.relWords = new Relationship('to-many', tableNames.Word);
        this.relPhrases = new Relationship('to-many', tableNames.Phrase);
    }

    public langName: string;

    // relationships
    public relWords: Relationship;
    public relPhrases: Relationship;

}


export class Phrase extends Model{

    constructor(phrase: string, meaning: string[], info?: string, gramGender?: gramGender){
        super(tableNames.Phrase, 'phr');

        this.phrase = phrase;
        this.meanings = meaning;
        this.info = info;
        this.gramGender = gramGender;
        
        this.foreignKeys = {};
        this.foreignKeys[tableNames.Language] = [];
    }

    public phrase: string;
    public meanings: string[];
    public gramGender?: gramGender;
    public info?: string;

    public readonly foreignKeys: {[key:string]: ForeignKey[]};
    
}


export class Word extends Model{

    constructor(word: string, meanings: string[], article?: string, plural?: string, info?: string, gramGender?: gramGender){
        super(tableNames.Word, 'wrd');

        this.word = word;
        this.meanings = meanings;
        this.article = article;
        this.plural = plural;
        this.info = info;
        this.gramGender = gramGender;

        this.foreignKeys = {};
        this.foreignKeys[tableNames.Language] = [];
    }
    
    public word: string;
    public meanings: string[];
    public article?: string;
    public plural?: string;
    public info?: string;
    public gramGender?: gramGender;
    public dictTable?: any;

    public readonly foreignKeys: {[key: string]: ForeignKey[]};

}