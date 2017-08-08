let get = require('lodash/get');
let domain = get(process.argv, '4', '');
let newIp = get(process.argv, '5', '');

var exports = module.exports = {
  replace_A: {
    meta: {
      description: 'Replace values for A records'
    },
    update: [{
      type: "A",
      value: newIp
    }]
  }
};
