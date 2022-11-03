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
    while (i < 1) {
      console.log(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const topic = 'devices/id_abc/state';
      const deviceConfig = { a: 'AA', b: 'BBB', c: 32 };
      await client.publish(topic, JSON.stringify(deviceConfig));
      i++;
    }
    // client.end();
  } catch (error) {
    console.log(error);
  }
})();
