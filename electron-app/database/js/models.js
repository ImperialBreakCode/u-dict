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
exports.Word = exports.Phrase = exports.Language = void 0;
var baseModel_1 = require("./baseModel");
var tableNames_1 = require("./tableNames");
var Language = /** @class */ (function (_super) {
    __extends(Language, _super);
    function Language(langName) {
        var _this = _super.call(this, tableNames_1.tableNames.Language) || this;
        _this.langId = "$lng-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
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
    function Phrase(phrase, meaning) {
        var _this = _super.call(this, tableNames_1.tableNames.Phrase) || this;
        _this.phraseId = "phr-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
        _this.phrase = phrase;
        _this.meaning = meaning;
        _this.foreignKeys = {};
        _this.foreignKeys[tableNames_1.tableNames.Language] = [];
        return _this;
    }
    return Phrase;
}(baseModel_1.Model));
exports.Phrase = Phrase;
var Word = /** @class */ (function (_super) {
    __extends(Word, _super);
    function Word(word, meanings, article, plural, info, gramGender, groups) {
        var _this = _super.call(this, tableNames_1.tableNames.Word) || this;
        _this.wordId = "wrd-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
        _this.word = word;
        _this.meanings = meanings;
        _this.article = article;
        _this.plural = plural;
        _this.info = info;
        _this.gramGender = gramGender;
        _this.groups = groups;
        _this.foreignKeys = {};
        _this.foreignKeys[tableNames_1.tableNames.Language] = [];
        return _this;
    }
    return Word;
}(baseModel_1.Model));
exports.Word = Word;
//# sourceMappingURL=models.js.map