import { v4 as uuid } from 'uuid';

export class Diary {
    date: Date = new Date();
    done: string = '';
    notDone: string = '';
    params: DiaryParam[] = [];

    constructor(date: Date, params: DiaryParam[]) {
        this.date = date;
        this.done = '';
        this.notDone = '';
        this.params = params;
    }
}

export class DiaryParam {
    name: string = '';
    val: number = 0;
    id: any = uuid();

    /**
     * up, down, eq - вырос или упал по сравнению с прошлым.
     */
    state: string;
}

export class DicData {
    data: number[] = [];
    name: string;
    constructor(name){
        this.name = name;
    }
}