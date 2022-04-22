"use strict";
exports.__esModule = true;
var fs = require("fs");
var appDatabase = /** @class */ (function () {
    function appDatabase(dirPath) {
        this._dirname = dirPath;
        if (!fs.statSync(dirPath).isDirectory()) {
            fs.mkdirSync(dirPath);
            var initialData = [];
            var jsonInitData_1 = JSON.stringify(initialData);
            var propertyNames = Object.getOwnPropertyNames(this);
            propertyNames.forEach(function (name) {
                fs.writeFile("".concat(dirPath, "/").concat(name, ".json"), jsonInitData_1, function () {
                    console.log('created file ' + name);
                });
            });
        }
    }
    Object.defineProperty(appDatabase.prototype, "Languages", {
        get: function () {
            return this.getdata('Languages');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(appDatabase.prototype, "Words", {
        get: function () {
            return this.getdata('Words');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(appDatabase.prototype, "Phrases", {
        get: function () {
            return this.getdata('Phrases');
        },
        enumerable: false,
        configurable: true
    });
    appDatabase.prototype.getdata = function (fileName) {
        var jsonData = require("".concat(this._dirname, "/").concat(fileName, ".json"));
        return jsonData;
    };
    return appDatabase;
}());
