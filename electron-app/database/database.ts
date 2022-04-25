import * as fs from 'fs';
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

    private getdata(fileName: string): any{

        let filesCount = fs.readdirSync(`${this._dirname}/${fileName}`).length;
        let jsonData: any = [];

        for (let i = 0; i < filesCount; i++) {

            const fileData = fs.readFileSync(`${this._dirname}/${fileName}/${fileName}${i}.json`, 'utf-8');
            let jsonFileData: any = [];
            try {
                jsonFileData = JSON.parse(fileData);
            } catch (error) {
                // fix this!!
                console.log(error);
            }
            
            jsonData = [...jsonData, ...jsonFileData];
        }
        
        return jsonData;
    }


    public save(singleData:any, inTable: tableNames): boolean | number{

        let filesCount = fs.readdirSync(`${this._dirname}/${inTable}`).length;

        for (let i = 0; i < filesCount; i++) {

            const fileName = `${this._dirname}/${inTable}/${inTable}${i}.json`;
            const fileData = fs.readFileSync(fileName, 'utf-8');
            let jsonData = JSON.parse(fileData);

            if (jsonData.length < 100) {
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

    public appendAndSave(): void{

    }
}
