<?php


$db = new mysqli('localhost', 'root', '', 'memory_game');
if($db->connect_error){
  die ("Could not connect to db " . $db->connect_error);
}

if(isset($_POST["score"])){
  $score = $_POST["score"];
}

if(isset($_POST["levels"])){
  $levels = $_POST["levels"];
}

if(isset($_POST["username"])){
  $username = $_POST["username"];
  $query = "INSERT INTO Leaderboard VALUES ('$username', '$levels', '$score')";
  $db->query($query) or die ("Invalid insert " . $db->error);
}

echo  '<h2> You won! </h2> <br />
You played ' . $levels . ' levels! <br />
Your score was ' . intval($score) . ' points! <br />
<p id="submit">Enter your name for the leaderboard? <br /><input type="textarea" id="username"/> <input type="button" onclick="addUser()" value="Submit"/> </p><br /><br />
<table id="leaderboard" align="center" border="1">
<tr>
<th> Name </th>
<th> Levels Played </th>
<th> Points </th>
</tr>';


$query = "SELECT Users, Levels, Scores FROM Leaderboard";
$result = $db->query($query) or die ("Invalid query for users and scores " . $db->error);

if($result->num_rows != 0){

  while($uscore = $result->fetch_assoc()){
    $user_scores[] = $uscore;
  }

  usort($user_scores, function($a, $b){
    return $b['Scores'] - $a['Scores']; //Highest score comes first
  });


  for($i=0; $i<sizeof($user_scores); $i++){
    echo "<tr>";
    echo "<td>" .  $user_scores[$i]['Users'] . "</td>";
    echo "<td>" . $user_scores[$i]['Levels'] . "</td>";
    echo "<td>" . $user_scores[$i]['Scores'] . "</td>";
    echo "</tr>";
  }
  echo '</table>';
}

echo '<a href="index.html"> Restart? </a>';
