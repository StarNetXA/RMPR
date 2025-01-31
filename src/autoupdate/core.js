import got from 'got';
import { config } from '../config/core.js';
import { i18ns } from '../i18n/core.js'
const i18n = i18ns()

export async function checkupdate(){
try{
await got.get("https://rmpr.starnetx.top/api/latest",{headers:{"User-Agent":`RMPR/${config.version}`}})
}catch(e){
    console.log(`\x1B[31mError：${i18n.check_update_error}\x1B[0m`)
}
}