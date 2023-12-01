<?PHP
//inicializo variables con los datos que necesito traer de la superglobal
$inputNombre = $_POST['inputNombre'];
$inputApellido = $_POST['inputApellido'];
$inputEmail = $_POST['inputEmail'];
$inputComentario = $_POST['inputComentario'];

function soloLetras($str){
    return preg_match('/^([^0-9]*)$/', $str) and preg_match('/^[a-zA-Z0-9]{4,10}$/', $str);
}

if (!(soloLetras($inputNombre) and soloLetras($inputApellido))){
    
    echo("<div>
            <h2>Ooops</h2>
            <p>Los campos nombre y apellido no pueden contener números o caracteres especiales.</p>
        </div>");

}

if ((isset($inputNombre) and !empty(trim($inputNombre))) and
    (isset($inputApellido) and !empty(trim($inputApellido))) and
    (isset($inputEmail) and !empty(trim($inputEmail))) and
    (isset($inputComentario) and !empty(trim($inputComentario))) and 
    (soloLetras($inputNombre) and soloLetras($inputApellido))

) {
    echo "<pre>";
    print_r("<div>
            <h2>Muchas gracias por tu mensaje!</h2>
                <p>Te contactaremos a la brevedad.</p>
    
                <h3>Estos son los datos que nos enviaste:</h3>
                <ul>
                    <li><p>Nombre: $inputNombre </p></li>
                    <li><p>Apellido: $inputApellido </p></li>
                    <li><p>Email: $inputEmail </p></li>
                    <li><p>Comentario: $inputComentario </p></li>
                </ul>
         </div>");
    echo "</pre>";
    
}