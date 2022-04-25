"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDatabase = void 0;
var fs = require("fs");
var baseModel_1 = require("./baseModel");
var tableNames_1 = require("./tableNames");
var appDatabase = /** @class */ (function () {
    function appDatabase(dirPath) {
        this._dirname = dirPath;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
            var initialData = [];
            var jsonInitData_1 = JSON.stringify(initialData);
            var propertyNames = ['Languages', 'Words', 'Phrases'];
            propertyNames.forEach(function (name) {
                fs.mkdirSync("".concat(dirPath, "/").concat(name));
                fs.writeFile("".concat(dirPath, "/").concat(name, "/").concat(name, "0.json"), jsonInitData_1, function (err) {
                    if (err) {
                        console.log(err.message);
                    }
                    else {
                        console.log('created file ' + name);
                    }
                });
            });
        }
    }
    Object.defineProperty(appDatabase.prototype, "Languages", {
        get: function () {
            return this.getdata(tableNames_1.tableNames.Language);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(appDatabase.prototype, "Words", {
        get: function () {
            return this.getdata(tableNames_1.tableNames.Word);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(appDatabase.prototype, "Phrases", {
        get: function () {
            return this.getdata(tableNames_1.tableNames.Phrase);
        },
        enumerable: false,
        configurable: true
    });
    appDatabase.prototype.getJson = function (fileName) {
        var fileData = fs.readFileSync(fileName, 'utf-8');
        var jsonFileData = [];
        try {
            jsonFileData = JSON.parse(fileData);
        }
        catch (error) {
            // fix this!!
            console.log(error);
        }
        return jsonFileData;
    };
    appDatabase.prototype.getdata = function (fileName) {
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(fileName)).length;
        var jsonData = [];
        for (var i = 0; i < filesCount; i++) {
            var filePath = "".concat(this._dirname, "/").concat(fileName, "/").concat(fileName).concat(i, ".json");
            var jsonFileData = this.getJson(filePath);
            jsonData = __spreadArray(__spreadArray([], jsonData, true), jsonFileData, true);
        }
        return jsonData;
    };
    appDatabase.prototype.save = function (singleData, inTable) {
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(inTable)).length;
        for (var i = 0; i < filesCount; i++) {
            var fileName_1 = "".concat(this._dirname, "/").concat(inTable, "/").concat(inTable).concat(i, ".json");
            var jsonData = this.getJson(fileName_1);
            if (jsonData.length < 100) {
                jsonData.push(singleData);
                fs.writeFileSync(fileName_1, JSON.stringify(jsonData));
                return i;
            }
        }
        var fileName = "".concat(this._dirname, "/").concat(inTable, "/").concat(inTable).concat(filesCount, ".json");
        var saveData = JSON.stringify([singleData]);
        fs.writeFile(fileName, saveData, function (err) {
            if (err) {
                console.log(err.message);
                return false;
            }
        });
        return filesCount;
    };
    appDatabase.prototype.delete = function (itemId, inTable) {
        var jsonData = this.getdata(inTable);
        for (var i = 0; i < jsonData.length; i++) {
            if (jsonData[i].id == itemId) {
                jsonData.splice(i);
                break;
                // add for cascade
            }
        }
    };
    appDatabase.prototype.appendAndSave = function (parent, child) {
        var chunk = this.save(parent, parent.tableName);
        if (chunk !== false) {
            var key = new baseModel_1.ForeignKey(parent.tableName, chunk, parent.id);
            child.foreignKeys[parent.tableName].push(key);
            this.save(child, child.tableName);
        }
        else {
            console.error('parrent not saved');
        }
    };
    appDatabase.prototype.appendAndSaveChild = function (parentId, parentTable, child) {
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(parentTable)).length;
        for (var i = 0; i < filesCount; i++) {
            var fileName = "".concat(this._dirname, "/").concat(parentTable, "/").concat(parentTable).concat(i, ".json");
            var jsonParentData = this.getJson(fileName);
            for (var n = 0; n < jsonParentData.length; n++) {
                if (jsonParentData[n].id == parentId) {
                    var key = new baseModel_1.ForeignKey(parentTable, i, parentId);
                    child.foreignKeys[parentTable].push(key);
                    this.save(child, child.tableName);
                    break;
                }
            }
        }
    };
    appDatabase.prototype.getChildren = function (parent, relation) {
        if (relation.type == 'to-many') {
            var children = [];
            var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(relation.table)).length;
            for (var i = 0; i < filesCount; i++) {
                var fileName = "".concat(this._dirname, "/").concat(relation.table, "/").concat(relation.table).concat(i, ".json");
                var dataFromFile = this.getJson(fileName);
                for (var n = 0; n < dataFromFile.length; n++) {
                    var arrKeys = dataFromFile[n].foreignKeys[parent.tableName];
                    for (var j = 0; j < arrKeys.length; j++) {
                        if (arrKeys[j].id == parent.id) {
                            children.push(dataFromFile[n]);
                        }
                    }
                }
            }
            return children;
        }
        return [];
    };
    return appDatabase;
}());
exports.appDatabase = appDatabase;
//# sourceMappingURL=database.js.map