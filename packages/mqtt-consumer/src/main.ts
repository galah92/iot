import * as mqtt from 'async-mqtt';

(async () => {
  try {
    const client = await mqtt.connectAsync('mqtt://localhost', {
      username: 'device',
      password: 'password',
    });
    console.log('CONNECTED');

    client.on('message', (topic, message) => {
      console.log(`MESSAGE [${topic}] [${message.toString()}]`);
    });
    // await client.subscribe('bla/telemetry/events');
    const [grant] = await client.subscribe('devices/deviceId/config');
    console.log(grant);

    // client.end();
  } catch (error) {
    console.log(error);
  }
})();
