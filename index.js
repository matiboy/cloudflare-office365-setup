var colors = require('colors');
var CFClient = require('cloudflare');
var actions = {
  office365: require('./office365'),
  mailchimp: require('./mailchimp'),
  cloudflare: require('./cloudflare')
};
var client = new CFClient({
    email: process.env.CF_USERNAME,
    key: process.env.CF_API_KEY
});
var pick = require('lodash/pick');
var keys = require('lodash/keys');
var get = require('lodash/get');

const [domain, action, provider] = [get(process.argv,'4'), process.argv[3], process.argv[2]];
if(provider === 'providers') {
  console.log('Available providers:');
  keys(actions).forEach(key => {
    console.log(key);
    keys(actions[key]).forEach(action => {
      console.log(`\t${action} - ${get(actions, [key, action, 'meta', 'description'], 'No description')}`);
    });
  });
  process.exit(0);
}
console.log(`Connecting to CloudFlare as ${process.env.CF_USERNAME.magenta}`);
// Try and grab zone, else create it
client.browseZones({name: domain})
.then(zones => {
  if(zones.count) {
    console.log(`Zone ${domain.magenta} found`);
    return zones.result[0];
  }
  console.log(`Zone ${domain.white} not found. Creating.`.red);
  return client.addZone({
    name: domain
  }).then(resp => resp.result);
})
.then(zone => {
  let dnsProperties = actions[provider][action];
  // Process properties - there are 3 possible keys: add, update, delete
  // ADD
  // Add all the properties (in series, had some timeouts in parallel)
  let series = Promise.resolve(true);
  get(dnsProperties, 'add', []).forEach(prop => {
    prop.zoneId = zone.id;
    let record = CFClient.DNSRecord.create(prop);
    series = series.then(
      _ => client.addDNS(record)
           .then(() => console.log(`${record.type.magenta} record added (${record.name})`))
           .catch(function(err) {
             console.log('Failed to add entry', err.response.body.errors[0].error_chain)
           })
      );
  });
  // UPDATE
  get(dnsProperties, 'update', []).forEach(prop => {
    prop.zoneId = zone.id;
    series = series.then(
      _ => {
        let query = {}
        if(prop.type) {
          query.type = prop.type
        }
        return client.browseDNS(zone, query).then(resp => resp.result)
      }
    ).then(zones => {
      let s = Promise.resolve(true);
      zones.forEach(zone => s = s.then(_ => {
        zone.content = prop.value;
        return client.editDNS(zone)
      }));
      return s;
    })
  })
  return series;
})
.then(_ => console.log('Completed'.green));
