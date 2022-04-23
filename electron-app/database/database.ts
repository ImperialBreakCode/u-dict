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
                fs.writeFile(`${dirPath}/${name}/${name}0.json`, jsonInitData, () => {
                    console.log('created file ' + name);
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
        const data = fs.readFileSync(`${this._dirname}/${fileName}/${fileName}0.json`, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData;
    }


    public save(singleData:any, inTable: tableNames): void{
        let jsonData = this.getdata(inTable);
        jsonData.push(singleData);
        fs.writeFileSync(`${this._dirname}/${inTable}/${inTable}0.json`, JSON.stringify(jsonData));
    }
    
}
