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
        updateVersion()
    }
    else if(choice==='replace'){
        replace()
    }
    else {
        console.log(`Choice ${choice} is invalid!  Try "new" or "replace"`)
    }
}