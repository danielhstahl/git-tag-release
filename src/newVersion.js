const {getNewTagName} = require('./urlOptions')
const {chainCommands}=require('./gitCommands')
module.exports.updateVersion=()=>getNewTagName().then(({newTag})=>chainCommands(newTag))


