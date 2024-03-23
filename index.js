const {Octokit} = require('@octokit/rest')
const Giphy = require('giphy-api')
const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
    try{
        const githubToken = core.getInput('github-token')
        const giphyApiKey = core.getInput('giphy-api-token')

        const octokit = new Octokit({auth: githubToken })
        const giphy = new Giphy(giphyApiKey)

        const context = github.context
        const {owner, repo, number } = context.issue
        const prComment = await giphy.random('thank you')


        await octokit.issues.createComment({
            owner,
            repo,
            issue_number: number,
            body: `###PR - ${number} \n ### THANK YOU FOR THE CONTRIBUTION~ \n ![Giphy](${prComment.data.images.downsized.url})`
        });

        core.setOutput('comment-url', `${prComment.data.images.downsized.url}`)
        console.log(`Giphy GIF added successfully`)

    }catch(error){
        console.error('Error:', error)
        process.exit(1)
    }
}