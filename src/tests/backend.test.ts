/**
 * @jest-environment node
 */

import { getDateTime } from "src/server/functions";
import { checkFields, objValuesUnitedWithNull } from "src/globalUtils/functions";

describe("getDateTime" , () => {
    const mockGetDateTime = jest.fn(getDateTime);

    test("2023-06-22 23:45:23", () => {
        const date_1 = new Date("2023-06-22T23:45:23");

        const result = mockGetDateTime(date_1);

        expect(result).toBe("2023-06-22 23:45:23");
    });

    test("2015-11-01 01:05:02", () => {
        const date_2 = new Date("2015-11-01T01:05:02");

        const result = mockGetDateTime(date_2);

        expect(result).toBe("2015-11-01 01:05:02");
    });

    test("2020-09-09 08:00:00", () => {
        const date_3 = new Date("2020-09-09T08:00:00");

        const result = mockGetDateTime(date_3);

        expect(result).toBe("2020-09-09 08:00:00");
    });
});

describe("checkFields", () => {
    const mockCheckFields = jest.fn(checkFields);

    const arg_1 = [ "name", "id" ];
    const arg_2 = [ "name", "age", "surname" ];
    const arg_3 = [ "name", "age", "surname", "id" ];

    test("falsy", () => {
        const main_arg_1 = { name: "Egor", age: 19 };
        const main_arg_2 = { name: null, age: 25, surname: "Kuvshinow" };
        const main_arg_3 = { name: "Egor", age: 25, surname: "Kuvshinow" };
        
        mockCheckFields(main_arg_1, ...arg_1);
        mockCheckFields(main_arg_2, ...arg_2);
        mockCheckFields(main_arg_3, ...arg_3);

        expect(mockCheckFields.mock.results[0].value).toBeFalsy();
        expect(mockCheckFields.mock.results[1].value).toBeFalsy();
        expect(mockCheckFields.mock.results[2].value).toBeFalsy();
    });

    test("truthy", () => {
        const main_arg_3 = { id: 2, name: "Egor" };

        mockCheckFields(main_arg_3, ...arg_1);

        expect(mockCheckFields.mock.results[0].value).toBeTruthy();
    });
});

describe("objValuesUnitedWithNull", () => {
    test("some values are null", () => {
        const mockObjValuesUnitedWithNull = jest.fn(objValuesUnitedWithNull);

        const arg_1 = {
            id: "asdfasdfasdfasdfa",
            email: "asdfasd@adfgsdf",
            password: "asdfasdfasdf",
            name: undefined,
            surname: undefined
        };

        const result_1 = {
            id: "asdfasdfasdfasdfa",
            email: "asdfasd@adfgsdf",
            password: "asdfasdfasdf",
            name: null,
            surname: null
        };

        mockObjValuesUnitedWithNull(arg_1);

        expect(mockObjValuesUnitedWithNull.mock.results[0].value).toEqual(result_1);
    });
});