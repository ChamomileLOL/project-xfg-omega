// traffic.js
const autocannon = require('autocannon');
autocannon({
  url: 'http://localhost:3000/evolve',
  connections: 100,
  duration: 30,
  method: 'POST',
  body: JSON.stringify({ type: "CHAOS" })
}, console.log);