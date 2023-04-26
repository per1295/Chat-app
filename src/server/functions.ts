import { createConnection } from "mysql2/promise";
import { capitalize } from "src/utils/functions";
import { normalizeBase64 } from "src/globalUtils/functions";

import type { NextApiResponse, GetServerSideProps } from "next";
import type { CookieOptions, BufferTypes } from "src/types/functions";
import type { AnyObject, ErrorProps } from "src/types/functions";

export async function mysql() {
    if ( !globalThis.connection ) {
        const connection = await createConnection({
            host: process.env.MYSQL_HOST || "localhost",
            user: process.env.MYSQL_USER || "root",
            password: process.env.MYSQL_PASSWORD || "T6QCmL8PQSTG5CWW",
            database: process.env.MYSQL_DATABASE || "chat_app",
            namedPlaceholders: true
        });

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users(
                id VARCHAR(20) PRIMARY KEY,
                email VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(50) NOT NULL,
                birth DATETIME NOT NULL,
                status TEXT NOT NULL,
                name VARCHAR(30) DEFAULT NULL,
                surname VARCHAR(30) DEFAULT NULL,
                profileImage LONGBLOB DEFAULT NULL
            )
        `);

        await connection.execute(`
           CREATE TABLE IF NOT EXISTS chats(
                id VARCHAR(20) PRIMARY KEY,
                firstMember VARCHAR(20),
                secondMember VARCHAR(20),
                CONSTRAINT FK_firstMember
                FOREIGN KEY (firstMember)
                REFERENCES users (id)
                ON DELETE CASCADE,
                CONSTRAINT FK_secondMember
                FOREIGN KEY (secondMember)
                REFERENCES users (id)
                ON DELETE CASCADE
           )     
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS messages(
                id VARCHAR(20) PRIMARY KEY,
                content LONGBLOB NOT NULL,
                type TEXT NOT NULL,
                birth DATETIME NOT NULL,
                status TEXT NOT NULL,
                idOfSender VARCHAR(20),
                idOfChat VARCHAR(20),
                CONSTRAINT FK_idOfSender
                FOREIGN KEY (idOfSender)
                REFERENCES users (id)
                ON DELETE CASCADE,
                CONSTRAINT FK_idOfChat
                FOREIGN KEY (idOfChat)
                REFERENCES chats (id)
                ON DELETE CASCADE
            )
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS friendRequests(
                id VARCHAR(20) PRIMARY KEY,
                idOfRequester VARCHAR(20),
                idOfResponser VARCHAR(20),
                status TEXT NOT NULL,
                CONSTRAINT FK_idOfRequester
                FOREIGN KEY (idOfRequester)
                REFERENCES users (id)
                ON DELETE CASCADE,
                CONSTRAINT FK_idOfResponser
                FOREIGN KEY (idOfResponser)
                REFERENCES users (id)
                ON DELETE CASCADE
            )
        `);

        globalThis.connection = connection;
    }
}

export function getRandomId() {
    let result = "";

    const letters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const upperCaseLetters = letters.toUpperCase();

    const symbols = letters.concat(upperCaseLetters, numbers);

    function getRandomIndex() {
        const rand = Math.random();

        if ( rand !== 1 ) {
            return Math.floor(rand * symbols.length);
        } else {
            return Math.floor(rand * symbols.length - 1);
        }
    }

    for ( let i = 0; i < 20; i++ ) {
        const randomIndex = getRandomIndex();

        result += symbols[randomIndex];
    }

    return result;
}

export function setCookies(res: NextApiResponse, cookies: AnyObject, opts?: CookieOptions) {
    let parsedOptions = "";

    if ( opts ) {
        parsedOptions = Object
        .entries(opts)
        .reduce((prevStr, [name, value]) => {
            if ( name === "maxAge" ) {
                name = "Max-Age";
                value = Math.floor(value / 1000);
            }
            if ( value instanceof Date ) value = value.toUTCString();

            return `${prevStr} ${capitalize(name)}=${value};`;
        }, "")
        .trim()
        .replace(/\;$/, "");
    }

    const arrCookies = Object.entries(cookies).map(([name, value]) => `${name}=${value}; ${parsedOptions}`);

    res.setHeader("Set-Cookie", arrCookies);
}

export function getServerSidePropsWrapper<TypeOfProps extends AnyObject>(func: GetServerSideProps<TypeOfProps>) {
    const wrapper: GetServerSideProps<TypeOfProps | ErrorProps> = async context => {
        try {
            await mysql();

            return await func(context);
        } catch (error) {
            const e = error as Error;

            return {
                props: {
                    errorName: e.name,
                    errorMessage: e.message
                }
            }
        }
    }

    return wrapper;
}

export function stringToBuffer(type: BufferTypes, content: string) {
    let parsedContent: Buffer;

    switch(type) {
        case "text":
        case "audio":
            parsedContent = Buffer.from(content);
            break;
        default:
            parsedContent = Buffer.from(content, "base64");
            break;
    }

    return parsedContent;
}

export function bufferToString(type: BufferTypes, buffer: Buffer) {
    let content: string;

    switch(type) {
        case "text":
        case "audio":
            content = buffer.toString();
            break;
        default:
            content = normalizeBase64(buffer.toString("base64"));
            break;
    }

    return content;
}