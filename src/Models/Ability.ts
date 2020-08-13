import { Rangse } from './Rangse';
import { v4 as uuid } from 'uuid';
import { Task } from "./Task";
export class Ability {
    static maxValue: number = 10;
    // static rangse: Rangse[] = [
    //     { val: 0, name: "0", img:"" },
    //     { val: 1, name: "1", img:""  },
    //     { val: 2, name: "2", img:""  },
    //     { val: 3, name: "3", img:""  },
    //     { val: 4, name: "4", img:""  },
    //     { val: 5, name: "5", img:""  },
    //     { val: 6, name: "6", img:""  },
    //     { val: 7, name: "7", img:""  },
    //     { val: 8, name: "8", img:""  },
    //     { val: 9, name: "9", img:""  },
    //     { val: 10, name: "10", img:""  },
    //     { val: 11, name: "11", img:""  },
    //     { val: 12, name: "12", img:""  },
    //     { val: 13, name: "13", img:""  },
    //     { val: 14, name: "14", img:""  },
    //     { val: 15, name: "15", img:""  },
    //     { val: 16, name: "16", img:""  },
    //     { val: 17, name: "17", img:""  },
    //     { val: 18, name: "18", img:""  },
    //     { val: 19, name: "19", img:""  },
    //     { val: 20, name: "20", img:""  },
    // ];

    descr: string;
    id: any = uuid();
    image: string = "assets/icons/defAbil.png";
    name: string;
    progressValue: number = 0;
    rang: Rangse = { val: 0, name: "0", img: "" };
    tasks: Task[] = [];
    value: number = 0;
    HasSameAbLvl: boolean;
    isOpen: boolean = false;
    isNotChanged: boolean = false;
    isNotDoneReqvirements: boolean = false;
}
