<?php
//Conexion a la base de donne"
try {
	$bd = new PDO('mysql:host=uc9ft.myd.infomaniak.com;dbname=uc9ft_chat;charset=utf8','uc9ft_chateur', 'sBCoZAO_zS4',
			[   PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
		    ]);
}
catch(PDOException $e){
	echo "$e";
}

function getMessage($database){
	$res = $database->query("SELECT * FROM messages ORDER BY created_at DESC limit 20 ")->fetchAll();
	echo json_encode($res);
}
function postMessage($database){
	if (empty($_POST["author"])||empty($_POST["content"]) ) {
		echo json_encode(
			[
				"status"=>"error",
				"message"=>"Vous n'avez pas saisi le message a envoyer et votre nom",
				"POST"=>$_POST,
				"GET"=>$_GET
			]
	    );
		return false; 
	}

	$auth = htmlspecialchars($_POST["author"]);
	$msg = htmlspecialchars($_POST["content"]);

	if (preg_match("#[^a-zA-Z ]#",$msg)) {
		echo json_encode(
			[
				"status"=>"error",
				"message"=>"Vous ne pouvez envoyer des messages uniquement qu'avec les lettres de l'alphabet pas de caractères special",
				"POST"=>$_POST,
				"GET"=>$_GET
			]
	    );
		return false; 
	}



	$author = $_POST["author"];
	$content = $_POST["content"];

	$res = $database->prepare("INSERT INTO messages SET author=:author,
		                      content=:content, created_at = NOW()"
	);
	$res->execute(["author"=>$author,"content"=>$content]);
	echo json_encode(
			[
				"status"=>"success",
				"POST"=>$_POST,
				"GET"=>$_GET
			]
	);
}

$task = "getMsg";
if (array_key_exists("task",$_GET)) {
	$task = $_GET["task"];
}

if ($task==="postMsg") {
    postMessage($bd);
}
else{
	getMessage($bd);	
}


$bd = null;
//fermeture de la connexion a la base de donnée





 
