const { exec } = require('child_process')
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
module.exports.promiseExec=promiseExec