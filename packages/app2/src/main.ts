import * as mqtt from 'async-mqtt';

const client = mqtt.connect('mqtt://mqtt');

client.on('error', (error: Error) => {
  console.log(error);
});

client.on('connect', async () => {
  console.log('CONNECTED');
  await client.subscribe('mytopic');
});

client.on('message', (topic, message) => {
  console.log(`MESSAGE [${topic}] [${message.toString()}]`);
//   client.end();
});
