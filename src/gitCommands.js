const { spawn } = require('child_process')

const generic=(command, args)=>new Promise((resolve, reject)=>{
    process.stdin.setRawMode(false)
    const cm=spawn(command, args)
    let stdout
    let stderr
    cm.stdout.on('data', (data) => {
        stdout+=data
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
            resolve(stdout)
        }
    })
})

const add=fileStr=>generic('git', ['add', fileStr])
const commit=commitMsg=>generic('git', ['commit', '-m', commitMsg])
const tag=tagName=>generic('git', ['tag', '-a', tagName,  '-m', `updating to ${tagName}`])
const deleteLocalTag=tagName=>generic('git', ['tag', '-d', tagName])
const deleteRemoteTag=(tagName, remote='origin')=>generic('git', ['push', remote, '--delete', tagName])
const pushTags=(remote='origin', branch='master')=>generic('git', ['push', '--follow-tags', remote, branch])

module.exports={
    add, commit, tag, deleteLocalTag, pushTags, deleteRemoteTag
}