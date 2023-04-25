import type { NextApiHandler } from "next";
import type { ExtendedHandlerHandlers } from "src/types/functions";
import type { Method } from "axios";

import { createConnection } from "mysql2/promise";

export class ExtendedHandler {
    private readonly handlers: ExtendedHandlerHandlers = {};

    private async mySQL() {
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

    private method(method: Lowercase<Method>, handler: NextApiHandler) {
        this.handlers[method] = handler;
    }

    public methodGET(handler: NextApiHandler) {
        this.method("get", handler);
        return this;
    }

    public methodPOST(handler: NextApiHandler) {
        this.method("post", handler);
        return this;
    }

    public methodPUT(handler: NextApiHandler) {
        this.method("put", handler);
        return this;
    }

    public methodPATCH(handler: NextApiHandler) {
        this.method("patch", handler);
        return this;
    }

    public methodDELETE(handler: NextApiHandler) {
        this.method("delete", handler);
        return this;
    }

    public getExtendedHandler() {
        const extendedHandler: NextApiHandler = async (req, res) => {
            try {
                const method = req.method?.toLowerCase() as Lowercase<Method>;
                await this.mySQL();
                await this.handlers[method]?.call(this, req, res);
            } catch (error) {
                const e = error as Error;

                console.error(e);

                res.status(404).send(e.message);
            }
        }

        return extendedHandler;
    }
}