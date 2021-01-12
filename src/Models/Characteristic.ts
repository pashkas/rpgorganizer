import { Rangse } from './Rangse';
import { v4 as uuid } from 'uuid';
import { Ability } from './Ability';

export class Characteristic {
    static maxValue: number = 10;
    abilities: Ability[] = [];
    descr: string;
    id: any = uuid();
    image: string = "assets/icons/defCha.png";
    name: string;
    progressValue: number = 0;
    rang: Rangse = { val: 0, name: "0", img: "" };
    startRang: Rangse = { val: 0, name: "0", img: "" };
    value: number = 0;
    HasSameAbLvl: boolean;
}
