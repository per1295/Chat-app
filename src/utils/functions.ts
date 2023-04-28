import type { CheckFormItemOpt, BytesToFormat, ArrayItemWithId } from "src/types/functions";
import type { AsyncThunkPayloadCreator } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import { FormValidationItemError } from "./constructors";
import cookie from "cookiejs";

export function checkFormItem(formItem: HTMLInputElement, opt?: CheckFormItemOpt): FormValidationItemError | null {
    let result = null;
    const type = formItem.type.toLocaleLowerCase();
    const { name, value, checked } = formItem;

    if ( opt ) {
        if ( opt.required ) {
            switch(type) {
                case "checkbox":
                case "radio":
                    if ( !checked ) {
                        result = new FormValidationItemError(`The ${name} must be checked`);
                    }
                    break;
                default:
                    if ( !value ) {
                        result = new FormValidationItemError(`The ${name} must be required`);
                    }
                    break;
            }
        }
    
        if ( opt.minLength && value.length < opt.minLength ) {
            result = new FormValidationItemError(`The length of ${name} is less than ${opt.minLength}`);
        }
    
        if ( opt.maxLength && value.length > opt.maxLength ) {
            result = new FormValidationItemError(`The length of ${name} is greater than ${opt.minLength}`);
        }
    }

    switch(type) {
        case "email":
            if ( !value.includes("@") ) {
                result = new FormValidationItemError("Email doesn`t have @");
            }
            break;
    }

    switch(name) {
        case "username":
            if ( !/\s/.test(value) ) result = new FormValidationItemError("Username doesn`t have a space");
            
            const matches = value.match(/\s/g);

            if ( matches && matches.length > 1 ) {
                result = new FormValidationItemError("Username should have one space");
            }

            const [ name, surname ] = value.split(" ");

            if ( !name?.length ) result = new FormValidationItemError("Name isn`t defined");
            if ( !surname?.length ) result = new FormValidationItemError("Surname isn`t defined");
            break;
    }

    return result;
}

export function capitalize(str: string): string {
    return str.split("").map((item, index) => !index ? item.toUpperCase() : item).join("");
}

export function isSSR() {
    return typeof window === "undefined";
}

export function payloadCreatorWrapper<Returned, ThunkArg = void>
(payloadCreator: AsyncThunkPayloadCreator<Returned | undefined, ThunkArg>)
{
    const wrappedPayloadCreator: AsyncThunkPayloadCreator<Returned | undefined, ThunkArg> =
    async (arg: ThunkArg, thunkApi) =>
    {
        try {
            const returnedValue = await payloadCreator(arg, thunkApi);
            return returnedValue as Returned | undefined;
        } catch (error) {
            const e = error as AxiosError;
            
            if ( e.response ) return thunkApi.rejectWithValue(e.response.data);
        }
    }

    return wrappedPayloadCreator;
}

export function checkCookies(...fields: string[]): boolean {
    let result = true;

    const allCookies = cookie.all();

    result = !fields.some(field => !(field in allCookies));

    return result;
}

export function getChatsPath(...paths: string[]) {
    const matchOfChatId = location.pathname.match(/chats\/\w+/i);

    if ( matchOfChatId ) {
        let path = matchOfChatId.toString();

        for ( let partOfPath of paths ) {
            partOfPath = partOfPath.replace(/^\//, "");
            path += `/${partOfPath}`;
        }

        return path;
    }
}

export function getChatsId() {
    const matchChatsId = location.pathname.match(/(?<=chats\/)\w+(?=\/?)/i);

    if ( matchChatsId ) return matchChatsId.toString();
}

export function bytesTo(size: number, format: BytesToFormat, round?: number) {
    switch(format) {
        case "kb":
            size /= 1000;
            break;
        case "mb":
            size /= 1e6;
            break;
        case "gb":
            size /= 1e9;
            break;
    }

    return +size.toFixed(round ?? 0);
}

export function getMassivePartsOfNumber(strNum: string) {
    return strNum.split("").map(item => parseInt(item));
}

export function getStrNumberOfParts(...numbers: number[]) {
    return numbers.join("");
}

export function getPartsOfRecordingFullTime(fullTime: string) {
    return fullTime.split(":");
}

export function getFullRecordingTime(...partsOfTime: string[]) {
    return partsOfTime.join(":");
}

export function recordingTimeIncrement(incrementedNum: number, lowerNum: number) {
    if ( lowerNum > 9 ) {
        incrementedNum += 1;
        lowerNum = 0;
    }

    return [ incrementedNum, lowerNum ];
}

export function recordingTimeDecrement(decrementedNum: number, lowerNum: number) {
    if ( lowerNum < 0 ) {
        decrementedNum -= 1;
        lowerNum = 9;
    }

    return [ decrementedNum, lowerNum ];
}

export function isHoursGreaterOrEqualThenTen(hours: string | number) {
    if ( typeof hours === "string" ) {
        return parseInt(hours) >= 10;
    } else {
        return hours >= 10;
    }
}

export function isAudioTimeEnd(recordingTime: string) {
    return !getPartsOfRecordingFullTime(recordingTime)
    .filter(partOfTime => {
        const numPartOfTime = parseInt(partOfTime);
        return numPartOfTime > 0 && !isNaN(numPartOfTime);
    })
    .length;
}

export function removeItemsWithId(arr: ArrayItemWithId[]) {
    return (itemWithId: ArrayItemWithId) => {
        return !arr.some(item => item.id === itemWithId.id);
    }
}