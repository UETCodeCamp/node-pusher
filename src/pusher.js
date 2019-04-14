const request = require('request-promise-native')


const _store = {
    settings: {
        host: process.env.SUBMIT_HOST || 'http://localhost:3000',
        secret: process.env.SUBMIT_SECRET || '123'
    }
}

const _parseUrl = (host = '') => {
    if (!host) return ''

    return host.indexOf('http') === -1 ? `http://${host}` : host
}

const _getInstance = () => {
    const {settings} = _store
    const submitHost = _parseUrl(settings.host)
    const submitSecret = settings.secret || ''

    console.log('Submit app:', submitHost, submitSecret)

    return request.defaults({
        baseUrl: submitHost,
        headers: {
            'x-secret': submitSecret
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
 * @return {{host, secret}}
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
