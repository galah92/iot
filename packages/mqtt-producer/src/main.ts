import * as mqtt from 'async-mqtt';

(async () => {
  try {
    const client = await mqtt.connectAsync('mqtt://localhost', {
      username: 'device',
      password: 'password',
    });
    const [grant] = await client.subscribe('devices/device/command', { qos: 0 });
    if (grant.qos === 0x80) {
      throw new Error(`Failed subscribing to ${grant.topic}`);
    }
    console.log(grant);
    let i = 0;
    /* eslint-disable no-constant-condition */
    while (i < 10000) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const deviceState = { a: 'AA', b: 'BBB', c: 32 };
      const stateTopic = 'devices/device/state';
      await client.publish(stateTopic, JSON.stringify(deviceState));
      await client.publish(stateTopic, JSON.stringify(deviceState));
      const badTopic = 'devices/device/bad';
      await client.publish(badTopic, JSON.stringify(deviceState));
      console.log(i);
      i++;
    }
    // client.end();
  } catch (error) {
    console.log(error);
  }
})();
