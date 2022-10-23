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
        this.foreignKeys[tableNames.ConnectedPhrases] = [];
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
        this.foreignKeys[tableNames.Group] = [];
        this.foreignKeys[tableNames.ConnectedWords] = [];
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

export class Group extends Model{

    constructor(groupName: string){
        super(tableNames.Group, 'grp');

        this.groupName = groupName;
        this.relWords = new Relationship('to-many', tableNames.Word);
    }

    public groupName: string;
    public relWords: Relationship;

}

export class ConnectedWords extends Model{

    constructor(commonMeaning: string){
        super(tableNames.ConnectedWords, 'cntwrds')

        this.commonMeaning = commonMeaning;
        this.relWords = new Relationship('to-many', tableNames.Word);
    }

    public commonMeaning: string;
    public relWords: Relationship;
}

export class ConnectedPhrases extends Model{

    constructor(commonMeaning: string){
        super(tableNames.ConnectedPhrases, 'cntphrs')

        this.commonMeaning = commonMeaning;
        this.relPhrases = new Relationship('to-many', tableNames.Phrase);
    }

    public commonMeaning: string;

    public relPhrases: Relationship;
}