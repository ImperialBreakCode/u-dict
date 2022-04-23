"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relationship = exports.ForeignKey = exports.Model = void 0;
var Model = /** @class */ (function () {
    function Model(tablename, idPrefix) {
        this.tableName = tablename;
        this.id = "".concat(idPrefix, "-").concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
    }
    return Model;
}());
exports.Model = Model;
var ForeignKey = /** @class */ (function () {
    function ForeignKey() {
    }
    return ForeignKey;
}());
exports.ForeignKey = ForeignKey;
var Relationship = /** @class */ (function () {
    function Relationship(type, table) {
        this.type = type;
        this.table = table;
    }
    Object.defineProperty(Relationship.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (v) {
            if (v === 'to-many' || v === 'to-one') {
                this._type = v;
            }
            else {
                throw new Error("type can only be toMany or toOne");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Relationship.prototype, "table", {
        get: function () {
            return this._table;
        },
        set: function (v) {
            this._table = v;
        },
        enumerable: false,
        configurable: true
    });
    return Relationship;
}());
exports.Relationship = Relationship;
//# sourceMappingURL=baseModel.js.map