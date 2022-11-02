import * as amqplib from 'amqplib';

(async () => {
  const queue = 'tasks';
  const conn = await amqplib.connect('amqp://localhost');

  const channel = await conn.createChannel();
  await channel.assertQueue(queue);
  console.log('CONNECTED');

  setInterval(() => {
    channel.sendToQueue(queue, Buffer.from('something to do'));
  }, 1000);
})();
