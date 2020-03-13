export class mapDicItem {
    name: string;
    type: string;
    lincs: string[] = [];
    index: number;
    el: any;

    constructor(type, name, index, el) {
        this.type = type;
        this.name = name;
        this.index = index;
        this.el = el;
    }
}

export class mindMapItem {
    name; id; symbolSize; itemStyle; category;
    constructor(id, name, symbolSize, color) {
        this.name = name;
        this.id = id;
        this.symbolSize = symbolSize;
        this.itemStyle = {
            color: color
        };
    }
}

export class mindMapLink {
    source;
    target;

    constructor(source, target) {
        this.source = source;
        this.target = target;
    }
}