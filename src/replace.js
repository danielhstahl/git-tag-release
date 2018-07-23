const readline = require('readline')
const {promiseExec, getNewTagName, url}=require('./newVersion')
const {httpOptions}=require('./mergeHandler')
const request=require('request')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const getReleaseId=tagName=>new Promise((resolve, reject)=>{
  request(httpOptions(`${url}/tags/${tagName}`), (err, _, body)=>{
    if(err){
      reject(err)
    }
    else{
      const {id}=JSON.parse(body)
      resolve(id)
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
const replace=()=>{
  rl.question("This will replace the latest release.  Continue? (Y/N)", answer=>{
    if(answer==='Y'){
      getNewTagName().then(({oldTag})=>{
        return promiseExec('git add .')
          .then(()=>promiseExec(`git commit -m "release ${oldTag}`))
          .then(()=>getReleaseId(oldTag))
          .then(deleteRelease)
          .then(()=>promiseExec(`git tag -d ${oldTag}`))
          .then(()=>promiseExec(`git push --delete origin ${oldTag}`))
          .then(()=>promiseExec(`git tag -a "${oldTag}" -m "updating to ${oldTag}`))
          .then(()=>promiseExec(`git push --follow-tags origin master`))
      })
    }
  })
}
module.exports.replace=replace
