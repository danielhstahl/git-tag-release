const username = require('git-username').sync()
const reponame = require('git-repo-name').sync()
const url=`https://api.github.com/repos/${username}/${reponame}/releases`

module.exports.url=url
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
    request(`${url}/latest`, (err, val)=>{
        if(err){
            reject(err)
        }
        else{
            const {tag_name}=JSON.parse(val)
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
