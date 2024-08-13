export default class ApplicationError extends Error {
    static KEY: string = "ApplicationError"
    type: string
    constructor(message: string, type: string) {
        super(message)
        this.type = type
    }
}