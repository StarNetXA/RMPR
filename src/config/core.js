import fs from 'fs';
class Config {
    version = JSON.parse(fs.readFileSync("./package.json")).version
}

export const config = new Config()