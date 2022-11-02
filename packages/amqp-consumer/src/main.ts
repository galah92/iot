import * as amqplib from 'amqplib';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');
  console.log('CONNECTED');
  
  const exchange = 'amq.topic';
  const queue = 'devices.*.telemetry.*';
  const channel = await conn.createChannel();
  await channel.assertExchange(exchange, 'topic');
  await channel.assertQueue(queue);
  channel.bindQueue(queue, exchange, queue);

  channel.consume(queue, (msg) => {
    if (!msg) {
      console.log('Consumer cancelled by server');
    } else {
      const [, deviceId, , routingKey] = msg.fields.routingKey.split('.');
      console.log(`[${deviceId}] [${routingKey}] [${msg.content.toString()}]`);
      channel.ack(msg);
    }
  });
})();
