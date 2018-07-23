const username = require('git-username')()
const reponame = require('git-repo-name').sync()
const request=require('request')

const url=`https://api.github.com/repos/${username}/${reponame}/releases`

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
            if(v.message==='Not Found'||!v.tag_name){
                reject(v.message)
            }
            else {
                const {tag_name}=v
                const updateTag=tag_name.replace('v', '')+1
                const newTag=`v${updateTag}`
                resolve({newTag, oldTag:tag_name})
            }
        }
    })
})

module.exports.getNewTagName=getNewTagName