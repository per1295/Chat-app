declare module "*.scss";

declare module globalThis {
    import type { Connection } from "mysql2/promise";

    // Server side
    export var connection: Connection;

    // Client side
    export var bootstrapPromise: Promise<any>;
    export var isFetcheing: boolean;
}

declare module window {

}