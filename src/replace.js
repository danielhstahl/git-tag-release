const readline = require('readline')
const {getNewTagName, url, httpOptions}=require('./urlOptions')
const request=require('request')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const {chainCommands}=require('./gitCommands')

const getReleaseId=tagName=>new Promise((resolve, reject)=>{
  request(httpOptions(`${url}/tags/${tagName}`), (err, _, body)=>{
    if(err){
      reject(err)
    }
    else{
      const v=JSON.parse(body)
      if(v.message==='Not Found'||!v.id){
        reject(v.message)
      }
      else {
        const {id}=v
        resolve(id)
      }
      
    }
  })
})

const deleteRelease=releaseId=>new Promise((resolve, reject)=>{
  request.del(httpOptions(`${url}/${releaseId}`), (err, _, body)=>{
    if(err){
      reject(err)
    }
    else{
      resolve(body)
    }
    
  })
})
const replace=()=>new Promise((resolve, reject)=>{
  rl.question("This will replace the latest release.  Continue? (Y/N)", answer=>{
    if(answer==='Y'){
      let tagToChain
      getNewTagName().then(({oldTag})=>{
        tagToChain=oldTag
        return getReleaseId(oldTag).then(deleteRelease)
      })
      .then(()=>chainCommands(tagToChain))
      .then(resolve)
      .catch(reject)
    }
    else{
      resolve("Cancelled")
    }
  })
})
module.exports.replace=replace
