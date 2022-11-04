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
  const rmqEventQueue = 'channel.*';
  await channel.assertQueue(rmqEventQueue);
  channel.bindQueue(rmqEventQueue, rmqEventExchange, rmqEventQueue);
  channel.consume(
    rmqEventQueue,
    (msg) => {
      (async () => {
        if (!msg) {
          console.log('Consumer cancelled by server');
        } else {
          console.log(msg);
          // type ConnectionEvent = 'created' | 'closed';
          // const event = msg.fields.routingKey.split('.')[1] as ConnectionEvent;
          // const headers = msg.properties.headers as Record<string, string>;
          // const user = headers.user_who_performed_action as string | undefined;
          // const timestamp_ms = headers.timestamp_in_ms as string | undefined;
          // console.log(`${event} | ${user} | ${timestamp_ms}`);
          // const consumerTag = msg.fields.consumerTag;
          // const protocol = headers.protocol as string | undefined;
          // const isMqttClient = protocol ? protocol.includes('MQTT') : false;
          // console.log(
          //   `${event} | ${consumerTag} | ${deviceId} | ${isMqttClient}`
          // );
          // if (event == 'created' && isMqttClient) {
          //   // insert the data to DB
          //   await client.query(
          //     `
          //     INSERT INTO devices (device_id, consumer_tag, connected)
          //     VALUES($1, $2, true)
          //     ON CONFLICT(device_id) DO UPDATE SET consumer_tag = EXCLUDED.consumer_tag
          //     `,
          //     [deviceId, consumerTag]
          //   );
          // } else if (event == 'closed') {
          //   // update the data in DB
          // }
        }
      })();
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
      (async () => {
        if (!msg) {
          console.log('Consumer cancelled by server');
        } else {
          const [, deviceId] = msg.fields.routingKey.split('.');
          const deviceState = msg.content.toString();
          console.log(`[${deviceId}] [${deviceState}]`);

          await client.query(
            `
            INSERT INTO devices (device_id, state, state_updated_at)
            VALUES($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT(device_id) DO UPDATE SET state = EXCLUDED.state, state_updated_at = CURRENT_TIMESTAMP
            `,
            [deviceId, deviceState]
          );
        }
      })();
    },
    { noAck: true }
  );
})();
