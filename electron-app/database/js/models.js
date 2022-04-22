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
var Language = /** @class */ (function (_super) {
    __extends(Language, _super);
    function Language() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Language.prototype, "words", {
        // items from relationships
        get: function () {
            // get words
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Language.prototype.add = function () {
        throw new Error("Method not implemented.");
    };
    Language.prototype.delete = function () {
        throw new Error("Method not implemented.");
    };
    return Language;
}(baseModel_1.Model));
exports.Language = Language;
var Phrase = /** @class */ (function (_super) {
    __extends(Phrase, _super);
    function Phrase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Phrase.prototype.add = function () {
        throw new Error("Method not implemented.");
    };
    Phrase.prototype.delete = function () {
        throw new Error("Method not implemented.");
    };
    return Phrase;
}(baseModel_1.Model));
exports.Phrase = Phrase;
var Word = /** @class */ (function (_super) {
    __extends(Word, _super);
    function Word() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Word.prototype.add = function () {
        throw new Error("Method not implemented.");
    };
    Word.prototype.delete = function () {
        throw new Error("Method not implemented.");
    };
    return Word;
}(baseModel_1.Model));
exports.Word = Word;
//# sourceMappingURL=models.js.map