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
  console.log('CONNECTED');

  const exchange = 'amq.topic';
  const stateQueue = 'devices.*.state';
  const channel = await conn.createChannel();
  await channel.assertExchange(exchange, 'topic');
  await channel.assertQueue(stateQueue);
  channel.bindQueue(stateQueue, exchange, stateQueue);

  channel.consume(
    stateQueue,
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
