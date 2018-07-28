const {getNewTagName, getCreds} = require('./urlOptions')
//const {promiseExec} =require('./execOptions')
//const {promisify} = require('util')
//const simpleGit = require('simple-git')()
//const url = require('url')
const git = require('simple-git')()
/*
const add=promisify(simpleGit.add)
const commit=promisify(simpleGit.commit)
const tag=promisify(simpleGit.tag)
const getRemotes=promisify(simpleGit.getRemotes)
const pushTags=promisify(simpleGit.pushTags)*/

module.exports.updateVersion=(username, password)=>getNewTagName().then(({newTag})=>{
    let remote
    return git
    .getRemotes(true, (err, results)=>{
        const url=new URL(results.find(({name})==='origin').refs.push)
        url.password=password
        url.username=username
        remote=url.toString()
    })
    .add('.')
    .commit(`release ${newTag}`)
    .tag(['-d', newTag])
    .tag(['-a', newTag, '-m', `updating to ${newTag}`])
    .pushTags(remote)

    /*return promiseExec('git add .')
        .then(()=>promiseExec(`git commit -m "release ${newTag}"`))
        .then(()=>promiseExec(`git tag -a "${newTag}" -m "updating to ${newTag}"`))
        .then(()=>promiseExec(`git remove -v`))
        .then(remote=>{

        })
        .then(()=>promiseExec(`git push --follow-tags origin master`))*/
})
