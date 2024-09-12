// export default (router) => {
// 	router.get('/', (req, res) => res.send('Hello, World!'));
// };
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator

export default {
  id: "pokeapi",
  handler: (router, { services }) => {
    router.get("/", async (req, res) => {
      res.send("hello world");
    });

    ///////////////////initial webhook setup

    router.get("/webhook", async (req, res) => {
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];
      const WEBHOOK_VERIFY_TOKEN = "webhook";
      console.log("mode", mode);
      console.log("token", token);
      console.log("WEBHOOK_VERIFY_TOKEN", WEBHOOK_VERIFY_TOKEN);

      // check the mode and token sent are correct
      if (mode == "subscribe" && token == WEBHOOK_VERIFY_TOKEN) {
        // respond with 200 OK and challenge token from the request
        res.status(200).send(challenge);
        console.log("Webhook verified successfully!");
      } else {
        // respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    });

    ///////////////////initial webhook setup

    router.post("/webhook", async (req, res) => {
      // Create a new record in the MessageSentByBusiness model

      const messageService = new services.ItemsService(
        "Message", ///////it was MessageSentByBusiness before Message
        { schema: req.schema }
      );

      const phoneNumberService = new services.ItemsService(
        "PhoneNumber", ///////it was MessageSentByBusiness before Message
        { schema: req.schema }
      );
      //console.log("phoneNumberService", phoneNumberService);

      // Generate a unique ID for the new record

      // log incoming messages
      console.log(
        "contactdata Incoming webhook message:",
        JSON.stringify(req.body)
      );

      // check if the webhook request contains a message
      // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
      const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
      const from = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0].from;
      const messagebody =
        req.body.entry?.[0]?.changes[0]?.value?.messages?.[0].text.body;
      console.log("req.body", req.body);
      console.log("req.body.entry", req.body.entry);

      // let data = await phoneNumberService.readOne("wrong");
      // console.log("phoneNumberServicedata,", data);
      // Search if the phone number exists in the PhoneNumber model
      const existingPhoneNumber = await phoneNumberService.readByQuery({
        filter: { id: { _eq: from } }, // assuming `from` is the phone number you want to search
      });

      // check if the incoming message contains text
      if (message?.type === "text") {
        const messageId = message.id;
        //after receiving text message save that in directus

        // extract the business number to send the reply from it
        var business_phone_number_id =
          req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

        console.log("business_phone_number_id", business_phone_number_id);
        let phoneNumberId;
        if (existingPhoneNumber.length > 0) {
          console.log("Phone number exists:", from);
          phoneNumberId = existingPhoneNumber[0].id; // Get the existing phone number's ID
        } else {
          /////have to check this logic as no new number added in developer portal so cant check it now
          console.log("Phone number does not exist:", from);
          // Create a new phone number record in the PhoneNumber model
          const newPhoneNumber = await phoneNumberService.createOne({
            id: from,
            number: from,
          });

          console.log("New phone number created:", newPhoneNumber);
          phoneNumberId = newPhoneNumber.id; // Get the newly created phone number's ID
        }

        // Create a new message record
        const newMessage = await messageService.createOne({
          // Populate the fields according to your model schema
          id: messageId,
          From: from,
          timestamp: new Date().toISOString(), // Current timestamp,
          body: messagebody,
          type: "text",
          status: "sent",
          contacts_id: business_phone_number_id, //make it contacts_id: `91${to}`;
        });
        // Send response with created message and updated item
        res.send({ newMessage });

        // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
        // await axios({
        //   method: "POST",
        //   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        //   headers: {
        //     Authorization: `Bearer EAAWbZB5uXqVABO1OZCw9Rs93ermNkEAb91JxQ9qoCyBPc0XpOYUZCW5imRHbH8s2T5P6lZCTqP4BQWZAA9rg43F8dzakZAWeuwca3bEHpQZAEsOZAQ0q7ez7ugmN4royf25IODuHOBDMx6JXeczgafamYhjTS2VWaYzhhh0ZCIbR8sXt7hQnt0o8ZCZCSu1HeBbCprh3MiXweRDuEZCIirC6iR0kKJC0UTZBxMnVbYXcZD`,
        //   },
        //   data: {
        //     messaging_product: "whatsapp",
        //     to: message.from,
        //     text: { body: "Echo: " + message.text.body },
        //     context: {
        //       message_id: message.id, // shows the message as a reply to the original user message
        //     },
        //   },
        // });

        // same fetch request
        // await fetch(
        //   `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        //   {
        //     method: "POST",
        //     headers: {
        //       Authorization: `Bearer EAAWbZB5uXqVABO1OZCw9Rs93ermNkEAb91JxQ9qoCyBPc0XpOYUZCW5imRHbH8s2T5P6lZCTqP4BQWZAA9rg43F8dzakZAWeuwca3bEHpQZAEsOZAQ0q7ez7ugmN4royf25IODuHOBDMx6JXeczgafamYhjTS2VWaYzhhh0ZCIbR8sXt7hQnt0o8ZCZCSu1HeBbCprh3MiXweRDuEZCIirC6iR0kKJC0UTZBxMnVbYXcZD`,
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       messaging_product: "whatsapp",
        //       to: message.from,
        //       text: { body: "Echo: " + message.text.body },
        //       context: {
        //         message_id: message.id, // shows the message as a reply to the original user message
        //       },
        //     }),
        //   }
        // );

        //same fetch request

        // // mark incoming message as read
        // await axios({
        //   method: "POST",
        //   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        //   headers: {
        //     Authorization: `Bearer EAAWbZB5uXqVABO1OZCw9Rs93ermNkEAb91JxQ9qoCyBPc0XpOYUZCW5imRHbH8s2T5P6lZCTqP4BQWZAA9rg43F8dzakZAWeuwca3bEHpQZAEsOZAQ0q7ez7ugmN4royf25IODuHOBDMx6JXeczgafamYhjTS2VWaYzhhh0ZCIbR8sXt7hQnt0o8ZCZCSu1HeBbCprh3MiXweRDuEZCIirC6iR0kKJC0UTZBxMnVbYXcZD`,
        //   },
        //   data: {
        //     messaging_product: "whatsapp",
        //     status: "read",
        //     message_id: message.id,
        //   },
        // });

        // const saveToDirectus = await axios.post(
        //   "https://71c8-45-124-142-149.ngrok-free.app/items/MessageSentByBusiness",
        //   {
        //     id: "anilyadavnew",
        //     From: 411772638680203,
        //     timestamp: new Date().toISOString(), // Current timestamp,
        //     body: "hellow",
        //     type: "text",
        //     status: "sent",
        //     contacts_id: 8552035822, //make it contacts_id: `91${to}`;
        //   },
        //   {
        //     headers: {
        //       Authorization: `Bearer labYk0rEm-zItoFGgOz_RBFR2EEyXB1P`,
        //     },
        //   }
        // );
        // console.log("saveToDirectus", saveToDirectus);
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("saveToDirectus");
        // console.log("message", message);
        // res.send(message);
        // res.status(200).json(message);
        // Send the response and exit

        // console.log("insideif");

        // return res
        //   .status(200)
        //   .json({ success: true, message: "Message processed" });

        // return res
        //   .status(200)
        //   .json({ success: true, message: "Message processed and saved" });
      }
      console.log("sendStatus200");
      // res.sendStatus(200);
    });
  },
};
