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
            var propertyNames = [tableNames_1.tableNames.Language, tableNames_1.tableNames.Word, tableNames_1.tableNames.Phrase, tableNames_1.tableNames.Group, tableNames_1.tableNames.ConnectedWords, tableNames_1.tableNames.ConnectedPhrases];
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
    Object.defineProperty(appDatabase.prototype, "Groups", {
        get: function () {
            return this.getdata(tableNames_1.tableNames.Group);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(appDatabase.prototype, "ConnectedWords", {
        get: function () {
            return this.getdata(tableNames_1.tableNames.ConnectedWords);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(appDatabase.prototype, "ConnectedPhrases", {
        get: function () {
            return this.getdata(tableNames_1.tableNames.ConnectedPhrases);
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
    appDatabase.prototype.getFileName = function (chunk, nameTable) {
        return "".concat(this._dirname, "/").concat(nameTable, "/").concat(nameTable).concat(chunk, ".json");
    };
    appDatabase.prototype.getChunk = function (id, table) {
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(table)).length;
        for (var i = 0; i < filesCount; i++) {
            var fileName = this.getFileName(i, table);
            var json = this.getJson(fileName);
            for (var e = 0; e < json.length; e++) {
                if (json[e].id == id) {
                    return i;
                }
            }
        }
        return false;
    };
    appDatabase.prototype.save = function (singleData) {
        var inTable = singleData.tableName;
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(inTable)).length;
        for (var i = 0; i < filesCount; i++) {
            var fileName_1 = this.getFileName(i, inTable);
            var jsonData = this.getJson(fileName_1);
            if (jsonData.length < 1000) {
                jsonData.push(singleData);
                fs.writeFileSync(fileName_1, JSON.stringify(jsonData));
                return i;
            }
        }
        var fileName = this.getFileName(filesCount, inTable);
        var saveData = JSON.stringify([singleData]);
        fs.writeFile(fileName, saveData, function (err) {
            if (err) {
                console.log(err.message);
                return false;
            }
        });
        return filesCount;
    };
    appDatabase.prototype.deleteChildren = function (parent, rels) {
        var _this = this;
        var id = parent.id, tableName = parent.tableName;
        rels.forEach(function (rel) {
            var filesCount = fs.readdirSync("".concat(_this._dirname, "/").concat(rel.table)).length;
            var _loop_1 = function (i) {
                var fileName = _this.getFileName(i, rel.table);
                var json = _this.getJson(fileName);
                var _loop_2 = function (e) {
                    var keys = json[e].foreignKeys[tableName];
                    keys.forEach(function (key) {
                        if (key.id == id) {
                            json.splice(e, 1);
                        }
                    });
                };
                for (var e = 0; e < json.length; e++) {
                    _loop_2(e);
                }
                fs.writeFileSync(fileName, JSON.stringify(json));
            };
            for (var i = 0; i < filesCount; i++) {
                _loop_1(i);
            }
        });
    };
    appDatabase.prototype.delete = function (itemId, inTable, cascade, rels) {
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(inTable)).length;
        for (var i = 0; i < filesCount; i++) {
            var fileName = this.getFileName(i, inTable);
            var jsonData = this.getJson(fileName);
            for (var i_1 = 0; i_1 < jsonData.length; i_1++) {
                if (jsonData[i_1].id == itemId) {
                    if (cascade) {
                        this.deleteChildren(jsonData[i_1], rels);
                    }
                    jsonData.splice(i_1, 1);
                    fs.writeFileSync(fileName, JSON.stringify(jsonData));
                    return;
                }
            }
        }
    };
    appDatabase.prototype.connectExisting = function (parent, parentRel, childId) {
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(parentRel.table)).length;
        var parentChunk = this.getChunk(parent.id, parent.tableName);
        for (var i = 0; i < filesCount; i++) {
            var fileName = this.getFileName(i, parentRel.table);
            var json = this.getJson(fileName);
            for (var e = 0; e < json.length; e++) {
                if (json[e].id == childId) {
                    if (parentChunk !== false) {
                        var key = new baseModel_1.ForeignKey(parent.tableName, parentChunk, parent.id);
                        json[e].foreignKeys[parent.tableName].push(key);
                        fs.writeFileSync(fileName, JSON.stringify(json));
                        return;
                    }
                }
            }
        }
    };
    appDatabase.prototype.disconnectExisting = function (parent, parentRel, childId) {
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(parentRel.table)).length;
        var _loop_3 = function (i) {
            var fileName = this_1.getFileName(i, parentRel.table);
            var jsonChildrenData = this_1.getJson(fileName);
            var _loop_4 = function (n) {
                if (jsonChildrenData[n].id === childId) {
                    var keys_1 = jsonChildrenData[n].foreignKeys[parent.tableName];
                    keys_1.forEach(function (key, index) {
                        if (key.id === parent.id) {
                            keys_1.splice(index, 1);
                            jsonChildrenData[n].foreignKeys[parent.tableName] = keys_1;
                            fs.writeFileSync(fileName, JSON.stringify(jsonChildrenData));
                            return;
                        }
                    });
                }
            };
            for (var n = 0; n < jsonChildrenData.length; n++) {
                _loop_4(n);
            }
        };
        var this_1 = this;
        for (var i = 0; i < filesCount; i++) {
            _loop_3(i);
        }
    };
    appDatabase.prototype.removeChildren = function (parentId, parentTable, childrenTable) {
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(childrenTable)).length;
        for (var i = 0; i < filesCount; i++) {
            var fileName = this.getFileName(i, childrenTable);
            var jsonChildrenData = this.getJson(fileName);
            var _loop_5 = function (n) {
                var keys = jsonChildrenData[n].foreignKeys[parentTable];
                keys.forEach(function (key, index) {
                    if (key.id === parentId) {
                        keys.splice(index, 1);
                    }
                });
                jsonChildrenData[n].foreignKeys[parentTable] = keys;
            };
            for (var n = 0; n < jsonChildrenData.length; n++) {
                _loop_5(n);
            }
            fs.writeFileSync(fileName, JSON.stringify(jsonChildrenData));
        }
    };
    appDatabase.prototype.update = function (updatedData) {
        ;
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(updatedData.tableName)).length;
        for (var i = 0; i < filesCount; i++) {
            var fileName = this.getFileName(i, updatedData.tableName);
            var jsonData = this.getJson(fileName);
            for (var i_2 = 0; i_2 < jsonData.length; i_2++) {
                if (jsonData[i_2].id == updatedData.id) {
                    jsonData[i_2] = updatedData;
                    fs.writeFileSync(fileName, JSON.stringify(jsonData));
                    return;
                }
            }
        }
    };
    appDatabase.prototype.appendAndSave = function (parent, child) {
        var chunk = this.save(parent);
        if (chunk !== false) {
            var key = new baseModel_1.ForeignKey(parent.tableName, chunk, parent.id);
            child.foreignKeys[parent.tableName].push(key);
            this.save(child);
        }
        else {
            console.error('parrent not saved');
        }
    };
    appDatabase.prototype.appendAndSaveChild = function (parentId, parentTable, child) {
        var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(parentTable)).length;
        for (var i = 0; i < filesCount; i++) {
            var fileName = this.getFileName(i, parentTable);
            var jsonParentData = this.getJson(fileName);
            for (var n = 0; n < jsonParentData.length; n++) {
                if (jsonParentData[n].id == parentId) {
                    var key = new baseModel_1.ForeignKey(parentTable, i, parentId);
                    child.foreignKeys[parentTable].push(key);
                    this.save(child);
                    break;
                }
            }
        }
    };
    appDatabase.prototype.getChildren = function (parent, relation) {
        if (relation.type == 'to-many') {
            var children = [];
            var filesCount = fs.readdirSync("".concat(this._dirname, "/").concat(relation.table)).length;
            // loop over files
            for (var i = 0; i < filesCount; i++) {
                var fileName = this.getFileName(i, relation.table);
                var dataFromFile = this.getJson(fileName);
                // loop over the items in a file
                for (var n = 0; n < dataFromFile.length; n++) {
                    var arrKeys = dataFromFile[n].foreignKeys[parent.tableName];
                    // loop over foreignKeys in a item
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
    appDatabase.prototype.getParent = function (key) {
        var chunk = key.chunk, id = key.id, tableName = key.tableName;
        var fileName = this.getFileName(chunk, tableName);
        var jsonData = this.getJson(fileName);
        for (var i = 0; i < jsonData.length; i++) {
            if (jsonData[i].id == id) {
                return jsonData[i];
            }
        }
    };
    return appDatabase;
}());
exports.appDatabase = appDatabase;
//# sourceMappingURL=database.js.map