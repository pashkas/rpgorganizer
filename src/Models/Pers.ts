import { Rangse } from './Rangse';
import { Characteristic as Characteristic } from './Characteristic';
import { Task } from './Task';
import { Enamy } from './Enamy';
import { Reward } from './Reward';
import { Qwest } from './Qwest';

export class Pers {

    /**
     * Очки навыков.
     */
    ON: number = 0;

    /**
     * Очков навыков за уровень.
     */
    ONPerLevel: number = 0;

    /**
     * Ругательства при пропуске задач.
     */
    static Abuses: string[] = [
        "Кошмар", "Неудача", "Блин", "Соберись", "Ну-ну", "Fail", "Чудовищно",
        "Попробуй еще раз", "Плохо", "Осечка", "Промах", "Каналья", "Карамба", "Тысяча чертей",
        "Дохлые каракатицы", "Вот кокос", "Гром и молния", "Лопни моя селезенка", "ФАК", "ЁКЛМН",
        "ХРЕНЬ", "МАЗАФАКА", "Ну вот...", "Минус", "Капец", "Чудовищно", "Ужасно", "Пипец"
    ];


    Monsters0Queue: number;
    Monsters1Queue: number;
    Monsters2Queue: number;
    Monsters3Queue: number;
    Monsters4Queue: number;
    Monsters5Queue: number;


    static GameSettings = {
        /**
         * Нет навыков. Повторяющиеся задачи сразу навыки.
         */
        isNoAbilities: true,

        /**
         * На скорость получения опыта влияет уровень персонажа. False - прокачка навыков.
         */
        isExpForPersLevels: false,

        /**
         * Как в морровинд. Сначала прокачай навык - затем получи опыт.
         */
        isTesExp: true,
    }

    /**
     * Подбадривания при выполнении задач.
     */
    static Inspirations: string[] = [
        "Молодец", "Так держать", "Супер", "Класс", "Круто",
        "Хорошая работа", "Гениально", "Фантастика", "Отлично", "Грандиозно",
        "Легендарно", "Чудесно", "Потрясающе", "Умничка",
        "Великолепно", "Красава", "Чудно", "Красавчик", "Так держать",
        "Продолжай в том же духе", "Молодчина", "Четко", "Ну ты даешь", "Офигенно",
        "Плюс", "Давай-давай", "Божественно", "Умопомрачительно",
        "Ты лучший", "Герой", "Эпично", "Грандиозно", "Блистательно", "Конгениально",
        "Зубодробительно", "Волшебно", "ТАДАМ"
    ];
    static maxLevel: number = 100;
    static rangLvls: number[] = [0, 20, 40, 60, 80, 100];

    characteristics: Characteristic[] = [];
    curEndOfListSeq: number;
    curOrderSeq: number = 0;
    currentQwestId: string;
    currentTaskIndex: number = 0;
    currentTask: Task;
    dateLastUse: Date = new Date();
    exp: number = 0;
    id: any;
    image: string = "";
    inventory: Reward[] = [];
    level: number = 0;
    name: string = "Хиро";
    nextRangLvl: number;
    prevOrderSeq: number = 0;
    progressValue: number = 0;
    qwests: Qwest[] = [];
    rang: Rangse = { val: 0, name: "Обыватель", img: "https://live.staticflickr.com/7901/40619949183_fbb6652b25_o.jpg" };
    rangProgress: number;
    rangse: Rangse[] = [
        { val: 0, name: "Обыватель", img: "https://live.staticflickr.com/7901/40619949183_fbb6652b25_o.jpg" },
        { val: 20, name: "Авантюрист", img: "https://live.staticflickr.com/7888/47533068482_b007e8ae03_o.png" },
        { val: 40, name: "Воин", img: "https://live.staticflickr.com/7879/46670486965_490750b77e_o.jpg" },
        { val: 60, name: "Герой", img: "https://live.staticflickr.com/7803/47533073972_5302712b17_o.jpg" },
        { val: 80, name: "Супергерой", img: "https://live.staticflickr.com/7855/33709082758_52c128029b_o.jpg" },
        { val: 100, name: "Легенда", img: "https://live.staticflickr.com/7855/33709082758_52c128029b_o.jpg" },
    ];
    rewards: Reward[] = [];
    sellectedView: string;
    story: "Обычный человек, который однажды раскрыл свое геройское предназначение...";
    tasks: Task[] = [];
    totalRewardProbability: number = 0;
    userId: any;
    nextExp: number;
    prevExp:number;
}
