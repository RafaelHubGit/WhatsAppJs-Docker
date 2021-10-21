

const socket = io();


const getQR = () => {
    console.log('envia el getQR');
    socket.emit('getQR');
}

socket.on('getQR', ( payload ) => {

    clearQR();

    // Para crear el codigo QR con la libreria de QRCode
    const QR_CODE = new QRCode("qrcode", {
        width: 220,
        height: 220,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });

    console.log('Obtiene QR : ', payload);


    if( payload.connected === false ){
        QR_CODE.makeCode(payload.qr);
    }


})

const clearQR = () => {
    const div = document.getElementById('qrcode');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
}