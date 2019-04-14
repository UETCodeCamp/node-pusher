# Node Pusher for Whois Runner

## Super simple to use.

- Variable environments will be automatically loaded into package:
```dotenv
SUBMIT_HOST=http://localhost:2000
SUBMIT_SECRET=xxxx
```


- Pushing the job result back to system:
```js
const pusher = require('@uet/pusher');
pusher.submit({
    id: 'job_id',
    is_pass:true, // or false
    message: '',
    std_out: '',
    std_err: ''
})
```

- You can change settings to override default settings by the way:
```js
pusher.settings({
    host: 'https://another-host.com',
    secret: 'another_secret'
})
```


## License

MIT © [UET Code Camp](https://github.com/UETCodeCamp)
