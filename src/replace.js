const readline = require('readline')
const {getNewTagName, url, httpOptions}=require('./urlOptions')
const request=require('request')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const git = require('simple-git')()

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
      getNewTagName().then(({oldTag})=>{
        let remote
        return git
        .getRemotes(true, (err, results)=>{
          remote=results.find(({name})=>name==='origin').refs.push
        })
        .add('.')
        .commit(`release ${oldTag}`)
        .exec(()=>getReleaseId(oldTag).then(deleteRelease))
        .tag(['-d', oldTag])
        .push(remote, 'origin', ['--delete', oldTag])
        .tag(['-a', oldTag, '-m', `updating to ${oldTag}`])
        .pushTags(remote)
      })
      .then(resolve)
      .catch(reject)
    }
    else{
      resolve("Cancelled")
    }
  })
})
module.exports.replace=replace
