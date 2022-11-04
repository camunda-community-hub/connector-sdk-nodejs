export function log(msg: any) {
    if (process.env.LOG_LEVEL == "INFO") {
        console.log(msg);
    }
}
