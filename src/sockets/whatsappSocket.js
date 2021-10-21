const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Request, Response } = require('express');
const puppeteer = require('puppeteer');

const { Client } = require('whatsapp-web.js');

const puppeteerOptions = {
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
};

const client = new Client( puppeteerOptions );

client.initialize();

const socketController = ( socket ) => {
    console.log('Cliente conectado, ', socket.id);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado: ', socket.id);
    });

    socket.on('getQR', ( payload ) => {
        console.log('entra a getQR')
        
        client.on('qr', ( qr ) => {
            // Generate and scan this code with your phone
            // console.log('GENERA EL CODIGO QR');
            // qrcode.generate(qr, {small: true});
    
            console.log('genera el codigo qr : ', qr);
    
            socket.emit('getQR',{
                connected: false,
                qr: qr
            });
        });
        
        client.on('ready', () => {
            console.log('Client is ready!');
            socket.emit('getQR',{
                connected: true
            });
        });

    });

    client.on('message', message => {
        if(message.body === 'hola' || message.body === 'Hola') {
            message.reply('Que onda! :D');
        }
    });

    client.on('disconnected', (reason) => {
        console.log('RAZON DESCONECTADO : ', reason);
        socket.emit('getQR', {
            connected: false,
            msg: 'El cliente fue desconectado'
        })
    });
}

const whatsAppSend = async ( req= Request, res= Response ) => {

    const { body } = req;

    console.log('el body desde sockets : ', body)

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
    socketController,
    whatsAppSend
}