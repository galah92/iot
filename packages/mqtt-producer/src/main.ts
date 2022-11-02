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
      const queue1 = 'devices/id_abc/telemetry/events';
      await client.publish(queue1, `Hello RabbitMQ (${i})`);
      const queue2 = 'devices/id_def/telemetry/events';
      await client.publish(queue2, `Hello RabbitMQ (${i})`);
      i++;
    }
    // client.end();
  } catch (error) {
    console.log(error);
  }
})();
