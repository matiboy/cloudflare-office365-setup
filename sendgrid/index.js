let get = require('lodash/get');
let domain = get(process.argv, '4', '');

var exports = module.exports = {
  whitelabel: {
    add: [{
        type: 'CNAME',
        name: 'email',
        content: `${process.argv[5]}.sendgrid.net`,
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: 's1._domainkey',
        content: `s1.domainkey.${process.argv[5]}.sendgrid.net`,
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: 's2._domainkey',        
        content: `s2.domainkey.${process.argv[5]}.sendgrid.net`,
        ttl: 3600
      }],
    meta: {
      description: 'Whitelabel a domain on Sendgrid.',
      arguments: ['Domain name', 'Send grid code e.g. u6132568.wl069']
    }
  }
};
