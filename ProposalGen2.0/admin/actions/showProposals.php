<?php 

include 'dbconnect.php';

$query = mysqli_query($coninfo,"SELECT * FROM Proposals");

while ($result = mysqli_fetch_assoc($query)) {
	echo '<tr>';
	echo '<td>';
	echo '<form action="http://localhost/proposalgen/admin/actions/selectProposal.php" method="get">';
	echo '<button name="proptitle" value="">';
	echo $result['TITLE'];
	echo '</button>';
	echo '</form>';
	echo '</td>';
	echo '<td>';
	echo '<form method="get" action="http://localhost/proposalgen/admin/actions/delProposal.php">';
	echo '<input type="hidden" name="name" value="'.$result['TITLE'].'" />';
	echo '<button>Delete</button>';
	echo '</form>';
	echo '</td>';
	echo '</tr>';
}

?>