const amqp = require("amqplib");

const sendNotifcation = async (headers, message) => {
    try {
        const connection = await amqp.connect("amqp://localhost");

        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchange_type = "headers";

        await channel.assertExchange(exchange, exchange_type, {
            durable: true,
        });

        channel.publish(exchange, "", Buffer.from(message), {
            persistent: true,
            headers,
        });

        console.log("Sent => ", message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error(error);
    }
};

sendNotifcation(
    {
        "x-match": "all",
        "notification-type": "new_video",
        "content-type": "video",
    },
    "New music video uploaded"
);

sendNotifcation(
    {
        "x-match": "all",
        "notification-type": "live_stream",
        "content-type": "gaming",
    },
    "Gaming live stream started"
);

sendNotifcation(
    {
        "x-match": "any",
        "notification-type-comment": "comment",
        "content-type": "vlog",
    },
    "New comment on your vlog"
);

sendNotifcation(
    {
        "x-match": "any",
        "notification-type-like": "like",
        "content-type": "vlog",
    },
    "Someone Liked your comment"
);
