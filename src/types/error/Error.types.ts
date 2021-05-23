export enum HTTPStatusCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500, 
}

export class BaseError extends Error {
    public readonly name: string
    public readonly httpCode: HTTPStatusCode;
    public readonly errorDescription: string;

    public get formatted(): string {
        return `[${this.httpCode}] ${this.name}: ${this.errorDescription}`
    }
    
    constructor(name: string, httpCode: HTTPStatusCode, description: string) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        
        this.name = name;
        this.errorDescription = description;
        this.httpCode = httpCode;
        
        Error.captureStackTrace(this);
    }

}

export class HTTP400Error extends BaseError {
    constructor(description: string) {
        super(`Bad Request`, HTTPStatusCode.BAD_REQUEST, description);
    }
}

export class HTTP401Error extends BaseError {
    constructor(description: string) {
        super(`Unauthorized`, HTTPStatusCode.UNAUTHORIZED, description);
    }
}

export class HTTP404Error extends BaseError {
    constructor(description: string) {
        super(`Not Found`, HTTPStatusCode.NOT_FOUND, description);
    }
}

export class HTTP422Error extends BaseError {
    constructor(description: string) {
        super(`Unprocessable Entity`, HTTPStatusCode.UNPROCESSABLE_ENTITY, description);
    }
}

export class HTTP500Error extends BaseError {
    constructor(description: string) {
        super(`Internal Server Error`, HTTPStatusCode.INTERNAL_SERVER_ERROR, description);
    }
}