"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BimObjectManagerService {
    constructor() { }
    getAllBimObjectsProperties(model) {
        return this.getBimObjectProperties([
            {
                model: model,
                selection: this.getLeafDbIds(model)
            }
        ]);
    }
    getBimObjectProperties(argBimObjects) {
        // let properties = [];
        let bimOjects = Array.isArray(argBimObjects)
            ? argBimObjects
            : [argBimObjects];
        let promises = bimOjects.map(el => {
            return this._getProperties(el.model, el.selection);
        });
        return Promise.all(promises).then(res => {
            return res;
        });
    }
    getLeafDbIds(model, rootId) {
        const tree = model.getInstanceTree();
        rootId = typeof rootId === "undefined" ? tree.nodeAccess.rootId : rootId;
        const queue = [rootId];
        const dbIds = [];
        let hasChildren;
        while (queue.length) {
            let id = queue.pop();
            hasChildren = false;
            tree.enumNodeChildren(id, childId => {
                hasChildren = true;
                queue.push(childId);
            });
            if (!hasChildren) {
                dbIds.push(id);
            }
        }
        return dbIds;
    }
    getBimObjectsByPropertiesName(model, propertieName, propertieValue) {
        return this.getAllBimObjectsProperties(model).then(res => {
            let result = [];
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                for (let j = 0; j < element.properties.length; j++) {
                    const property = element.properties[j];
                    if (typeof this._getLabel(property, propertieName, propertieValue) !==
                        "undefined") {
                        result.push(property);
                    }
                }
            }
            return result;
        });
    }
    getBimObjectsByName(model, bimObjectName, labelName) {
        return new Promise(resolve => {
            model.search(bimObjectName.trim(), (res) => __awaiter(this, void 0, void 0, function* () {
                let properties = yield this.getBimObjectProperties([
                    { model: model, selection: res }
                ]);
                resolve(properties);
            }), () => {
                resolve([]);
            }, labelName);
        });
    }
    ////////////////////////////////////////////////////////////////////////
    //                             PRIVATES                               //
    ////////////////////////////////////////////////////////////////////////
    _getProperties(model, selection) {
        return __awaiter(this, void 0, void 0, function* () {
            let properties = selection.map(el => {
                return new Promise(resolve => {
                    model.getProperties(el, res => {
                        // properties.push(res);
                        resolve(res);
                    }, err => {
                        resolve(undefined);
                    });
                });
            });
            return {
                model: model.id,
                properties: yield Promise.all(properties)
            };
        });
    }
    _getAllDbIds(model) {
        var instanceTree = model.getData().instanceTree;
        var allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex);
        return allDbIdsStr.map(function (id) {
            return parseInt(id);
        });
    }
    _getLabel(bim, propertyName, propertieValue) {
        return bim.properties.find(el => {
            return typeof propertieValue === "undefined"
                ? el.displayName.toLowerCase() ===
                    propertyName.trim().toLocaleLowerCase()
                : el.displayName.toLowerCase() ===
                    propertyName.trim().toLocaleLowerCase() &&
                    propertieValue == el.displayValue;
        });
    }
}
exports.default = new BimObjectManagerService();
//# sourceMappingURL=bimService.js.map