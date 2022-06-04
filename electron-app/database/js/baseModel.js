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
    function ForeignKey(toTable, toChunk, toId) {
        this.tableName = toTable;
        this.chunk = toChunk;
        this.id = toId;
    }
    return ForeignKey;
}());
exports.ForeignKey = ForeignKey;
var Relationship = /** @class */ (function () {
    function Relationship(type, table) {
        this.type = type;
        this.table = table;
    }
    return Relationship;
}());
exports.Relationship = Relationship;
//# sourceMappingURL=baseModel.js.map