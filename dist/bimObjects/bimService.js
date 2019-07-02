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
                selection: this.getLeafDbIds(model).selection
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
        const dbIds = [];
        if (typeof rootId === "undefined") {
            rootId = [tree.nodeAccess.rootId];
        }
        else {
            rootId = Array.isArray(rootId) ? rootId : [rootId];
        }
        rootId.forEach(el => {
            const queue = [el];
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
        });
        return { model: model, selection: dbIds };
    }
    getBimObjectsByPropertiesName(model, properties) {
        return this.getAllBimObjectsProperties(model).then(res => {
            let result = [];
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                for (let j = 0; j < element.properties.length; j++) {
                    const property = element.properties[j];
                    if (typeof this._getLabel(property, properties) !== "undefined") {
                        result.push(property);
                    }
                    // }
                }
                return result;
            }
        });
    }
    getBimObjectsValidated(referential, regEx) {
        return this.getBimObjectProperties(referential).then(res => {
            return res.map(element => {
                return {
                    model: element.model,
                    properties: element.properties.filter(el => {
                        return this._isValid(el, regEx);
                    })
                };
            });
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
                model: model,
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
    _getLabel(bim, properties) {
        for (let i = 0; i < properties.length; i++) {
            const propertieValue = properties[i].value;
            const propertyName = properties[i].name;
            const found = bim.properties.find(el => {
                return typeof propertieValue === "undefined" ||
                    propertieValue.length === 0
                    ? el.displayName.toLowerCase() ===
                        propertyName.trim().toLocaleLowerCase()
                    : el.displayName.toLowerCase() ===
                        propertyName.trim().toLocaleLowerCase() &&
                        propertieValue == el.displayValue;
            });
            if (typeof found === "undefined") {
                return undefined;
            }
        }
        return true;
    }
    _isValid(el, regEx) {
        for (let i = 0; i < regEx.length; i++) {
            let nameRegex = regEx[i].nameRegex;
            let valueRegex = regEx[i].valueRegex;
            let found = el.properties.find(res => {
                if (typeof valueRegex === "undefined") {
                    return nameRegex.test(res.displayName);
                }
                return (nameRegex.test(res.displayName) && valueRegex.test(res.displayValue));
            });
            if (typeof found === "undefined") {
                return false;
            }
        }
        return true;
    }
}
exports.default = new BimObjectManagerService();
//# sourceMappingURL=bimService.js.map