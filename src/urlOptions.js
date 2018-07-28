const username = require('git-username')()
const reponame = require('git-repo-name').sync()
const request=require('request')
const readline = require('readline')
const url=`https://api.github.com/repos/${username}/${reponame}/releases`

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

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
                newTag='v1'
            }
            else {
                const {tag_name}=v
                const updateTag=tag_name.replace('v', '')+1
                newTag=`v${updateTag}`
                oldTag=tag_name
            }
            resolve({newTag, oldTag})
        }
    })
})

const getCreds=()=>new Promise((resolve, _)=>{
    rl.question("Enter Username:", username=>{
        rl.question("Enter Password:", password=>{
            resolve({username, password})
        })
    })
})

module.exports.getNewTagName=getNewTagName
module.exports.getCreds=getCreds