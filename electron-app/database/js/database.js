"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDatabase = void 0;
var fs = require("fs");
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
                fs.writeFile("".concat(dirPath, "/").concat(name, "/").concat(name, "0.json"), jsonInitData_1, function () {
                    console.log('created file ' + name);
                });
            });
        }
    }
    Object.defineProperty(appDatabase.prototype, "Languages", {
        get: function () {
            return this.getdata(tableNames.Language);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(appDatabase.prototype, "Words", {
        get: function () {
            return this.getdata(tableNames.Word);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(appDatabase.prototype, "Phrases", {
        get: function () {
            return this.getdata(tableNames.Phrase);
        },
        enumerable: false,
        configurable: true
    });
    appDatabase.prototype.getdata = function (fileName) {
        var jsonData = require("".concat(this._dirname, "/").concat(fileName, "/").concat(fileName, "0.json"));
        return jsonData;
    };
    appDatabase.prototype.save = function (singleData, inTable) {
        var jsonData = this.getdata(inTable);
        jsonData.push(singleData);
        fs.writeFileSync("".concat(this._dirname, "/").concat(inTable, "/").concat(inTable, "0.json"), jsonData);
    };
    return appDatabase;
}());
exports.appDatabase = appDatabase;
//# sourceMappingURL=database.js.map