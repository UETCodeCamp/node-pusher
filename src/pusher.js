const request = require('request-promise-native')


const _store = {
    settings: {
        host: process.env.SUBMIT_HOST || 'http://localhost:3000',
        token: process.env.SUBMIT_TOKEN || '123'
    }
}

const _getInstance = () => {
    const {settings} = _store
    const submitHost = settings.host || ''
    const submitToken = settings.token || ''

    console.log('Submit app:', submitHost, submitToken)

    return request.defaults({
        baseUrl: submitHost,
        headers: {
            'x-token': submitToken
        }
    })
}

const _request = async (options = {}) => {
    const instance = _getInstance()

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

/**
 * @param settings
 * @return {{host, token}}
 */
const _settings = (settings = {}) => {
    const newSettings = Object.assign({}, settings)
    const {settings: currentSettings} = _store

    _store.settings = Object.assign({}, currentSettings, newSettings)

    return _store.settings
}

/**
 * Submit job result.
 *
 * @param result
 * @return {Promise<boolean>}
 */
const _submit = async (result) => {
    const obj = Object.assign({}, result)
    const runId = obj.id || obj.job_id || process.env.JOB_ID || ''
    console.log('Submit with job id:', runId)

    try {
        await _request({
            uri: '/runners/submit',
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

exports.submit = _submit
exports.settings = _settings
