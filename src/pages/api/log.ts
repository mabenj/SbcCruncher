export class Log{
    static info(message: string){
        console.log(message);
    }

    static warn(message: string){
        console.warn(message);
    }

    static error(message: string, error?: unknown){
        console.error(message, error);
    }
}