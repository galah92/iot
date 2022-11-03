import * as amqplib from 'amqplib';
import { Client } from 'pg';

(async () => {
  const client = new Client({
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
    host: process.env.POSTGRESQL_HOST,
  });
  await client.connect();

  const amqpUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost';
  const conn = await amqplib.connect(amqpUrl);
  const channel = await conn.createChannel();

  const rmqEventExchange = 'amq.rabbitmq.event';
  const rmqEventQueue = 'connection.*';
  await channel.assertQueue(rmqEventQueue);
  channel.bindQueue(rmqEventQueue, rmqEventExchange, rmqEventQueue);
  channel.consume(
    rmqEventQueue,
    (msg) => {
      if (!msg) {
        console.log('Consumer cancelled by server');
      } else {
        type ConnectionEvent = 'created' | 'closed';
        const event = msg.fields.routingKey.split('.')[1] as ConnectionEvent;
        const consumerTag = msg.fields.consumerTag;
        const user = msg.properties.headers.user as string | undefined;
        const protocol = msg.properties.headers.protocol as string | undefined;
        const isMqttClient = protocol ? protocol.includes('MQTT') : false;
        console.log(`${event} | ${consumerTag} | ${user} | ${isMqttClient}`);
        if (event == 'created' && isMqttClient) {
          // insert the data to DB
        } else if (event == 'closed') {
          // update the data in DB
        }
      }
    },
    { noAck: true }
  );

  const rmqMqttExchange = 'amq.topic';
  const deviceStateQueue = 'devices.*.state';
  await channel.assertQueue(deviceStateQueue);
  channel.bindQueue(deviceStateQueue, rmqMqttExchange, deviceStateQueue);
  channel.consume(
    deviceStateQueue,
    (msg) => {
      if (!msg) {
        console.log('Consumer cancelled by server');
      } else {
        const [, deviceId] = msg.fields.routingKey.split('.');
        const deviceState = msg.content.toString();
        console.log(`[${deviceId}] [${deviceState}]`);

        client.query(
          `
        INSERT INTO devices (device_id, state, state_updated_at)
        VALUES($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT(device_id) DO UPDATE SET state = EXCLUDED.state, state_updated_at = CURRENT_TIMESTAMP
        `,
          [deviceId, deviceState],
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    },
    { noAck: true }
  );
})();
