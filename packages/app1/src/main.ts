
import * as mqtt from 'async-mqtt';

const client = mqtt.connect('mqtt://mqtt');

client.on('error', (error: Error) => {
  console.log(error);
});

client.on('connect', async () => {
  console.log('CONNECTED');
  /* eslint-disable no-constant-condition */
  let i = 0;
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await client.publish('mytopic', `Hello HiveMQ (${i})`);
    i++;
  }
  client.end();
});
