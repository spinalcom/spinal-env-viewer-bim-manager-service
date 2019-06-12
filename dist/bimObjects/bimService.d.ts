declare class BimObjectManagerService {
    constructor();
    getAllBimObjectsProperties(model: any): Promise<any>;
    getBimObjectProperties(argBimObjects: Array<{
        model: any;
        selection: Array<Number>;
    }>): Promise<any>;
    getLeafDbIds(model: any, rootId?: Number): Array<Number>;
    getBimObjectsByPropertiesName(model: any, propertieName: string, propertieValue?: string): Promise<any[]>;
    getBimObjectsByName(model: any, bimObjectName: string, labelName?: string): Promise<any>;
    _getProperties(model: any, selection: Array<Number>): Promise<any>;
    _getAllDbIds(model: any): number[];
    _getLabel(bim: {
        dbId: Number;
        externalId: string;
        name: string;
        properties: Array<{
            displayName: string;
            displayValue: any;
        }>;
    }, propertyName: string, propertieValue?: any): any;
}
declare const _default: BimObjectManagerService;
export default _default;