import archiver from 'archiver';
import fs from 'fs';
import got from 'got'
import path from 'path';
import { fingerprint } from '../lib/hashlib.js';
import { config } from './config/core.js';
export async function curseforge(
  mcv,
  modloader,
  mlver,
  mpver,
  sf,
  pathx,
  mpname,
  mpdes
){
const mload = (() => {
  switch (modloader) {
    case "Forge":
      return "forge";
    case "Fabric":
      return "fabric-loader";
    case "Neoforge":
      return "neoforge";
  }
})()
console.log(pathx)
let jtmp = [];
let tmp = [];
let rtmp = [];
  //初始化ZIP
  const zipfile = fs.createWriteStream(
    `${mpname}-${mpver}[${mcv}-${modloader}].zip`
  );
  const archive = archiver("zip", {
    zlib: { level: 0 },
  });
for (let a = 0; a < fs.readdirSync(`${pathx}\\mods`).length; a++) {
    if (
          fs
            .statSync(`${`${pathx}\\mods`}\\${fs.readdirSync(`${pathx}\\mods`)[a]}`)
            .isFile()
        ) {
            try{
            const test = path.resolve(`${pathx}\\mods\\${fs.readdirSync(`${pathx}\\mods`)[a]}`)
      jtmp.push({[a]:test}) //什么鸡巴push json
      fs.copyFileSync(test,`./temp/curseforge/${a}.jar`)
      tmp.push(await fingerprint(path.resolve(`./temp/curseforge/${a}.jar`))) //计算Hash并且push
            }catch(e){console.log(e)}
}
}
 const res = await got.post('https://api.curseforge.com/v1/fingerprints/432',{
     headers :{
 "x-api-key":"$2a$10$ydk0TLDG/Gc6uPMdz7mad.iisj2TaMDytVcIW4gcVP231VKngLBKy",
 "User-Agent":`RMPR/${config.version} Mozilla/5.0 AppleWebKit/537.36 Chrome/63.0.3239.132 Safari/537.36`,
     },
     json:{"fingerprints": tmp}
 }) //获取信息
 const resjson = JSON.parse(res.body)
const positions = tmp.filter(item => !new Set(resjson.data.exactFingerprints).has(item)).map(item => tmp.indexOf(item));
  for(let c=0;c<resjson.data.exactFingerprints.length;c++){
    const result = resjson.data.exactMatches.find(item => item.file.fileFingerprint === resjson.data.exactFingerprints[c]);
    rtmp.push({"projectID": result.file.modId,"fileID": result.file.id,"required": true})
  }
const latestjson = JSON.stringify({"minecraft": {"version": mcv,"modLoaders": [{"id": `${mload}-${mlver}`,"primary": true}]},"manifestType": "minecraftModpack","manifestVersion": 1,"name": mpname,"version": mpver,"author": mpdes,"files": rtmp, "overrides": "overrides"})
archive.append(latestjson, {
  name: `manifest.json`,
});
////本地处理？
  for (let i = 0; i < sf.length; i++) { //文件夹处理
    if (fs.statSync(sf[i]).isFile()) {
      //文件
      archive.append(fs.createReadStream(sf[i]), {
        name: `overrides/${path.basename(sf[i])}`,
      });
    } else if (fs.statSync(sf[i]).isDirectory()) {
      //文件夹
      archive.directory(sf[i], `overrides/${path.basename(sf[i])}`);
    }
  }
    for(let b=0;b<positions.length;b++){
           archive.append(fs.readFileSync(`./temp/curseforge/${positions[b]}.jar`), {
            name: `overrides/mods/${path.basename(jtmp[positions[b]][positions[b]])}`,
        });
    }
  ////压缩到curseforge的zip
  archive.pipe(zipfile);
  zipfile.on("close", () => {
    console.log(archive.pointer() + " total bytes");
  });
  await archive.finalize();
}