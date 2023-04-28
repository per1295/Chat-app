import type { AnyObject, GetFormatedTimeOptions, GetFormatedDateOptions, DateTimePart } from "src/types/functions";

export function checkFields<Type extends AnyObject>(obj: Type, ...keys: string[]): boolean {
    let result = true;

    const objKeys = Object.keys(obj);

    result = !keys.some(key => !objKeys.includes(key)) && !keys.some(key => !obj[key]);

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

export function getFormatedDate(dateTimeString: string, opt: GetFormatedDateOptions = {}) {
    const matchOfDate = dateTimeString.match(/(?<![\:\d])\d{2,4}(?![\:\d])/g);

    if ( matchOfDate ) {
        const { y, m, d } = opt;

        dateTimeString = matchOfDate
        .filter((_i, index) => {
            return !index && y || index === 1 && m || index === 2 && d 
        })
        .join(".");
    }

    return dateTimeString;
}

export function getDateTime(d?: Date) {
    const date = d ?? new Date();

    let year: DateTimePart = date.getFullYear();
    let month: DateTimePart = date.getMonth() + 1;
    let day: DateTimePart = date.getDate();
    let hours: DateTimePart = date.getHours();
    let minutes: DateTimePart = date.getMinutes();
    let seconds: DateTimePart = date.getSeconds();

    if ( month < 10 ) month = `0${month}`;
    if ( day < 10 ) day = `0${day}`;
    if ( hours < 10 ) hours = `0${hours}`;
    if ( minutes < 10 ) minutes = `0${minutes}`;
    if ( seconds < 10 ) seconds = `0${seconds}`;

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}