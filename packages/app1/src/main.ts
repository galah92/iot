// import * as pg from 'pg';

// const client = new pg.Client({ user: 'postgres' })
// client.connect().then(async () => {
//     const res = await client.query('SELECT $1::text as message', ['Hello world!'])
//     console.log(res.rows[0].message) // Hello world!
//     await client.end()
// });

import * as mqtt from 'mqtt';

const client = mqtt.connect('mqtt://mqtt');

client.on('error', (error: Error) => {
  console.log(error);
});

client.on('connect', () => {
  console.log('CONNECTED');
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(message.toString());
  client.end();
});
