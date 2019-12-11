export class ChangesModel {
    name: string;
    type: string;
    valFrom: number;
    valTo: number;
    valChange: string;
    totalMax: number;
    totalMin: number;

    constructor(name, type, valFrom, valTo, totalMin, totalMax) {
        if (totalMin == null || totalMin == undefined) {
            totalMin = 0;
        }
        if (totalMax == null || totalMax == undefined) {
            totalMax = 0;
        }
        if (valFrom == null || valFrom == undefined) {
            valFrom = 0;
        }
        if (valTo == null || valTo == undefined) {
            valTo = 0;
        }

        this.name = name;
        this.type = type;

        let change = valTo - valFrom;
        if (change > 0) {
            this.valChange = '+' + change;
        }
        this.valChange = '' + change;

        //--------------------------------------
        this.totalMin = totalMin;
        this.totalMax = totalMax;

        this.valFrom = ((valFrom - totalMin) / (totalMax - totalMin)) * 100;
        this.valTo = ((valTo - totalMin) / (totalMax - totalMin)) * 100;
        //---------------------------------------

    }
}