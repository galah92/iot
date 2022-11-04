import * as mqtt from 'async-mqtt';

(async () => {
  try {
    const client = await mqtt.connectAsync('mqtt://localhost', {
      username: 'device',
      password: 'password',
    });
    const [grant] = await client.subscribe('bar', { qos: 0 });
    if (grant.qos === 0x80) {
      throw new Error(`Failed subscribing to ${grant.topic}`);
    }
    console.log(grant);
    let i = 0;
    /* eslint-disable no-constant-condition */
    while (i < 10000) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const topic = 'bar';
      const deviceConfig = { a: 'AA', b: 'BBB', c: 32 };
      await client.publish(topic, JSON.stringify(deviceConfig));
      console.log(i);
      i++;
    }
    // client.end();
  } catch (error) {
    console.log(error);
  }
})();
