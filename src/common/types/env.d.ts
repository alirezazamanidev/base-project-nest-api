declare namespace NodeJS {
    interface ProcessEnv {
        NodeEnv: string
        DB_TYPE:string
        DB_HOST:string
        DB_PASSWORD:string
        DB_PORT:number,
        DB_USERNAME:string
        DB_NAME:string        
        APP_PORT:number
        APP_TYPE:string
        APP_HOST:string
       
        URL_CLIENT:string
    }
}