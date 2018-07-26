const {getNewTagName} = require('./urlOptions')
const {promiseExec} =require('./execOptions')

module.exports.updateVersion=()=>getNewTagName().then(({newTag})=>{
    return promiseExec('git add .')
        .then(()=>promiseExec(`git commit -m "release ${newTag}"`))
        .then(()=>promiseExec(`git tag -a "${newTag}" -m "updating to ${newTag}"`))
        .then(()=>promiseExec(`git push --follow-tags origin master`))
})
