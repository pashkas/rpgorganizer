import { v4 as uuid } from 'uuid';
export class Reward {
    id: any = uuid();
    name: string = "";
    image: string = "";
    descr: string = "";
    probability: number = 1;
    cumulative: number = 0;
    count: number = 0;
}
