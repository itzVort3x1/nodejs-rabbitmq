const amqp = require("amqplib");

const receiveMessages = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const queue = "payment_queue";

        await channel.assertExchange(exchange, "topic", { durable: true });
        await channel.assertQueue(queue, { durable: true });

        channel.bindQueue(queue, exchange, "payment.*");

        console.log("Waiting for messages");

        channel.consume(
            queue,
            (message) => {
                if (message.content === null) {
                    return;
                }
                const content = JSON.parse(message.content);
                console.log(
                    `[x] Received ${
                        message.fields.routingKey
                    }: ${JSON.stringify(content)}`
                );
                channel.ack(message);
            },
            { noAck: false }
        );
    } catch (error) {
        console.error("Error: ", error);
    }
};

receiveMessages();
