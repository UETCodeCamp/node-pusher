const request = require('request-promise-native')

const submitHost = process.env.SUBMIT_HOST || 'http://localhost:3000'
const submitToken = process.env.SUBMIT_TOKEN || '123'
console.log('Submit app:', submitHost, submitToken)

const instance = request.defaults({
    baseUrl: submitHost,
    headers: {
        'x-token': submitToken
    }
})

const _request = async (options = {}) => {
    const defaultOpts = {
        uri: '/runners/submit',
        method: 'POST',
    }
    const opts = Object.assign({}, defaultOpts, options)

    try {
        return await instance(opts)
    } catch (error) {
        throw error
    }
}

exports.submit = async (result) => {
    const obj = Object.assign({}, result)
    const runId = obj.id || obj.job_id || process.env.JOB_ID || ''
    console.log('Submit with job id:', runId)

    try {
        await _request({
            uri: '/submit',
            method: 'POST',
            body: {
                id: runId,
                result,
            },
            json: true
        })
    } catch (error) {
        console.log('Submit error:', error.message)

        return false
    }

    return true
}
