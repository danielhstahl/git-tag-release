const username = require('git-username')()
const reponame = require('git-repo-name').sync()
const request=require('request')
const url=`https://api.github.com/repos/${username}/${reponame}/releases`

//const repoUrl=`https://github.com/${username}/`

module.exports.url=url
const options=url=>({
    url,
    headers: {
        'User-Agent': reponame
    }
})
module.exports.httpOptions=options

const getNewTagName=()=>new Promise((resolve, reject)=>{
    console.log(url)
    request(options(`${url}/latest`), (err, _, body)=>{
        if(err){
            reject(err)
        }
        else{
            const v=JSON.parse(body)
            let newTag
            let oldTag
            if(v.message==='Not Found'||!v.tag_name){
                console.log("First time, setting new tag to v1")
                newTag='v1'
            }
            else {
                const {tag_name}=v
                const updateTag=parseInt(tag_name.replace('v', ''), 10)+1
                console.log("Setting new tag to", updateTag)
                newTag=`v${updateTag}`
                oldTag=tag_name
            }
            console.log(`New tag: ${newTag}, old tag: ${oldTag}`)
            if(!newTag){
                reject("Requires new tag to be defined")
            }
            resolve({newTag, oldTag})
        }
    })
})

module.exports.getNewTagName=getNewTagName