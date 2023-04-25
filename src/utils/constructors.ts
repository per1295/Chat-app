export class FormValidationItemError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FormValidationItemError";
    }
}

export class BootstrapHookError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BootstrapHookError";
    }
}