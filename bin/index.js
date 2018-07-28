#!/usr/bin/env node
const {updateVersion}=require('../src/newVersion')
const {replace}=require('../src/replace')
const args=process.argv
if(args.length<=2){
    console.log("Enter a choice!  Either \"new\" or \"replace\"")
    process.exit()
}
else {
    let [, , choice]=args
    switch(choice){
        case 'new':
            getCreds().then(({username, password})=>updateVersion(username, password))
            .then(()=>{
                console.log("Update Complete")
            }).catch(err=>{
                console.log(`Update errored with ${err}`)
            }).finally(()=>{
                process.exit()
            })
            break
        case 'replace':
            getCreds().then(({username, password})=>replace(username, password))
            .then(result=>{
                if(result==='Cancelled'){
                    console.log("Replacement Cancelled")
                }
                else{
                    console.log("Replacement Complete")
                }
                
            }).catch(err=>{
                console.log(`Replacement errored with ${err}`)
            }).finally(()=>{
                process.exit()
            })
            break
        default:
            console.log(`Choice ${choice} is invalid!  Try "new" or "replace"`)
            process.exit()
    }
}