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
            var propertyNames = ['Languages', 'Words/words1', 'Phrases'];
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
exports.appDatabase = appDatabase;
//# sourceMappingURL=database.js.map