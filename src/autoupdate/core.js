import got from 'got';
import { config } from '../config/core.js';
import { i18ns } from '../i18n/core.js'
const i18n = i18ns()

export async function checkupdate(){
try{
const latestv = JSON.parse((await got.get("https://rmpr.starnetx.top/api/latest.json",{headers:{"User-Agent":`RMPR/${config.version}`}})).body).version
if (latestv !== config.version){
console.log(`\x1B[33m${i18n.check_update_tips}${latestv}`)
}
}catch(e){
    console.log(`\x1B[31mError：${i18n.check_update_error}\x1B[0m`)
}
}