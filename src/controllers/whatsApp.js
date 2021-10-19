const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Request, Response } = require('express');
const puppeteer = require('puppeteer');

const { Client } = require('whatsapp-web.js');

// const SESSION_FILE_PATH = './session.json';
// let sessionCfg;
// if (fs.existsSync(SESSION_FILE_PATH)) {
//     sessionCfg = require(SESSION_FILE_PATH);
// }

// const client = new Client({ puppeteer: { headless: false }, session: sessionCfg });



const puppeteerOptions = {
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
};

const client = new Client( puppeteerOptions );

// const client = new Client({ 
//     puppeteer: {
//         browserWSEndpoint: `ws://localhost:3000`
//     }
// });

const whatsAppInit = async ( req = Request, res= Response ) => {

    console.log('entra a generar el codigo qrrRRR'); 

    try {
        client.on('qr', ( qr ) => {
            // Generate and scan this code with your phone
            // console.log('GENERA EL CODIGO QR');
            qrcode.generate(qr, {small: true});
    
            // console.log('genera el codigo qr : ', qr);
        });
    } catch (err) {
        console.log('PUTO ERROR : ', err)
    }

    
    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.initialize();
    
    // client.on('message', msg => {
    //     if (msg.body == 'ping') {
    //         msg.reply('pong');
    //     }
    // });

    return res.json({
        msg: 'Ya puedes inicial sesión'
    })
}

const whatsAppSend = async ( req= Request, res= Response ) => {

    const { body } = req;

    console.log('el body : ', body)

    const number = body.numero;
    // const number = "5571104430"
    const mensaje = body.mensaje;

    const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
    const final_number = `52${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India
    
    const number_details = await client.getNumberId(final_number); // get mobile number details
    
    if ( !number_details ) {
        return res.json(404).json({
            msg: `El teléfono ${final_number} no esta registrado en whatsApp`
        }); 
    }

    try {

        if ( body.mensaje === 'hola' ){
            console.log('entra a hola')
            client.on('message', msg => {
                if (msg.body == 'hola') {
                    msg.reply('Que onda :D');
                }
            });

            return;
        }

        await client.sendMessage(number_details._serialized, mensaje); // send message
    
        res.json({
            msg: 'El mensaje fue enviado satisfactoriamente'
        })
        
    } catch (error) {
        console.log(error);

        return res.json(500).json({
            msg: `Hubo un problema al el mensaje, intentelo de nuevo. Si el problema persiste contacte con el administrador`
        }); 
    }

}

module.exports = {
    whatsAppInit,
    whatsAppSend
}