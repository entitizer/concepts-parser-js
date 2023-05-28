export type Dictionary<T> = { [index: string]: T };

function checkField(name: string) {
  if (typeof name !== "string") {
    throw new Error("Invalid model field name");
  }
}

export type Context = {
  lang: string;
  text: string;
  country?: string;
};

export interface IModel {
  set<T>(fieldName: string, fieldValue?: T): void;
  get<T>(fieldName: string): T;
  toJSON(): any;
}

/**
 * Model base class
 */
export abstract class Model implements IModel {
  private _fields: any = {};
  // private _keys?: any;

  constructor(fields?: any) {
    if (fields) {
      if (typeof fields !== "object") {
        throw new Error("`fields` param must be an oject");
      }
      for (let prop in fields) {
        this.set(prop, fields[prop]);
      }
    }
  }

  get<T>(fieldName: string): T {
    checkField(fieldName);

    return this._fields[fieldName];
  }

  set<T>(fieldName: string, fieldValue?: T) {
    checkField(fieldName);

    if (fieldValue === undefined) {
      delete this._fields[fieldName];
    } else {
      this._fields[fieldName] = fieldValue;
    }
  }

  toJSON(): any {
    const fields: any = {};

    for (let prop in this._fields) {
      let value = this._fields[prop];
      if (value && typeof value.toJSON === "function") {
        value = value.toJSON();
      }
      fields[prop] = value;
    }

    return fields;
  }
}
