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
      name: `_sip._tls.${domain}`,
      content: '1\t443\tsipdir.online.lync.com',
      ttl: 1,
      data: { 
        service: '_sip',
        proto: '_tls',
        name: 'ajcmediaworks.com',
        priority: 100,
        weight: 1,
        port: 443,
        target: 'sipdir.online.lync.com' 
      }
  }

// Expected vs actual record	Service	Protocol	Port	Weight	Priority	TTL	Name	Target	Status
//   Expected record	 _sip	 _tls	 443	 1	 100	 3600	 @	 sipdir.online.lync.com	No records found
//  Actual record		Missing record
//   Expected record	 _sipfederationtls	 _tcp	 5061	 1	 100	 3600	 @	 sipfed.online.lync.com	No records found
//  Actual record		Missing record

    // {
    //   type: 'MX',
    //   name: '@',
    //   content: `${domain.replace('.','-')}.mail.protection.outlook.com`
    // },
    // {
    //   type: "TXT",
    //   name: '@',
    //   content: 'v=spf1 include:spf.protection.outlook.com -all',
    //   ttl: 3600
    // },
    // {
    //   type: 'CNAME',
    //   name: 'sip',
    //   content: 'sipdir.online.lync.com',
    //   ttl: 3600
    // },
    // {
    //   type: 'CNAME',
    //   name: 'lyncdiscover',
    //   content: 'webdir.online.lync.com',
    //   ttl: 3600
    // },
    // {
    //   type: 'CNAME',
    //   name: 'msoid',
    //   content: 'clientconfig.microsoftonline-p.net',
    //   ttl: 3600
    // },
    // {
    //   type: 'CNAME',
    //   name: 'enterpriseregistration',
    //   content: 'enterpriseregistration.windows.net',
    //   ttl: 3600
    // },
    // {
    //   type: 'CNAME',
    //   name: 'enterpriseenrollment',
    //   content: 'enterpriseenrollment.manage.microsoft.com',
    //   ttl: 3600
    // }
  ]
};