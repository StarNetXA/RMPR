import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { modrinth } from "./src/modrinth.js";

const prompt = inquirer.createPromptModule();

await prompt([
  {
    type: "list",
    name: "type",
    message: "请选择打包类型:",
    choices: ["Curseforge", "Modrinth", "MCBBS"],
    pageSize: 4,
    loop: false,
  },
  {
    type: "input",
    name: "version",
    message: "请输入Minecraft版本:",
    loop: false,
  },
  {
    type: "input",
    name: "mpname",
    message: "请输入整合包名称:",
    loop: false,
  },
  {
    type: "input",
    name: "mpdes",
    message: "请输入整合包的介绍:",
    loop: false,
  },
  {
    type: "list",
    name: "modloader",
    message: "请选择整合包的模组加载器:",
    choices: ["Forge", "Neoforge", "Fabric"],
    pageSize: 4,
    loop: false,
  },
  {
    type: "input",
    name: "modloaderver",
    message: "请选择整合包的模组加载器的版本:",
    loop: false,
  },
  {
    type: "input",
    name: "mpversion",
    message: "请输入整合包版本:",
    pageSize: 4,
    loop: false,
  },
  {
    type: "input",
    name: "filepath",
    message: "请输入Minecraft游戏版本所在路径:",
    pageSize: 4,
    loop: false,
  },
  {
    type: "checkbox",
    name: "selectedFile",
    message: "请选择一个文件:",
    pageSize: 20,
    loop: false,
    choices: (answers) =>{return generateMultiSelectList(readRootDirSync(answers.filepath))},
  },
]).then(async (answers)=>{
    //console.log(`你选择了: ${answers.selectedFile}`);
    await makemodpack(answers.type,answers.version,answers.modloader,answers.modloaderver,answers.mpversion,answers.selectedFile,answers.filepath)
});

async function makemodpack(type, version, modloader, modloaderver, mpversion, selectedFile, filepath) {
switch(type){
    case 'Curseforge':

    break;

    case 'Modrinth':
   await modrinth(selectedFile,filepath)
    break;

    case 'MCBBS':
        console.log('\x1B[31m暂不支持MCBBS整合包类型！\x1B[0m')
    break;
}

}

//底层屎山
function readRootDirSync(dir) {
    let stats = fs.statSync(dir);
    let node = {
      name: path.basename(dir),
      path: dir,
      children: []
    };
    if (stats.isDirectory()) {
      let files = fs.readdirSync(dir);
      for (let file of files) {
        let filePath = path.join(dir, file);
        let fileStats = fs.statSync(filePath);
        if(file !== '.mixin.out' && file !== '.vscode' && file !== 'mods' && file !== '.vscode' && file !== 'crash-reports' && file !== 'logs'  && !file.endsWith('.jar') && file !== 'PCL')
        if (fileStats.isDirectory()) {
          node.children.push({
            name: file,
            path: filePath,
            isDirectory: true
          });
        } else {
          node.children.push({
            name: file,
            path: filePath,
            isDirectory: false
          });
        }
      }
    }
    return node;
  }
  function generateMultiSelectList(node, prefix = '') {
    let list = [];
    if (node.children) {
      for (let child of node.children) {
        list.push({
          name: prefix + (child.isDirectory ? '📁 ' : '📄 ') + child.name,
          value: child.path,
          short: child.name
        });
        if (child.isDirectory) {
          list = list.concat(generateMultiSelectList(child, prefix + '  '));
        }
      }
    }
    return list;
  }