require('dotenv').config();
const Telegraf = require('telegraf/telegram');
const express = require('express');
const _ = require('lodash');

const app = express();

app.use(express.json())

const bot = new Telegraf(process.env.BOT_TOKEN);

/**
 * @description Envia mensagem a um grupo no telegram.
 */
app.post('/group/:group', (req, res) => {

    const {
        params,
        body
    } = req;
    
    // template de mensagens
    const templates = {
        "merge_request": "[${object_attributes.action}] ${object_attributes.assignee.name}  Merge Request\n${object_attributes.url}",
        "note": "Novo comentário em um merge request\n${object_attributes.url}"
    }
    
    const message = _.template(templates[body.object_kind]);

    bot.sendMessage(params.group, message(body))
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });

    res.status(200).send('Ok');

});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening on port ${process.env.PORT || 5000}`)
});