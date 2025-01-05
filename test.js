// // const inquirer = require('inquirer');

// // // 创建 prompt 函数
// // const prompt = inquirer.createPromptModule();

// // const questions = [
// //   {
// //     type: 'list',
// //     name: 'color',
// //     message: '请选择一个颜色:',
// //     choices: ['红色', '绿色', '蓝色', '黄色'],
// //     pageSize: 4,
// //     loop: false,
// //   },
// //   {
// //     type: 'list',
// //     name: 'color2',
// //     message: '请选择一个颜色:',
// //     choices: ['红色', '绿色', '蓝色', '黄色'],
// //     pageSize: 4,
// //     loop: false,
// //   }
// // ];

// // prompt(questions).then((answers) => {
// //   console.log(`你选择了: ${answers.color}`);
// // }).catch(console.error);
//  import fs from 'fs'
// // import path from 'path'
// //console.log(fs.readdirSync('C:\\PCL2\\mymodpack\\versions\\hsys2.0\\'))


// import archiver from "archiver";

// const zipfile =  fs.createWriteStream('1.zip')
//     const archive = archiver('zip', {
//         zlib: { level: 0 }
//       });
//      zipfile.on('close',()=>{
//         console.log(archive.pointer() + ' total bytes');
//       })
//       archive.pipe(zipfile)
// for(let i=0;i<sf.length;i++){
//     //console.log(path.basename(sf[i]))
//     //archive.finalize(sf[i], { name: path.basename(sf[i]) });
//     if (fs.statSync(sf[i]).isDirectory()){
//       archive.directory(sf[i], false);
//     }else{
//       //archive.append(fs.createReadStream(sf[i]), { name: path.basename(sf[i]) });
//     }
// }
//       archive.finalize();


// import { readdir, promises } from 'fs';
// import { join, dirname } from 'path';

// const currentDir = 'C:\\PCL2\\mymodpack\\versions\\hsys2.0';

// readdir(currentDir, (err, items) => {
//   if (err) {
//     return console.error('读取目录时出错:', err);
//   }

//   const folderPromises = items.map(item => {
//     const fullPath = join(currentDir, item);
//     return promises.stat(fullPath).then(stats => {
//       if (stats.isDirectory() && dirname(fullPath) === currentDir) {
//         return item;
//       }
//       return null;
//     });
//   });

//   Promise.all(folderPromises).then(folders => {
//     const filteredFolders = folders.filter(folder => folder !== null);
//     console.log('当前目录下的文件夹:', filteredFolders);
//   }).catch(err => {
//     console.error('获取状态时出错:', err);
//   });
// });


import fs from 'fs'
import path from 'path'
const pathx = "C:\\PCL2\\mymodpack\\versions\\hsys2.0\\mods"
for(let a=0;a<fs.readdirSync(pathx).length;a++){
  if (fs.statSync(`${pathx}\\${fs.readdirSync(pathx)[a]}`).isFile()){
    console.log(fs.readdirSync(pathx)[a])
  }
}
//console.log(fs.readdirSync(path.join("C:\\PCL2\\mymodpack\\versions\\hsys2.0\\kubejs")))