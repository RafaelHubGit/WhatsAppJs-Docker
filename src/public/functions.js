
// const urlB = 'http://10.4.61.184:8001/api/whatsApp';
const urlB = 'http://localhost:8002/api/whatsApp';

const enviarMensaje = () => {
    // let url = 'http://localhost:8001/api/whatsApp'

    console.log(urlB);

    const numero = $('#celularInpt').val();
    const mensaje = $('#mensajeTxt').val();

    console.log('numero : ', numero, ' mensaje: ', mensaje);

    const datos = {
        "numero": numero,
        "mensaje": mensaje
    }

    fetch(urlB, {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(json => {

        console.log(' VER QUE TRAE :', json);
        if ( !json?.msg ){
            return Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error al enviar el mensaje',
                showConfirmButton: false,
                timer: 1500
            })
        }

        return Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Mensaje enviado',
            showConfirmButton: false,
            timer: 1500
        })
    })
    .catch( err => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al enviar el mensaje',
            showConfirmButton: false,
            timer: 1500
        })
    });
 
}

const crearQR = () => {
    console.log('se envio crea el QR');

    // let url = 'http://localhost:8001/api/whatsApp'


    $.ajax({ 
        type:"GET", // la variable type guarda el tipo de la peticion GET,POST,..
        url: urlB,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
    }).done(function ( resp ) {
        console.log('Respuesta : ', resp);
    }).fail(function ( err ) {
        console.log('error : ', err);
    })
}