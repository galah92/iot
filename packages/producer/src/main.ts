import * as mqtt from 'async-mqtt';

const client = mqtt.connect('mqtt://localhost');

client.on('error', (error: Error) => {
  console.log(error);
});

client.on('connect', async () => {
  console.log('CONNECTED');
  /* eslint-disable no-constant-condition */
  let i = 0;
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await client.publish('mytopic', `Hello RabbitMQ (${i})`);
    i++;
  }
  client.end();
});
