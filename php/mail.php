<?php 
/** DOCUMENTACION DE PHPMAILER 
 * https://packagist.org/packages/phpmailer/phpmailer
 * */
        include __DIR__."\\PHPMailer.php";
        include __DIR__."\\SMTP.php"; 

    use PHPMailer\PHPMailer\PHPMailer; 
    use PHPMailer\PHPMailer\SMTP; 
    
    function sendmail($nombre,$email,$subjet,$body,$html = false) {
        
        //CONFIGURACION INICIAL DEL SERVIDOR DE CORREOS
        $phpmailer = new PHPMailer();
        $phpmailer->isSMTP();
        $phpmailer->Host = 'smtp.gmail.com';
        $phpmailer->Port = 587;
        $phpmailer->SMTPSecure = "tls";
        $phpmailer->SMTPAuth = true;
        $micorreo = 'anthony.dev.testeo@gmail.com';
        $phpmailer->Username = $micorreo;
        $phpmailer->Password = 'skfqcioqvtriwdbd';
                

        //AÑADIENDO DESTINATARIOS
        $phpmailer->setFrom($micorreo, 'Anthony Martinez');   //Correo quien envia
        $phpmailer->addAddress($email, $nombre);  //destinatario del correo        
/*        $phpmailer->addAddress('correo','nombre');  //Agregar multiples destinatarios

        //FORMATO HTML 
        $phpmailer->isHTML($html);   //configura el email en formato HTML
        $phpmailer->CharSet = 'UTF-8';
        $phpmailer->AltBody = 'un texto de preview';
        $phpmailer->addAttachment("imagenes_path","imagen_name");
*/
        //DEFINIENDO CONTENIDO DEL EMAIL
        $phpmailer->Subject = $subjet;
        $phpmailer->Body    = $body;
        //$phpmailer->AltBody = 'esto es para destinatarios que solo aceptan texto plano';

    //enviar correo
    $phpmailer->send();

    }