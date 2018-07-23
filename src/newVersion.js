const {url, httpOptions} = require('./mergeHandler')

const { exec } = require('child_process')

const request=require('request')

const promiseExec=command=>new Promise((resolve, reject)=>{
    exec(command, (err, stdout, stderr)=>{
        if(err||stderr){
            reject(err||stderr)
        }
        else{
            resolve(stdout)
        }
    })
})
const getNewTagName=()=>new Promise((resolve, reject)=>{
    console.log(url)
    request(httpOptions(`${url}/latest`), (err, _, body)=>{
        if(err){
            reject(err)
        }
        else{
            console.log(body)
            const {tag_name}=JSON.parse(body)
            const updateTag=tag_name.replace('v', '')+1
            const newTag=`v${updateTag}`
            resolve({newTag, oldTag:tag_name})
        }
    })
})


module.exports.promiseExec=promiseExec
module.exports.getNewTagName=getNewTagName

module.exports.updateVersion=()=>getNewTagName().then(({newTag})=>{
    return promiseExec('git add .')
        .then(()=>promiseExec(`git commit -m "release ${newTag}"`))
        .then(()=>promiseExec(`git tag -a "${newTag}" -m "updating to ${newTag}"`))
        .then(()=>promiseExec(`git push --follow-tags origin master`))
}).catch(err=>console.log(err))
