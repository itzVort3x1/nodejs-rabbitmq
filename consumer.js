const amqp = require("amqplib");

async function receiveMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");

        const channel = await connection.createChannel();

        await channel.assertQueue("subscribed_users_mail_queue", {
            durable: false,
        });
        await channel.assertQueue("users_mail_queue", { durable: false });

        channel.consume("subscribed_users_mail_queue", (message) => {
            if (message !== null) {
                console.log(
                    "Mail received subscribed users: ",
                    JSON.parse(message.content)
                );
                channel.ack(message);
            }
        });

        channel.consume("users_mail_queue", (message) => {
            if (message !== null) {
                console.log(
                    "Mail received from unsubscribed users: ",
                    JSON.parse(message.content)
                );
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

receiveMail();
