<?php
    include (__DIR__."\\mail.php");
    

    function validate($nombre, $correo, $asunto,$mensaje){
        return !empty($nombre) && !empty($correo) && !empty($asunto) && !empty($mensaje);
    }
  
    $status = "";
    
    if(isset($_POST)){
        if (validate(...$_POST)){
            $nombre = $_POST["nombre"];
            $correo = $_POST["correo"];
            $asunto = $_POST["asunto"];
            $mensaje = $_POST["mensaje"];

            // Mandar Correo
            sendmail($nombre,$correo,$asunto,$mensaje);
            $status = "success";

        }else {
            $status = "danger";
            
        }
    }echo $status;