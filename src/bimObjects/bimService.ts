class BimObjectManagerService {
  constructor() {}

  getAllBimObjectsProperties(model: any): Promise<any> {
    return this.getBimObjectProperties([
      {
        model: model,
        selection: this.getLeafDbIds(model)
      }
    ]);
  }

  getBimObjectProperties(
    argBimObjects: Array<{ model: any; selection: Array<Number> }>
  ): Promise<any> {
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

  getLeafDbIds(model: any, rootId?: Number): Array<Number> {
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

  getBimObjectsByPropertiesName(
    model: any,
    propertieName: string,
    propertieValue?: string
  ) {
    return this.getAllBimObjectsProperties(model).then(res => {
      let result = [];
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        for (let j = 0; j < element.properties.length; j++) {
          const property = element.properties[j];
          if (
            typeof this._getLabel(property, propertieName, propertieValue) !==
            "undefined"
          ) {
            result.push(property);
          }
        }
      }
      return result;
    });
  }

  getBimObjectsByName(
    model: any,
    bimObjectName: string,
    labelName?: string
  ): Promise<any> {
    return new Promise(resolve => {
      model.search(
        bimObjectName.trim(),
        async res => {
          let properties = await this.getBimObjectProperties([
            { model: model, selection: res }
          ]);

          resolve(properties);
        },
        () => {
          resolve([]);
        },
        labelName
      );
    });
  }

  ////////////////////////////////////////////////////////////////////////
  //                             PRIVATES                               //
  ////////////////////////////////////////////////////////////////////////

  async _getProperties(model: any, selection: Array<Number>): Promise<any> {
    let properties = selection.map(el => {
      return new Promise(resolve => {
        model.getProperties(
          el,
          res => {
            // properties.push(res);
            resolve(res);
          },
          err => {
            resolve(undefined);
          }
        );
      });
    });

    return {
      model: model.id,
      properties: await Promise.all(properties)
    };
  }

  _getAllDbIds(model: any) {
    var instanceTree = model.getData().instanceTree;

    var allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex);

    return allDbIdsStr.map(function(id) {
      return parseInt(id);
    });
  }

  _getLabel(
    bim: {
      dbId: Number;
      externalId: string;
      name: string;
      properties: Array<{ displayName: string; displayValue: any }>;
    },
    propertyName: string,
    propertieValue?: any
  ): any {
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

export default new BimObjectManagerService();
