import * as fs from 'fs';
import { ForeignKey, Model, Relationship } from './baseModel';
import { Group, Language, Phrase, Word } from './models';
import { tableNames } from './tableNames';


export class appDatabase {

    private _dirname: string;

    constructor(dirPath: string) {
        this._dirname = dirPath;

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);

            let initialData: any[] = [];
            let jsonInitData = JSON.stringify(initialData);
            const propertyNames: string[] = [tableNames.Language, tableNames.Word, tableNames.Phrase, tableNames.Group];
            propertyNames.forEach(name => {
                fs.mkdirSync(`${dirPath}/${name}`);
                fs.writeFile(`${dirPath}/${name}/${name}0.json`, jsonInitData, (err) => {
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log('created file ' + name);
                    }
                });
            });
        }
    }

    public get Languages(): Language[] {
        return this.getdata(tableNames.Language);
    }

    public get Words(): Word[] {
        return this.getdata(tableNames.Word);
    }

    public get Phrases(): Phrase[] {
        return this.getdata(tableNames.Phrase);
    }

    public get Groups(): Group[] {
        return this.getdata(tableNames.Group);
    }

    private getJson(fileName: string): any {

        const fileData = fs.readFileSync(fileName, 'utf-8');

        let jsonFileData: any = [];
        try {
            jsonFileData = JSON.parse(fileData);
        } catch (error) {
            // fix this!!
            console.log(error);
        }

        return jsonFileData;
    }

    private getdata(fileName: string): any {

        let filesCount = fs.readdirSync(`${this._dirname}/${fileName}`).length;
        let jsonData: any = [];

        for (let i = 0; i < filesCount; i++) {

            const filePath = `${this._dirname}/${fileName}/${fileName}${i}.json`;
            const jsonFileData = this.getJson(filePath);

            jsonData = [...jsonData, ...jsonFileData];
        }

        return jsonData;
    }

    private getFileName(chunk: any, nameTable: tableNames): string {
        return `${this._dirname}/${nameTable}/${nameTable}${chunk}.json`;
    }

    private getChunk(id: string, table: tableNames): number | boolean{
        let filesCount = fs.readdirSync(`${this._dirname}/${table}`).length;

        for (let i = 0; i < filesCount; i++) {
            const fileName = this.getFileName(i, table);
            const json = this.getJson(fileName);

            for (let e = 0; e < json.length; e++) {

                if (json[e].id == id) {

                    return i;

                }
            }
        }

        return false;
    }

    public save(singleData: any): boolean | number {

        const inTable = singleData.tableName;

        let filesCount = fs.readdirSync(`${this._dirname}/${inTable}`).length;

        for (let i = 0; i < filesCount; i++) {

            const fileName = this.getFileName(i, inTable);
            let jsonData = this.getJson(fileName);

            if (jsonData.length < 1000) {
                jsonData.push(singleData);
                fs.writeFileSync(fileName, JSON.stringify(jsonData));

                return i;
            }
        }

        const fileName = this.getFileName(filesCount, inTable);
        const saveData = JSON.stringify([singleData]);
        fs.writeFile(fileName, saveData, (err) => {
            if (err) {
                console.log(err.message);
                return false;
            }
        });

        return filesCount;
    }

    private deleteChildren(parent: Model, rels: Relationship[]): void {

        const { id, tableName } = parent;

        rels.forEach(rel => {
            let filesCount = fs.readdirSync(`${this._dirname}/${rel.table}`).length;

            for (let i = 0; i < filesCount; i++) {
                const fileName = this.getFileName(i, rel.table);
                const json = this.getJson(fileName);

                for (let e = 0; e < json.length; e++) {
                    const keys: ForeignKey[] = json[e].foreignKeys[tableName];

                    keys.forEach(key => {
                        if (key.id == id) {
                            json.splice(e, 1);
                        }
                    });
                }

                fs.writeFileSync(fileName, JSON.stringify(json));
            }
        });
    }

    public delete(itemId: string, inTable: tableNames, cascade: boolean, rels?: Relationship[]): void {

        let filesCount = fs.readdirSync(`${this._dirname}/${inTable}`).length;

        for (let i = 0; i < filesCount; i++) {
            const fileName = this.getFileName(i, inTable);
            let jsonData = this.getJson(fileName);

            for (let i = 0; i < jsonData.length; i++) {

                if (jsonData[i].id == itemId) {

                    if (cascade) {
                        this.deleteChildren(jsonData[i], rels);
                    }

                    jsonData.splice(i, 1);

                    fs.writeFileSync(fileName, JSON.stringify(jsonData));

                    return;
                }

            }
        }
    }

    public connectExisting(parent: Model, parentRel: Relationship, childId: string): void {
        
        let filesCount = fs.readdirSync(`${this._dirname}/${parentRel.table}`).length;
        const parentChunk = this.getChunk(parent.id, parent.tableName);

        for (let i = 0; i < filesCount; i++) {
            const fileName = this.getFileName(i, parentRel.table);
            const json = this.getJson(fileName);

            for (let e = 0; e < json.length; e++) {

                if (json[e].id == childId) {

                    if (parentChunk !== false) {
                        const key = new ForeignKey(parent.tableName, parentChunk as number, parent.id)
                        json[e].foreignKeys[parent.tableName].push(key);

                        fs.writeFileSync(fileName, JSON.stringify(json));

                        return;
                    }
                    
                }
            }
        }
    }

    public disconnectExisting(parent: Model, parentRel: Relationship, childId: string): void {
        let filesCount = fs.readdirSync(`${this._dirname}/${parentRel.table}`).length;

        for (let i = 0; i < filesCount; i++) {
            const fileName = this.getFileName(i, parentRel.table);
            const jsonChildrenData = this.getJson(fileName);

            for (let n = 0; n < jsonChildrenData.length; n++) {

                if (jsonChildrenData[n].id === childId) {
                    const keys: ForeignKey[] = jsonChildrenData[n].foreignKeys[parent.tableName];

                    keys.forEach((key, index) => {
                        if (key.id === parent.id) {
                            keys.splice(index, 1);
                            jsonChildrenData[n].foreignKeys[parent.tableName] = keys;
                            fs.writeFileSync(fileName, JSON.stringify(jsonChildrenData));

                            return;
                        }
                    });
                }
            }     
        }
    }

    public removeChildren(parentId: string, parentTable: tableNames, childrenTable: tableNames): void{
        let filesCount = fs.readdirSync(`${this._dirname}/${childrenTable}`).length;

        for (let i = 0; i < filesCount; i++) {
            const fileName = this.getFileName(i, childrenTable);
            const jsonChildrenData = this.getJson(fileName);

            for (let n = 0; n < jsonChildrenData.length; n++) {

                const keys: ForeignKey[] = jsonChildrenData[n].foreignKeys[parentTable];

                keys.forEach((key, index) => {
                    if (key.id === parentId) {
                        keys.splice(index, 1);
                    }
                });

                jsonChildrenData[n].foreignKeys[parentTable] = keys;
            }

            fs.writeFileSync(fileName, JSON.stringify(jsonChildrenData));
        }
    }

    public update(updatedData: Model): void{;

        let filesCount = fs.readdirSync(`${this._dirname}/${updatedData.tableName}`).length;

        for (let i = 0; i < filesCount; i++) {

            const fileName = this.getFileName(i, updatedData.tableName);
            let jsonData = this.getJson(fileName);

            for (let i = 0; i < jsonData.length; i++) {
                
                if (jsonData[i].id == updatedData.id) {
                    jsonData[i] = updatedData;

                    fs.writeFileSync(fileName, JSON.stringify(jsonData));
                    return;
                }
            }
        }
    }

    public appendAndSave(parent: any, child: any): void {

        let chunk = this.save(parent);

        if (chunk !== false) {
            let key = new ForeignKey(parent.tableName, chunk as number, parent.id);
            child.foreignKeys[parent.tableName].push(key);

            this.save(child);
        }
        else {
            console.error('parrent not saved');
        }

    }

    public appendAndSaveChild(parentId: string, parentTable: tableNames, child: any): void {
        let filesCount = fs.readdirSync(`${this._dirname}/${parentTable}`).length;

        for (let i = 0; i < filesCount; i++) {
            const fileName = this.getFileName(i, parentTable);
            const jsonParentData = this.getJson(fileName);

            for (let n = 0; n < jsonParentData.length; n++) {

                if (jsonParentData[n].id == parentId) {

                    let key = new ForeignKey(parentTable, i, parentId);
                    child.foreignKeys[parentTable].push(key);

                    this.save(child);

                    break;
                }
            }
        }
    }

    public getChildren(parent: any, relation: Relationship): any[] {

        if (relation.type == 'to-many') {

            let children: any[] = [];
            const filesCount = fs.readdirSync(`${this._dirname}/${relation.table}`).length;

            // loop over files
            for (let i = 0; i < filesCount; i++) {
                const fileName = this.getFileName(i, relation.table);
                let dataFromFile = this.getJson(fileName);

                // loop over the items in a file
                for (let n = 0; n < dataFromFile.length; n++) {
                    const arrKeys = dataFromFile[n].foreignKeys[parent.tableName];

                    // loop over foreignKeys in a item
                    for (let j = 0; j < arrKeys.length; j++) {

                        if (arrKeys[j].id == parent.id) {
                            children.push(dataFromFile[n]);
                        }

                    }
                }
            }

            return children;
        }

        return [];
    }

    public getParent(key: ForeignKey): any {

        const { chunk, id, tableName } = key;

        const fileName = this.getFileName(chunk, tableName);
        const jsonData = this.getJson(fileName);

        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].id == id) {
                return jsonData[i];
            }
        }

    }
}
