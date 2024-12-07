const amqp = require("amqplib");

const pushNotification = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchange_type = "fanout";

        await channel.assertExchange(exchange, exchange_type, {
            durable: true,
        });

        const q = await channel.assertQueue("", { exclusive: true });
        console.log("Waiting for messages => ", q);

        await channel.bindQueue(q.queue, exchange, "");

        channel.consume(q.queue, (message) => {
            if (message !== null) {
                const product = JSON.parse(message.content.toString());
                console.log(
                    "Sending Push notification for product => ",
                    product.name
                );
                channel.ack(message);
            }
        });
    } catch (err) {
        console.error(err);
    }
};

pushNotification();
