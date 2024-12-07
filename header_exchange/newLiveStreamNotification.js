const amqp = require("amqplib");

const consumeLiveStreamNotification = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchange_type = "headers";

        await channel.assertExchange(exchange, exchange_type, {
            durable: true,
        });

        const q = await channel.assertQueue("", { exclusive: true });

        console.log("Waiting for messages => ", q.queue);

        await channel.bindQueue(q.queue, exchange, "", {
            "x-match": "all",
            "notification-type": "live_stream",
            "content-type": "gaming",
        });

        channel.consume(q.queue, (message) => {
            if (message !== null) {
                console.log(
                    "New Video Notification => ",
                    message.content.toString()
                );
                channel.ack(message);
            }
        });
    } catch (err) {
        console.error(err);
    }
};

consumeLiveStreamNotification();
