#!/usr/bin/env node
const {updateVersion}=require('../src/newVersion')
const {replace}=require('../src/replace')
const args=process.argv

if(args.length===1){
    console.log("Enter a choice!  Either \"new\" or \"replace\"")
}
else {
    let [, choice]=args
    if(choice==='new'){
        updateVersion()
    }
    else if(choice==='replace'){
        replace()
    }
}