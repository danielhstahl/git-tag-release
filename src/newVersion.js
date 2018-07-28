const {getNewTagName} = require('./urlOptions')
const git = require('simple-git')()

module.exports.updateVersion=()=>getNewTagName().then(({newTag})=>{
    let remote
    return git
    .getRemotes(true, (err, results)=>{
        remote=results.find(({name})=>name==='origin').refs.push
    })
    .add('.')
    .commit(`release ${newTag}`)
    .tag(['-d', newTag])
    .tag(['-a', newTag, '-m', `updating to ${newTag}`])
    .pushTags(remote)
})
