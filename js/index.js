
var arregloProductos = [];

/**
 * Carga el array de productos
 * @returns {Promise<void>} array de productos
 */
async function cargarArray(){ //carga el array de productos
    const hayProductos = mostrarLocalStorageProductos(); //chequea si hay productos en el local storage
    if(hayProductos) { //si hay productos en el local storage los muestra
        mostrarTodosLosProductos(hayProductos); 
        alerta('los productos cargados de LocalStorage', 'info');
    }else{
        try { //intento hacer la llamada a la api
            await fetch('https://fakestoreapi.com/products') //llamada a la api
                .then(res=>res.json()) //convierto la respuesta a json
                .then(json=>{ //guardo el json en el array
                    mostrarTodosLosProductos(json); //muestra todos los productos
                    localStorage.setItem("productos", JSON.stringify(json)); 

                    
                })
        } catch (error) { //si hay error lo muestro en consola
            console.error('Error al obtener productos de la api, error');
        }
    }
}



let contenedorProducto = document.querySelector("#productosTienda"); 
let carritoDeCompras = new Carrito(); 
let cantidadDeProductos  = document.querySelector("#monstrarCantidad");
let removerTodosLosProductos = document.querySelector("#removeAllProd");
let tuTotalCantidad = document.querySelector("#tuTotalCantidad");

let totalCantidadCheckout = document.querySelector("#totalCantidadCheckout");


let divbotonDescarga = document.getElementById('divbotonDescarga');
let botonDescarga = document.getElementById('botonDescarga');
let accionInstalar;




// Funcion para el boton que dispara el pop-up de instalación
function instalarApp() {
    if (accionInstalar) {
        accionInstalar.prompt();
        accionInstalar.userChoice
            .then(respuesta => {
                if (respuesta.outcome == 'accepted') {
                    console.log('El usuario aceptó instalar la app');
                    divbotonDescarga.style.display = 'none';
                } else {
                    console.log('El usuario no aceptó instalar la app');
                }
            })
    }
}

function mostrarBtnInstalar() {
    if (botonDescarga != undefined) {
        divbotonDescarga.style.display = 'block';
        botonDescarga.addEventListener('click', instalarApp)
    }
}

// Evito que el pop-up salte al entrar a la web
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    accionInstalar = e;
    mostrarBtnInstalar();
})





/**
 * Muestra todos los productos en el contenedorProducto
 * @param {*} arreglo  array de productos
 */
function mostrarTodosLosProductos(arreglo){ 
    arregloProductos = arreglo;
    arreglo.forEach((p)=>{ //recorro el array de productos
        let productoObject = new Producto(p.title, p.description, p.price, p.image, p.category, p.id,null); //creo un objeto producto
        contenedorProducto.append(productoObject.imprimirProducto()); //imprimo el producto en el contenedor
    })
}

/**
 * Agrega un producto al carrito
 * @param {*} idProducto  id del producto
 */
async function agregarAlCarrito(idProducto){ 
    try {
        await fetch('https://fakestoreapi.com/products/'+ idProducto)
        .then(res=>res.json())
        .then(json=>{
            let productoObject = new Producto(json.title, json.description, json.price, json.image, json.category, json.id, null);
            arregloProductos.push(productoObject);
            carritoDeCompras.agregarProducto(productoObject);
        })
    } catch (error) {
        alerta('No se pudo conectar a la API!', 'warning');
        let productos = mostrarLocalStorageProductos();
        let productoObject = productos.filter(p=>p.id == idProducto)[0];
        console.log(productoObject);
        arregloProductos.push(productoObject);
        carritoDeCompras.agregarProducto(productoObject);
    }
    

    actualizarLocalStorage(); //actualizo el local storage  

    cantidadDeProductos.innerText = carritoDeCompras.cantidadDeProductos();  //actualizo la cantidad de productos en el carrito
    tuTotalCantidad.innerText = carritoDeCompras.cantidadDeProductos();     
    
    imprimirCarrito()

}


/**
 * Funcion que lanza un alerta 
 * @param {*} message  mensaje del alerta
 * @param {*} type  tipo de alerta (success, danger, warning, info)
 */
function alerta(message, type){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    alertPlaceholder.text = ""
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
console.log(wrapper);
}



/**
 * Imprime el carrito en el modal
 * 
 */
function imprimirCarrito(){ 
    let contenedorItemProducto = document.querySelector("#contenedorItemCarrito");

    let misProductos = carritoDeCompras.devolverProductos();
    contenedorItemProducto.replaceChildren();
    totalCompra ();
    misProductos.forEach(element => {
        contenedorItemProducto.append(carritoDeCompras.mostrarCardProducto(element));
    });
}

/**
 * Quita un producto del carrito
 * @param {*} idProducto  id del producto
 * @param {*} element  elemento html
 */
function quitarProductoDelCarrito (idProducto,element){ 

    let contenedorItem = element.parentNode.parentNode;
    
    contenedorItem.remove();
    carritoDeCompras.quitarProductoDelCarrito(idProducto);

    actualizarLocalStorage();

    cantidadDeProductos.innerText = carritoDeCompras.cantidadDeProductos(); 
    tuTotalCantidad.innerText = carritoDeCompras.cantidadDeProductos(); 
    totalCompra ();

}

/**
 * Muestra el total de la compra en el carrito
 */
function totalCompra (){ 
    let tuTotal = document.querySelector(".tuTotal");
    tuTotal.innerText = carritoDeCompras.mostrarPrecioTotalDeLaCompra(); 
}

vaciarCarrito.addEventListener("click", function(){
    carritoDeCompras.quitarTodosLosProducto();
    document.querySelector("#contenedorItemCarrito").replaceChildren();

    totalCompra ();

    actualizarLocalStorage();

    cantidadDeProductos.innerText = carritoDeCompras.cantidadDeProductos(); 
    tuTotalCantidad.innerText = carritoDeCompras.cantidadDeProductos(); 

});

/**
 * Muestra el modal con el detalle del producto
 * @param {*} idProd  id del producto
 */
function mostrarModalDetalle(idProd){ 
    try {
        fetch('https://fakestoreapi.com/products/'+ idProd)
            .then(res=>res.json())
            .then(json=>{
                let productoObject = new Producto(json.title, json.description, json.price, json.image, json.category, json.id, null);
                arregloProductos.push(productoObject);
                document.querySelector("#contenedorDescripLargo").replaceChildren();
                document.querySelector("#contenedorDescripLargo").append(productoObject.imprimirModal(productoObject));
            })
    } catch (error) {
        console.log(error)
    }
};

/**
 * Actualiza el local storage con el carrito de compras
 */
function actualizarLocalStorage() {
    localStorage.setItem("productosCarrito", JSON.stringify(carritoDeCompras.devolverProductos()));
    //localStorage.setItem("productosCarrito", JSON.stringify(carritoDeCompras));
}

/**
 * Devuelve el local storage
 * @returns local storage    
 */
function mostrarLocalStorage() { 
    return JSON.parse(localStorage.getItem("productosCarrito")); 
}

/**
 * Muestra el local storage
 * @returns local storage
 */
function mostrarLocalStorageProductos() { 
    return JSON.parse(localStorage.getItem("productos"));
}

document.querySelector("select").addEventListener("change", (e) => { //evento del select de categorias
    
    let categoria = e.target.value;
    if (categoria != "todas"){
        let filtrado = arregloProductos.filter((p) => p.categoria.includes(categoria)); //filtro el array de productos por categoria
    
        contenedorProducto.replaceChildren();
        mostrarTodosLosProductos(filtrado);
        mostrarOferta(categoria);
        
    }else{
        contenedorProducto.replaceChildren();
        mostrarTodosLosProductos(arregloProductos);
        mostrarOferta(categoria);
    }

    
});


/**
 * Funcion para mostrar oferta (es llamada con el select de categoria)
 */
function mostrarOferta(categoria) { //muestra la oferta en el contenedorOferta

    document.querySelector("#contenedorOferta").innerText = "";

    let cardOferta = document.createElement("div");
    cardOferta.className = "card";
    cardOferta.setAttribute("id", "oferta");

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    
    

    cardOferta.append(cardBody); //agrego el body a la card

    document.querySelector("#contenedorOferta").append(cardOferta); //agrego la card al contenedor

    setTimeout(() => { //elimino la card a los 10 segundos

        document.querySelector("#oferta").remove();

    }, 10000);
};



cargarArray() //carga el array de productos

