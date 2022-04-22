import * as fs from 'fs';


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
                fs.writeFile(`${dirPath}/${name}.json`, jsonInitData, () => {
                    console.log('created file ' + name);
                });
            });
        }
    }

    public get Languages() : any {
        return this.getdata('Languages');
    }

    public get Words() : any {
        return this.getdata('Words');
    }

    public get Phrases() : any {
        return this.getdata('Phrases');
    }

    private getdata(fileName: string): any{
        const jsonData= require(`${this._dirname}/${fileName}.json`); 
        return jsonData;
    }
    
}
