import fs from "fs";
import path from "path";
import gotx from "got";
import crypto from "node:crypto";
import archiver from "archiver";
const got = gotx.extend({
  headers: {
    "user-agent":
      "RMPR/1.0.0 Mozilla/5.0 AppleWebKit/537.36 Chrome/63.0.3239.132 Safari/537.36",
  },
});

//console.log((await got.get('https://api.modrinth.com/v2/version_file/80520a596f3d2e7dc744591dae257dc87aaa204e')).body)

export async function modrinth(sf, pathx) {
  /*for (let i = 0; i < sf.length; i++) { //通过SHA1获取下载链接、文件大小、项目ID
    //console.log(fs.readdirSync(sf[i]))
    const hash = crypto.createHash("sha1").update(sf[i]).digest("hex");
    await got.get(`https://api.modrinth.com/v2/version_file/${hash}`);
    console.log(`哈希结果: ${hash}`);
  }*/
  console.log(sf);
  const zipfile = fs.createWriteStream("1.zip");
  const archive = archiver("zip", {
    zlib: { level: 0 },
  });
  zipfile.on("close", () => {
    console.log(archive.pointer() + " total bytes");
  });
  archive.pipe(zipfile);

  for (let i = 0; i < sf.length; i++) {
    //console.log(path.basename(sf[i]))
    //archive.finalize(sf[i], { name: path.basename(sf[i]) });
    if (fs.statSync(sf[i]).isDirectory()) {
      //文件夹
      archive.directory(sf[i], `overrides/${path.basename(sf[i])}`);
    } else {
      //文件
      archive.append(fs.createReadStream(sf[i]), {
        name: path.basename(sf[i]),
      });
    }
  }
  for (let i = 0; i < sf.length; i++) {
    archive.directory(sf[i], `overrides/${path.basename(sf[i])}`);
  }
  await archive.finalize();
}
//modrinth(['C:\\PCL2\\mymodpack\\versions\\hsys2.0\\config','C:\\PCL2\\mymodpack\\versions\\hsys2.0\\kubejs'],"C:\PCL2\mymodpack\versions\hsys2.0\kubejs")
