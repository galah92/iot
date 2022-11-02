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
      //   client.end();
    });    
    // await client.subscribe('bla/telemetry/events');
    await client.subscribe('devices/device/telemetry/events');

    // client.end();
  } catch (error) {
    console.log(error);
  }
})();
