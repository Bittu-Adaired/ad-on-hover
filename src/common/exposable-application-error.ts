import ApplicationError from "./application-error"

export default class ExposableApplicationError extends ApplicationError {
    static KEY: string = "ExposableApplicationError"
    constructor(message: string) {
        super(message, ExposableApplicationError.KEY)
    }
}