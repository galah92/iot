
import * as mqtt from 'async-mqtt';

const client = mqtt.connect('mqtt://mqtt');

client.on('error', (error: Error) => {
  console.log(error);
});

client.on('connect', async () => {
  console.log('CONNECTED');
  for (const x in [1, 2, 3]) {
    x as never;
    await client.publish('mytopic', 'Hello HiveMQ');
  }
  client.end();
});