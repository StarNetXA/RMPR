import fs from 'fs'
const systemLanguage = Intl.DateTimeFormat().resolvedOptions().locale;
//const systemLanguage = "en-US"
const path = "./src/i18n/assets/"

export function i18ns(){
try{
    if(fs.existsSync(`${path}${systemLanguage}.json`)){
       return JSON.parse(fs.readFileSync(`${path}${systemLanguage}.json`))
    } else{
       return JSON.parse(fs.readFileSync(`${path}zh-CN.json`))
    }
}catch(e){}
}