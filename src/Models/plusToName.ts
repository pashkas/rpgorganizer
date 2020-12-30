import { v4 as uuid } from 'uuid';
export class plusToName {

    constructor(name, linkId, linkName, linkType) {
        this.name = name;
        this.linkId = linkId;
        this.linkName = linkName;
        this.linkType = linkType;
    }

    id: any = uuid();
    name: string;
    linkId: any;
    linkName: string;
    linkType: string;
}
