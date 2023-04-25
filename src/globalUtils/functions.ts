import type { AnyObject, GetFormatedTimeOptions } from "src/types/functions";

export function checkFields<Type extends Object>(obj: Type, ...keys: string[]): boolean {
    let result = true;

    const objKeys = Object.keys(obj), objValues = Object.values(obj);

    result = !keys.some(key => !objKeys.includes(key)) && !objValues.some(value => !value);

    return result;
}

export function getAxiosPathFromURL(url: URL) {
    const { pathname, searchParams, hash } = url;
    const areSearchParamsExist = !!Array.from(searchParams.entries()).length;
    return areSearchParamsExist ? `${pathname}?${searchParams}${hash}` : `${pathname}${hash}`;
}

export function unitedWithNull(expression: any) {
    return expression ?? null;
}

export function objValuesUnitedWithNull(obj: AnyObject) {
    const clone = getObjClone(obj);

    for ( const [ key, value ] of Object.entries(clone) ) {
        clone[key] = unitedWithNull(value);
    }

    return clone;
}

export function getObjClone<ObjType = AnyObject>(obj: ObjType): ObjType {
    return Object.create(null, Object.getOwnPropertyDescriptors(obj));
}

export function objValuesTruthy<ObjType = AnyObject>(obj: ObjType): ObjType {
    let objEntries = Object.entries(obj as AnyObject);

    objEntries = objEntries.filter(([_key, value]) => value);

    return Object.fromEntries(objEntries) as ObjType;
}

export function deleteFromObj<ObjType extends AnyObject>(obj: ObjType, ...deletedFields: string[]) {
    const clone = getObjClone(obj);

    for ( const field of deletedFields ) {
        delete clone[field];
    }

    return clone;
}

export function normalizeBase64(str: string): string {
    const mimeTypeMatch = str.match(/((image|text)\/.+)(?:base64)/);

    if ( mimeTypeMatch ) {
        const mimeType = mimeTypeMatch[1];

        str = str.replace(/^.*base64/, "");
        str = `data:${mimeType};base64,${str}`;
    }

    return str;
}

export function getFormatedTime(dateTimeString: string, opt: GetFormatedTimeOptions = {}) {
    const matchOfTime = dateTimeString.match(/(?<![\-\d])\d{2}(?![\-\d])/g);

    if ( matchOfTime ) {
        const { h, m, s } = opt;

        dateTimeString =
            matchOfTime
            .filter((_i, index) => {
                return !index && h || index === 1 && m || index === 2 && s;
            })
            .join(".");
    }

    return dateTimeString;
}