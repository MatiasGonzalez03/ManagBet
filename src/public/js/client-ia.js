document.addEventListener('DOMContentLoaded', function() {
    const verFixtureBtn = document.querySelector('.botonFixture');
    const widgetElement = document.getElementById('wg-api-football-games');
    const botonGenerar = document.getElementById('generarBotones');

    verFixtureBtn.addEventListener('click', function(event) {
        event.preventDefault();

        // Obtén los valores seleccionados del formulario
        const liga = document.querySelector('select[name="liga"]').value;
        const fecha = document.querySelector('input[name="fecha"]').value;

        // Actualiza los atributos del elemento existente
        if (widgetElement) {
            widgetElement.setAttribute('data-date', fecha);
            widgetElement.setAttribute('data-league', liga);

            // Dispatch del evento "DOMContentLoaded" para forzar la actualización del widget
            window.document.dispatchEvent(new Event("DOMContentLoaded", {
                bubbles: true,
                cancelable: true
            }));

            setTimeout(function() {
                // Actualizar la selección de partidos después de un breve retraso
                const partidos = document.querySelectorAll('.football-games-select');
                console.log('Partidos:', partidos);

                partidos.forEach(partido => {
                    const dataIdElement = partido.querySelector('[data-id]');
                    const dataId = dataIdElement.getAttribute('data-id');
                    const button = document.createElement('button');
                    button.innerText = 'Ir';
                    button.setAttribute('data-id', partido.getAttribute('data-id'));
                    button.addEventListener('click', function() {
                        console.log('Clic en Guardar para el partido con data-id:', dataId);
                        fetch(`/ia/prediccion?dataId=${dataId}`, { method: 'GET' })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
                                }
                                // No intentes parsear la respuesta como JSON
                                return response.text();
                            })
                            .then(data => {
                                // Redirigir a la nueva página con la información de la predicción
                                window.location.href = `/ia/prediccion?dataId=${dataId}`;
                            })
                            .catch(error => console.error('Error al realizar la solicitud al servidor:', error));

                    });

                    partido.appendChild(button);
                });
            }, 1000);

        } else {
            console.error('El elemento con ID "wg-api-football-games" no existe en el DOM.');
        }
    });

});