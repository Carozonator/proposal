<?php

include 'dbconnect.php'; 

//INSTANSIATION DATA
if (isset($_REQUEST['Newname'])) {
	$name = $_REQUEST['Newname'];
}
else {
	header('Location: http://localhost/proposalgen/blank.php');
	exit;
}


$multipropcheck = mysqli_query($coninfo,"SELECT * FROM Proposals WHERE Name='" . $name . "'");
if (count(mysqli_fetch_assoc($multipropcheck)) > 0) {
	header('Location: http://localhost/proposalgen/blank.php');
	mysqli_close($coninfo);
}
else {
	$querystring = "INSERT INTO Proposals (Name) VALUES ('".$name."')";
	$query = mysqli_query($coninfo,$querystring);
	header('Location: http://localhost/proposalgen');
}

//ERROR HANDLER
if (mysqli_connect_errno())
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
//CLOSE CONNECTION
mysqli_close($coninfo);

?>