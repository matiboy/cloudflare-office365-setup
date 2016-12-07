let domain = process.argv[3];

var exports = module.exports = {
  verify: [{
    type: "TXT",
    name: '@',
    content: `MS=${process.argv[4]}`,
    ttl: 3600
  }],
  setup: [
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
      content: `${domain.replace('.','-')}.mail.protection.outlook.com`
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
};