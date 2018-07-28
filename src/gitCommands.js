const { spawn } = require('child_process')

const generic=(command, args)=>new Promise((resolve, reject)=>{
    process.stdin.setRawMode(false)
    const cm=spawn(command, args)
    let stdout
    let stderr
    cm.stdout.on('data', (data) => {
        console.log(''+data)
    })
        
    cm.stderr.on('data', (data) => {
        stderr+=data
    })
    
    cm.on('close', (code) => {
        process.stdin.setRawMode(true)
        if(stderr){
            reject(stderr)
        }
        else{
            resolve()
        }
    })
})

const add=fileStr=>generic('git', ['add', fileStr])
const commit=commitMsg=>generic('git', ['commit', '-m', commitMsg])
const tag=tagName=>generic('git', ['tag', '-a', tagName,  '-m', `updating to ${tagName}`])
const deleteLocalTag=tagName=>generic('git', ['tag', '-d', tagName])
const deleteRemoteTag=(tagName, remote='origin')=>generic('git', ['push', '--delete', remote, tagName])
const pushTags=(remote='origin', branch='master')=>generic('git', ['push', '--follow-tags', remote, branch])


const chainCommands=tagName=>add('.')
    .then(()=>commit(`release ${tagName}`))
    .catch(_=>{
        console.log("Nothing to commit, continuing..")
    })
    .then(()=>deleteLocalTag(tagName))
    .catch(_=>{
        console.log("Tag does not exist, creating...")
    })
    .then(()=>deleteRemoteTag(tagName))
    .catch(_=>{
        console.log("No remote tag")
    })
    .then(()=>tag(tagName))
    .catch(err=>{
        console.log(err)
    })
    .then(()=>pushTags())
    .catch(err=>{
        console.log(err)
    })

module.exports={
    add, commit, tag, deleteLocalTag, pushTags, deleteRemoteTag, chainCommands
}

