import * as mqtt from 'async-mqtt';

(async () => {
  try {
    const client = await mqtt.connectAsync('mqtt://localhost', {
      username: 'device',
      password: 'password',
    });
    console.log('CONNECTED');
    let i = 0;
    /* eslint-disable no-constant-condition */
    while (true) {
      console.log(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const topic = 'devices/id_abc/telemetry/events';
      await client.publish(topic, `Hello RabbitMQ (${i})`);
      i++;
    }
    // client.end();
  } catch (error) {
    console.log(error);
  }
})();
