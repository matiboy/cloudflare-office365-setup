let get = require('lodash/get');
let domain = get(process.argv, '4', '');
var exports = module.exports = {
  verify: {
    meta: {
      description: 'Adds a CNAME and a TXT, actually an SPF'
    },
    add: [{
      type: "CNAME",
      name: `k1._domainkey.${domain}`,
      content: 'dkim.mcsv.net',
      ttl: 3600
    },
    {
      type: "TXT",
      name: '@',
      content: 'v=spf1 include:servers.mcsv.net ?all'
    }]
  }
};