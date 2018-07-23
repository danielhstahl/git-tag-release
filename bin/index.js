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
    if(choice==='new'){
        updateVersion().then(()=>{
            console.log("Update Complete")
        }).catch(err=>{
            console.log(`Update errored with ${err}`)
        }).finally(()=>{
            process.exit()
        })
    }
    else if(choice==='replace'){
        replace().then(()=>{
            console.log("Replacement Complete")
        }).catch(err=>{
            console.log(`Replacement errored with ${err}`)
        }).finally(()=>{
            process.exit()
        })
    }
    else {
        console.log(`Choice ${choice} is invalid!  Try "new" or "replace"`)
        process.exit()
    }
}