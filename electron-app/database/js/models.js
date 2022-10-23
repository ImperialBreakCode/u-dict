"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedPhrases = exports.ConnectedWords = exports.Group = exports.Word = exports.Phrase = exports.Language = void 0;
var baseModel_1 = require("./baseModel");
var tableNames_1 = require("./tableNames");
var Language = /** @class */ (function (_super) {
    __extends(Language, _super);
    function Language(langName) {
        var _this = _super.call(this, tableNames_1.tableNames.Language, 'lng') || this;
        _this.langName = langName;
        _this.relWords = new baseModel_1.Relationship('to-many', tableNames_1.tableNames.Word);
        _this.relPhrases = new baseModel_1.Relationship('to-many', tableNames_1.tableNames.Phrase);
        return _this;
    }
    return Language;
}(baseModel_1.Model));
exports.Language = Language;
var Phrase = /** @class */ (function (_super) {
    __extends(Phrase, _super);
    function Phrase(phrase, meaning, info, gramGender) {
        var _this = _super.call(this, tableNames_1.tableNames.Phrase, 'phr') || this;
        _this.phrase = phrase;
        _this.meanings = meaning;
        _this.info = info;
        _this.gramGender = gramGender;
        _this.foreignKeys = {};
        _this.foreignKeys[tableNames_1.tableNames.Language] = [];
        _this.foreignKeys[tableNames_1.tableNames.ConnectedPhrases] = [];
        return _this;
    }
    return Phrase;
}(baseModel_1.Model));
exports.Phrase = Phrase;
var Word = /** @class */ (function (_super) {
    __extends(Word, _super);
    function Word(word, meanings, article, plural, info, gramGender) {
        var _this = _super.call(this, tableNames_1.tableNames.Word, 'wrd') || this;
        _this.word = word;
        _this.meanings = meanings;
        _this.article = article;
        _this.plural = plural;
        _this.info = info;
        _this.gramGender = gramGender;
        _this.foreignKeys = {};
        _this.foreignKeys[tableNames_1.tableNames.Language] = [];
        _this.foreignKeys[tableNames_1.tableNames.Group] = [];
        _this.foreignKeys[tableNames_1.tableNames.ConnectedWords] = [];
        return _this;
    }
    return Word;
}(baseModel_1.Model));
exports.Word = Word;
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group(groupName) {
        var _this = _super.call(this, tableNames_1.tableNames.Group, 'grp') || this;
        _this.groupName = groupName;
        _this.relWords = new baseModel_1.Relationship('to-many', tableNames_1.tableNames.Word);
        return _this;
    }
    return Group;
}(baseModel_1.Model));
exports.Group = Group;
var ConnectedWords = /** @class */ (function (_super) {
    __extends(ConnectedWords, _super);
    function ConnectedWords(commonMeaning) {
        var _this = _super.call(this, tableNames_1.tableNames.ConnectedWords, 'cntwrds') || this;
        _this.commonMeaning = commonMeaning;
        _this.relWords = new baseModel_1.Relationship('to-many', tableNames_1.tableNames.Word);
        return _this;
    }
    return ConnectedWords;
}(baseModel_1.Model));
exports.ConnectedWords = ConnectedWords;
var ConnectedPhrases = /** @class */ (function (_super) {
    __extends(ConnectedPhrases, _super);
    function ConnectedPhrases(commonMeaning) {
        var _this = _super.call(this, tableNames_1.tableNames.ConnectedPhrases, 'cntphrs') || this;
        _this.commonMeaning = commonMeaning;
        _this.relPhrases = new baseModel_1.Relationship('to-many', tableNames_1.tableNames.Phrase);
        return _this;
    }
    return ConnectedPhrases;
}(baseModel_1.Model));
exports.ConnectedPhrases = ConnectedPhrases;
//# sourceMappingURL=models.js.map