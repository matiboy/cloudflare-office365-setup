let get = require('lodash/get');
let domain = get(process.argv, '4', '')
let subdomain = get(process.argv, '5', '')

var exports = module.exports = {
  verify: {
    add: [{
        type: 'TXT',
        name: subdomain || '@',
        content: 'v=spf1 include:mailgun.org ~all',
        ttl: 3600
      },
      {
        type: 'TXT',
        name: `mx._domainkey${subdomain ? '.' + subdomain : ''}`,
        content: `k=rsa; p=${process.argv[6]}`,
        ttl: 3600
      },
      {
        type: 'MX',
        name: subdomain || '@',        
        content: 'mxa.mailgun.org',
        ttl: 3600
      },
      {
        type: 'MX',
        name: subdomain || '@',        
        content: 'mxb.mailgun.org',
        ttl: 3600
      }],
    meta: {
      description: 'Verify a domain on Mailgun.',
      arguments: ['Domain name', 'Subdomain name if any', 'Mailgun TXT code (very long random string)']
    }
  }
};
