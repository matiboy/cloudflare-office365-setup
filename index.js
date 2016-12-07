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
  // Add all the properties (in series, had some timeouts in parallel)
  let series = Promise.resolve(true);
  dnsProperties.forEach(prop => {
    prop.zoneId = zone.id;
    let record = CFClient.DNSRecord.create(prop);
    series = series.then(
      _ => client.addDNS(record)
           .catch(function(err) {
             console.log('Failed to add entry', err.response.body.errors[0].error_chain)
           })
      );
  });
  return series;
})
.then(_ => console.log('Completed'.green));