const amqp = require("amqplib");

const announceNewProduct = async (product) => {
    try {
        const connection = await amqp.connect("amqp://localhost");

        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchange_type = "fanout";

        await channel.assertExchange(exchange, exchange_type, {
            durable: true,
        });

        const message = JSON.stringify(product);

        channel.publish(exchange, "", Buffer.from(message), {
            persistent: true,
        });

        console.log("Sent => ", message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error(error);
    }
};

announceNewProduct({ id: 123, name: "iPhone 19 Pro Max", price: 20000 });
