let get = require('lodash/get');
let domain = get(process.argv, '4', '');

var exports = module.exports = {
  verify: {
    add: [{
      type: "TXT",
      name: '@',
      content: `MS=${process.argv[5]}`,
      ttl: 3600
    }],
    meta: {
      description: 'Verify a domain on Office365. First step before setting up all entries',
      arguments: ['Domain name', 'Verification code e.g. ms321321321']
    }
  },
  setup: {
    meta: {
      description: 'Adds the ~10 entries required by Office365'
    },
    add: [
      {
        type: 'SRV',
        data: { 
          service: '_sip',
          proto: '_tls',
          name: domain,
          priority: 100,
          weight: 1,
          port: 443,
          ttl: 3600,
          target: 'sipdir.online.lync.com' 
        }
    },
      {
        type: 'SRV',
        data: { 
          service: '_sipfederationtls',
          proto: '_tcp',
          name: domain,
          priority: 100,
          weight: 1,
          port: 5061,
          ttl: 3600,
          target: 'sipfed.online.lync.com' 
        }
      },
      {
        type: 'MX',
        name: '@',
        content: `${domain.replace(/\./g,'-')}.mail.protection.outlook.com`,
        ttl: 3600
      },
      {
        type: "TXT",
        name: '@',
        content: 'v=spf1 include:spf.protection.outlook.com -all',
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: 'sip',
        content: 'sipdir.online.lync.com',
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: 'autodiscover',
        content: ' autodiscover.outlook.com',
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: 'lyncdiscover',
        content: 'webdir.online.lync.com',
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: 'msoid',
        content: 'clientconfig.microsoftonline-p.net',
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: 'enterpriseregistration',
        content: 'enterpriseregistration.windows.net',
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: 'enterpriseenrollment',
        content: 'enterpriseenrollment.manage.microsoft.com',
        ttl: 3600
      }
    ]
  }
};
