import * as fs from 'fs';
import { ForeignKey, Relationship } from './baseModel';
import { tableNames } from './tableNames';


export class appDatabase{

    private _dirname: string;

    constructor(dirPath: string){
        this._dirname = dirPath;

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);

            let initialData: any[] = [];
            let jsonInitData = JSON.stringify(initialData);
            const propertyNames: string[] = ['Languages', 'Words', 'Phrases'];
            propertyNames.forEach(name => {
                fs.mkdirSync(`${dirPath}/${name}`);
                fs.writeFile(`${dirPath}/${name}/${name}0.json`, jsonInitData, (err) => {
                    if (err) {
                        console.log(err.message);
                    } else{
                        console.log('created file ' + name);
                    }
                });
            });
        }
    }

    public get Languages() : any {
        return this.getdata(tableNames.Language);
    }

    public get Words() : any {
        return this.getdata(tableNames.Word);
    }

    public get Phrases() : any {
        return this.getdata(tableNames.Phrase);
    }

    private getJson(fileName: string): any{

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

    private getdata(fileName: string): any{

        let filesCount = fs.readdirSync(`${this._dirname}/${fileName}`).length;
        let jsonData: any = [];

        for (let i = 0; i < filesCount; i++) {

            const filePath = `${this._dirname}/${fileName}/${fileName}${i}.json`;
            const jsonFileData = this.getJson(filePath);
            
            jsonData = [...jsonData, ...jsonFileData];
        }
        
        return jsonData;
    }


    public save(singleData:any, inTable: tableNames): boolean | number{

        let filesCount = fs.readdirSync(`${this._dirname}/${inTable}`).length;

        for (let i = 0; i < filesCount; i++) {

            const fileName = `${this._dirname}/${inTable}/${inTable}${i}.json`;
            let jsonData = this.getJson(fileName);

            if (jsonData.length < 1000) {
                jsonData.push(singleData);
                fs.writeFileSync(fileName, JSON.stringify(jsonData));

                return i;
            }
        }

        const fileName = `${this._dirname}/${inTable}/${inTable}${filesCount}.json`;
        const saveData = JSON.stringify([singleData]);
        fs.writeFile(fileName, saveData, (err) => {
            if (err) {
                console.log(err.message);
                return false;
            }
        });

        return filesCount;
    }

    public delete(itemId: string, inTable: tableNames): void{
        let jsonData = this.getdata(inTable);
        
        for (let i = 0; i < jsonData.length; i++) {
            
            if (jsonData[i].id == itemId) {
                jsonData.splice(i);
                break;

                // add for cascade
            }
            
        }
    }

    public appendAndSave(parent: any, child: any): void{

        let chunk = this.save(parent, parent.tableName);

        if (chunk !== false) {
            let key = new ForeignKey(parent.tableName, chunk as number, parent.id);
            child.foreignKeys[parent.tableName].push(key);

            this.save(child, child.tableName);
        }
        else{
            console.error('parrent not saved');
        }

    }

    public appendAndSaveChild(parentId: string, parentTable: tableNames, child: any): void{
        let filesCount = fs.readdirSync(`${this._dirname}/${parentTable}`).length;

        for (let i = 0; i < filesCount; i++) {
            const fileName = `${this._dirname}/${parentTable}/${parentTable}${i}.json`;
            const jsonParentData = this.getJson(fileName);

            for (let n = 0; n < jsonParentData.length; n++) {
                
                if (jsonParentData[n].id == parentId) {
                    
                    let key =  new ForeignKey(parentTable, i, parentId);
                    child.foreignKeys[parentTable].push(key);

                    this.save(child, child.tableName);

                    break;
                }
            }
        }
    }

    public getChildren(parent: any, relation: Relationship): any[]{
        
        if (relation.type == 'to-many') {

            let children: any[] = [];
            const filesCount = fs.readdirSync(`${this._dirname}/${relation.table}`).length;

            // loop over files
            for (let i = 0; i < filesCount; i++) {
                const fileName = `${this._dirname}/${relation.table}/${relation.table}${i}.json`;
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

    public getParent(key: ForeignKey): any{

        const { chunk, id, tableName} = key;

        const fileName = `${this._dirname}/${tableName}/${tableName}${chunk}.json`;
        const jsonData = this.getJson(fileName);

        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].id == id) {
                return jsonData[i];
            }
        }
        
    }
}
