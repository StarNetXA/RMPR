import got from 'got'
export class Config{
    static instance;



    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}

export const config = Config.getInstance();