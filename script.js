//const imagenAmpliada = document.getElementById("imagenAmpliada");
const hostname = window.location.hostname;
const facebook = document.querySelector('#Facebook');
const instagram = document.querySelector('#Instagram');
const plataforma = navigator.userAgent;
const texto = document.getElementById('footerText');

document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("lightbox");
    const imagenAmpliada = document.getElementById("imagenAmpliada");
    const cerrar = document.querySelector(".cerrar");
    const galeria = document.querySelector(".imagenes");
    let zoom = 1; // Nivel inicial de zoom
    let isDragging = false; // Estado para arrastrar
    let startX, startY, currentX = 0, currentY = 0;
    //const nosotros = document.querySelector('.Anosotros');
    CargaNosotros();
    ChangeFooter();

    // Agregar evento a todas las imágenes de la galería
    document.querySelectorAll(".imagen-galeria").forEach(img => {
        img.addEventListener("click", (e) => {
            //const rect = img.getBoundingClientRect();
            //const positionX = rect.left + window.scrollX;
            //const positionY = rect.top + window.scrollY;
            //lightbox.style.left = `${positionX}px`;
            //lightbox.style.top = `${positionY}px`;
            imagenAmpliada.src = e.target.src; // Asignar la imagen clickeada
            lightbox.style.display = "flex"; // Mostrar el modal
            //lightbox.style.width = `${rect.width}px`;
            //lightbox.style.height = `${rect.height}px`;
            //zoom = 1;
            //imagenAmpliada.style.transform = `scale(${zoom}) translate(0px, 0px)`;
        });
        img.addEventListener("mouseover", (e) => {
            if (imagenAmpliada.style.display = "flex") {
                imagenAmpliada.style.transform = 'scale(1)';
                imagenAmpliada.style.cursor = 'zoom-in';
            }
            //imagenAmpliada.src = e.target.src; // Asignar la imagen clickeada
            //lightbox.style.display = "flex"; // Mostrar el modal
        });
    });

    // Evento para cerrar el lightbox
    cerrar.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    // Cerrar modal si se hace clic fuera de la imagen
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });
    // **Cerrar el lightbox al presionar la tecla ESC**
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            lightbox.style.display = "none";
        }
    });
    // **ZOOM con la rueda del mouse**
    imagenAmpliada.addEventListener("click", (e) => {
        e.preventDefault();
        if (esMovil()) {
            if (esTransform(imagenAmpliada) > 0 && esTransform(imagenAmpliada) < 2) {
                zoom = 1.5;
                imagenAmpliada.style.transform = `scale(${zoom}) translate(${currentX}px, ${currentY}px)`;
                imagenAmpliada.style.cursor = "zoom-out";
            } else {
                zoom = 1;
                currentX = 0;
                currentY = 0;
                imagenAmpliada.style.transform = `scale(${zoom}) translate(${currentX}px, ${currentY}px)`;
                imagenAmpliada.style.cursor = "zoom-in";
            }
        } else {
            //if (esTransform(imagenAmpliada) > 0 && esTransform(imagenAmpliada) < 2) {
            if (esTransform(imagenAmpliada) == 1) {
                //zoom = 2;
                //imagenAmpliada.style.transform = `scale(${zoom}) translate(${currentX}px, ${currentY}px)`;
                imagenAmpliada.style.cursor = "zoom-out";
                activarPantallaCompleta(imagenAmpliada);
                imagenAmpliada.style.transition = "transform 1s ease";
                //esPantallaCompleta(imagenAmpliada);
            } else {
                //esPantallaCompleta(imagenAmpliada);
                imagenAmpliada.style.cursor = "zoom-in";
                document.exitFullscreen();
                //imagenAmpliada.exitFullscreen();
                /* zoom = 1;
                currentX = 0;
                currentY = 0;
                imagenAmpliada.style.transform = `scale(${zoom}) translate(${currentX}px, ${currentY}px)`; */
            }

        }
    });
    imagenAmpliada.addEventListener("mouseover", () => {
        if (esTransform(imagenAmpliada) > 0 && esTransform(imagenAmpliada) < 2) {
            imagenAmpliada.style.cursor = "zoom-in";
        } else {
            imagenAmpliada.style.cursor = "zoom-out";
        }
    });
    // **MOVER la imagen con el ratón cuando está en zoom**
    /* imagenAmpliada.addEventListener("mousedown", (e) => {
        if (zoom > 1) {
            isDragging = true;
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
            imagenAmpliada.style.cursor = "grabbing";
        }
    }); */

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            currentX = e.clientX - startX;
            currentY = e.clientY - startY;
            imagenAmpliada.style.transform = `scale(${zoom}) translate(${currentX}px, ${currentY}px)`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        // imagenAmpliada.style.cursor = "grab";
        //imagenAmpliada.style.cursor = "zoom-out";
    });

    // **Restablecer el zoom con doble clic**
    imagenAmpliada.addEventListener("dblclick", () => {
        zoom = 1;
        currentX = 0;
        currentY = 0;
        imagenAmpliada.style.transform = `scale(1) translate(0px, 0px)`;
    });
    // Bloquear el clic derecho sobre la imagen
    imagenAmpliada.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        //alert("El clic derecho está deshabilitado en esta imagen.");
    });
});

//definimos la funcion que verifica si un componente tiene transformacion
function esTransform(ele){
    const estilo = window.getComputedStyle(ele);
      const transform = estilo.transform;
      if (transform === 'none') {
        console.log('No se ha aplicado ninguna transformación.');
        return;
      }
      // Analizamos la matriz de transformación
      const valores = transform.match(/matrix\(([^)]+)\)/)[1].split(', ');
      const escalaX = parseFloat(valores[0]); // El valor de scaleX está en la posición 0
      const escalaY = parseFloat(valores[3]); // El valor de scaleY está en la posición 3 (en una matriz 2D)
      let resultado = '';
      if (escalaX == 1 && escalaY == 1) {
        resultado = 1;
      //} else if (escalaX == 1 && escalaY == 1) {
        //resultado = 1.5;
      } else {
        resultado = 0;
      }
      //console.log(`ScaleX: ${escalaX}, ScaleY: ${escalaY}`);
      return resultado;
}

// Función para activar el modo pantalla completa
function activarPantallaCompleta(elemento) {
    if (elemento.requestFullscreen) {
        elemento.requestFullscreen();
    } else if (elemento.mozRequestFullScreen) { // Firefox
        elemento.mozRequestFullScreen();
    } else if (elemento.webkitRequestFullscreen) { // Chrome, Safari y Opera
        elemento.webkitRequestFullscreen();
    } else if (elemento.msRequestFullscreen) { // IE/Edge
        elemento.msRequestFullscreen();
    }
}

function esMovil() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function esPantallaCompleta (elemento) {
    // Evento para detectar cambios en pantalla completa
    document.addEventListener("fullscreenchange", function () {
        if (document.fullscreenElement === elemento) {
            console.log("La imagen está en pantalla completa");
            //elemento.exitFullscreen();
        } else {
            console.log("La imagen ha salido de pantalla completa");
            //activarPantallaCompleta(elemento);
        }
    });
}

// Función para cargar el archivo JSON
async function cargarJson(url) {
    try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error(`Error al cargar JSON: ${respuesta.statusText}`);
      const datos = await respuesta.json(); // Parsear el JSON
      return datos;
    } catch (error) {
      console.error("Error al cargar el archivo JSON:", error);
    }
  }

// Función para buscar una descripción por su identificador
async function buscarDescripcion2(identificador, titu, archivo) {
    const datos = await cargarJson("Assets/" + archivo + '.json');
    let firstKey = Object.keys(datos)[0];
    if (firstKey === titu) {
        return datos[titu][identificador];
    //} else if (titu != firstKey) {
        //console.log('son diferentes');
        //return datos[firstKey][identificador];
    } else {
        return datos[firstKey][identificador];
    }
}

async function CargaNosotros() {    
    const sobre = document.querySelectorAll('.sobre-nosotros p');    
    const titulo = ('about').toLowerCase();
    const archivo = ('informacion').toLowerCase();
    let identificador = '';

    sobre.forEach((item) => {
        (async () => {        
            if (item.classList.contains('Anosotros')) {
                identificador = nosotros.id.toLowerCase();
            }
            if (item.classList.contains('Aellos')) {
                identificador = ellos.id.toLowerCase();
            }
            const descripcion = await buscarDescripcion2(identificador, titulo, archivo);            
            item.textContent = descripcion;
        })();
    });    
}

//Definimos la funcion que agrega los titulos a los componentes
function Titulos() {
    if (instagram.onmouseover) {
        instagram.title = 'Visitar página de Instagram de "Pehuén Aventuras 4x4"';
    }
    if (facebook.onmouseover) {
        facebook.title = 'Visitar página de Facebook de "Pehuén Aventuras 4x4"';
    }
}

function ChangeFooter() {    
    if (plataforma.includes('Win')) {
        document.getElementById('footerText').textContent = texto.textContent + ' 2025 Pehuén Aventuras 4x4. Todos los derechos reservados.';
    } else {
        document.getElementById('footerText').textContent = texto.textContent + ' 2025 Pehuén Aventuras 4x4.';
    }
}