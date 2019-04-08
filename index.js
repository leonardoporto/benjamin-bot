require('dotenv').config();
const Telegraf = require('telegraf/telegram');
const express = require('express');
const _ = require('lodash');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 120, checkperiod: 120 });

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

    console.log(JSON.stringify(body));

    if(['opened'].indexOf(body.object_attributes.state) === -1) {
        res.status(200).send('Ok');
        return;
    }

    const exists = cache.get(`merge_${body.object_attributes.idd}`);

    if(exists !== undefined) {
        res.status(200).send('Ok');
        return;
    }

    cache.set(`merge_${body.object_attributes.idd}`, body.object_attributes.idd);
    
    // template de mensagens
    const templates = {
        "merge_request": "${assignee.name} abriu uma solicitação de Merge Request\n${object_attributes.url}"
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