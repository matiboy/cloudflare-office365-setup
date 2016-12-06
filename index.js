var colors = require('colors');
var CFClient = require('cloudflare');
var actions =require('./office365');
var client = new CFClient({
    email: process.env.CF_USERNAME,
    key: process.env.CF_API_KEY
});
var pick = require('lodash/pick');


console.log(`Connecting to CloudFlare as ${process.env.CF_USERNAME.magenta}`);
const [domain, action] = [process.argv[3], process.argv[2]];
console.log(actions)
// Try and grab zone, else create it
client.browseZones({name: domain})
.then(zones => {
  if(zones.count) {
    return zones.result[0];
  }
  return client.addZone({
    name: domain
  }).then(resp => resp.result);
})
.then(zone => {
  let dnsProperties = actions[action];
  // Add all the properties
  let series = Promise.resolve(true);
  dnsProperties.forEach(prop => {
    prop.zoneId = zone.id;
    let record = CFClient.DNSRecord.create(prop);
    rr = record;
    console.log(pick(rr.toJSON({useAliases: true}), ['type', 'name', 'content', 'ttl', 'proxied', 'priority']));
    series = series.then(_ => client.addDNS(record).then(x => console.log(x)).catch(function(err) { console.log('Failed', err.response.body, err.response.body.errors[0].error_chain)}));
  });
  return series;
})
.then(_ => console.log('Completed'.green));
/*
{
  "id": "372e67954025e0ba6aaa6d586b9e0b59",
  "type": "MX",
  "name": "example.com",
  "content": "mx.example.com",
  "proxiable": true,
  "proxied": false,
  "ttl": 120,
  "locked": false,
  "zone_id": "023e105f4ecef8ad9ca31a8372d0c353",
  "zone_name": "example.com",
  "created_on": "2014-01-01T05:20:00.12345Z",
  "modified_on": "2014-01-01T05:20:00.12345Z",
  "data": {},
  "priority": 10
}

{ id: '',
  type: 'MX',
  name: '@',
  content: 'tvrsvp-com.mail.protection.outlook.com',
  proxiable: false,
  proxied: false,
  locked: false,
  zoneId: '39b045f411177f2f5163127cd77b9cd3',
  zoneName: '',
  createdOn: '2016-12-05T06:01:51.932Z',
  modifiedOn: '2016-12-05T06:01:51.932Z' }
  */