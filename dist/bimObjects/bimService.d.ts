declare class BimObjectManagerService {
    constructor();
    getAllBimObjectsProperties(model: any): Promise<any>;
    getBimObjectProperties(argBimObjects: {
        model: any;
        selection: Array<Number>;
    } | Array<{
        model: any;
        selection: Array<Number>;
    }>): Promise<any>;
    getLeafDbIds(model: any, rootId?: Number | Array<Number>): {
        model: any;
        selection: Array<Number>;
    };
    getBimObjectsByPropertiesName(model: any, properties: Array<{
        name: string;
        value: string;
    }>): Promise<any[]>;
    getBimObjectsValidated(referential: any, regEx: any): Promise<any>;
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
    }, properties: Array<{
        name: string;
        value: string;
    }>): any;
    _isValid(el: any, regEx: any): boolean;
}
declare const _default: BimObjectManagerService;
export default _default;
