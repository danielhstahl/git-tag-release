const yaml = require('js-yaml')
const {promisify} = require("es6-promisify")
const fs=require('fs-extra')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const readDirectory=promisify(fs.readdir)

const loadYml=data=>new Promise((resolve, reject)=>{
    yaml.safeLoadAll(data, asJson=>{
        resolve(asJson)
    })
})

module.exports.loadYml=loadYml

const updateYMLFunctions=fileName=>doc=>Object.keys(doc.functions).reduce((aggr, funcName)=>({
    ...aggr, 
    [funcName+fileName]:{
        ...doc.functions[funcName],
        handler:doc.functions[funcName].handler.replace('lambda', fileName),
        events:doc.functions[funcName].events.map(event=>({
            ...event, 
            http:{
                ...event.http,
                path:event.http.path.replace('version', fileName)
            }
        }))
    }
}), {})

const getYML=name=>readFile(`./releases/${name}/serverless.yml`, 'utf8') 
const parseFunctions=existingYmlAsJson=>folderNames=>({
    ...existingYmlAsJson,
    fnc:Promise.all(
        folderNames.map(name=>getYML(name).then(loadYml).then(updateYMLFunctions(name)))
    ),
    package:{
        ...(existingYmlAsJson.package||{}),
        include:[...((existingYmlAsJson.package||{}).include||[]), ...folderNames]
    }
})
const aggregateYMLJson=({fnc, package})=>fnc.then(ymlObj=>({...package, functions:ymlObj.reduce((aggr, doc)=>({...aggr, ...doc}), {})}))
const convertJsonToServerlessYML=ymlJson=>yaml.safeDump(ymlJson).replace(/'/g, '')

const writeToFile=ymlString=>writeFile('./releases/serverless.yml', ymlString)

module.exports.getCombinedYml=(existingYmlAsJson)=>readDirectory('./releases')
    .then(parseFunctions(existingYmlAsJson))
    .then(aggregateYMLJson)
    .then(convertJsonToServerlessYML)
    .then(writeToFile)
    .catch(err=>{
        console.log(err)
    })

