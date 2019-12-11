import { Task } from './Task';
import { v4 as uuid } from 'uuid';
import { Reward } from './Reward';
export class Qwest {
    id: any = uuid();
    name: string = "";
    image: string = "";
    descr: string = "";
    rewards: Reward[] = [];
    tasksDone: number = 0;
    tasks: Task[] = [];
    progressValue: number = 0;
    exp: number = 0;
}
