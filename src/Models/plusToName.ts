import { v4 as uuid } from 'uuid';
export class plusToName {

    constructor(name, linkId, linkName) {
        this.name = name;
        this.linkId = linkId;
        this.linkName = linkName;
    }

    id: any = uuid();
    name: string;
    linkId: any;
    linkName: string;
}
