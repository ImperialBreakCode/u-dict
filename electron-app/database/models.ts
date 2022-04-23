import { ForeignKey, Model, Relationship } from "./baseModel";


export class Language extends Model{

    constructor(langName: string){
        super(tableNames.Language);

        this.langId = `$lng-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        this.langName = langName;

        this.relWords = new Relationship('to-many', tableNames.Word);
        this.relPhrases = new Relationship('to-many', tableNames.Phrase);
    }

    public readonly langId: string;
    public langName: string;

    // relationships
    public relWords: Relationship;
    public relPhrases: Relationship;

}


export class Phrase extends Model{

    constructor(phrase: string, meaning: string){
        super(tableNames.Phrase);
        this.phraseId = `phr-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        this.phrase = phrase;
        this.meaning = meaning;

        this.foreignKeys = {};
        this.foreignKeys[tableNames.Language] = [];
    }

    public readonly phraseId: string
    public phrase: string;
    public meaning: string;

    public readonly foreignKeys: {[key:string]: ForeignKey[]};
    
}


export class Word extends Model{

    constructor(word: string, meanings: string[], article?: string, plural?: string, info?: string, gramGender?: string, groups?: string[]){
        super(tableNames.Word);

        this.wordId = `wrd-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        this.word = word;
        this.meanings = meanings;
        this.article = article;
        this.plural = plural;
        this.info = info;
        this.gramGender = gramGender;
        this.groups = groups;

        this.foreignKeys = {};
        this.foreignKeys[tableNames.Language] = [];
    }
    
    public readonly wordId: string;
    public word: string;
    public meanings: string[];
    public article?: string;
    public plural?: string;
    public info?: string;
    public gramGender?: string;
    public groups?: string[];
    public dictTable?: any;

    public readonly foreignKeys: {[key: string]: ForeignKey[]};

}