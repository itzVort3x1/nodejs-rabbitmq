const amqp = require("amqplib");

const sendMessage = async (routingKey, message) => {
    try {
        const connection = await amqp.connect("amqp://localhost");

        const channel = await connection.createChannel();

        const exchange = "notification_exchange";
        const exchange_type = "topic";

        await channel.assertExchange(exchange, exchange_type, {
            durable: true,
        });

        channel.publish(
            exchange,
            routingKey,
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );

        console.log("[x] Sent %s: '%s'", routingKey, message);
        console.log(
            `Mes was sent with routing key as ${routingKey} and content as ${message}`
        );

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error(error);
    }
};

sendMessage("order.placed", { orderId: 12345, status: "placed" });
sendMessage("payment.processed", { paymentId: 67890, status: "processed" });
