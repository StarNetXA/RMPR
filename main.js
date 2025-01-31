import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { modrinth } from "./src/modrinth.js";
import { curseforge } from "./src/curseforge.js"
import { i18ns } from "./src/i18n/core.js";
import { checkupdate } from "./src/autoupdate/core.js";
const i18n = i18ns()
await checkupdate()
const prompt = inquirer.createPromptModule();
await prompt([
  {
    type: "list",
    name: "type",
    message: i18n.qs_type,
    choices: ["Curseforge", "Modrinth", "MCBBS"],
    pageSize: 4,
    loop: false,
  },
  {
    type: "input",
    name: "version",
    message: i18n.qs_version,
    loop: false,
  },
  {
    type: "input",
    name: "mpname",
    message: i18n.qs_mpname,
    loop: false,
  },
  {
    type: "input",
    name: "mpdes",
    message: i18n.qs_mpdes,
    loop: false,
  },
  {
    type: "input",
    name: "mpversion",
    message: i18n.qs_mpversion,
    pageSize: 4,
    loop: false,
  },
  {
    type: "list",
    name: "modloader",
    message: i18n.qs_modloader,
    choices: ["Forge", "Neoforge", "Fabric"],
    pageSize: 4,
    loop: false,
  },
  {
    type: "input",
    name: "modloaderver",
    message: i18n.qs_modloaderver,
    loop: false,
  },
  {
    type: "input",
    name: "filepath",
    message: i18n.qs_filepath,
    pageSize: 4,
    loop: false,
  },
  {
    type: "checkbox",
    name: "selectedFile",
    message: i18n.qs_selectedFile,
    pageSize: 20,
    loop: false,
    choices: (answers) =>{return generateMultiSelectList(readRootDirSync(answers.filepath))},
  },
]).then(async (answers)=>{
    await makemodpack(answers.type,answers.version,answers.modloader,answers.modloaderver,answers.mpversion,answers.selectedFile,answers.filepath,answers.mpname,answers.mpdes)
});

async function makemodpack(type, version, modloader, modloaderver, mpversion, selectedFile, filepath,mpname,mpdes) {
switch(type){
    case 'Curseforge':
      await curseforge(version,modloader,modloaderver,mpversion,selectedFile,filepath,mpname,mpdes)
    break;
    case 'Modrinth':
   await modrinth(version,modloader,modloaderver,mpversion,selectedFile,filepath,mpname,mpdes)
    break;

    case 'MCBBS':
        console.log(`\x1B[31m${i18n.unsupported_MCBBS}\x1B[0m`)
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