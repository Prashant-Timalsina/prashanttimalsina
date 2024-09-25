<?php
$servername="sql109.epizy.com"; 
$username="epiz_34175476";
$password="dJRiavpzbbs";
$database="epiz_34175476_sadfasdf";

# create connection from variables
$conn= new mysqli($servername,$username,$password,$database);

if($conn -> connect_error){ //when connection with database doesnot takes place....
    die("connection failed: ".$conn -> error);
}

//fetches api from open weather map

$api_url = "https://api.openweathermap.org/data/2.5/weather?q=Jaleshwar&units=metric&appid=30ea757d9d69636c874e460800611b40";
$php_records = json_decode(file_get_contents($api_url), true); // decodes into php object

$name=$php_records['name'];
$description = $php_records['weather'][0]['description']; // fetch description into description
$temp = $php_records['main']['temp']; // fetch temp into temp
$humidity = $php_records['main']['humidity']; // fetch humidity into humidity
$speed = $php_records['wind']['speed']; // fetch speed into speed
$dt = date('Y-m-d'); // fetch date into dt

// select database on basis of date as primary key
$sql="SELECT * from weather_database WHERE dt = '$dt'";
$quer= $conn -> query($sql);
if ($quer->num_rows == 0) {
    // when the date data does not repeat, insert data into database
    $result = "INSERT INTO weather_database ( name,description, temp, humidity, speed, dt) VALUES ('$name,$description', $temp, $humidity, $speed, '$dt')";
    if ($conn->query($result) === TRUE) {
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error; //error handling
    }
} else {
    // when same date exists, update the data of that date
    $result="UPDATE weather_database SET name='$name', description='$description', temp='$temp', humidity='$humidity', speed='$speed', dt='$dt' WHERE dt='$dt' && name='$name'";
    if ($conn->query($result) === TRUE) {
        // echo "Record updated successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error; //error handling
    }
}

// saves upto 7 record and displays in json format
$sql = "SELECT * FROM weather_database ORDER BY dt DESC LIMIT 7";
$quer = $conn->query($sql);


// check if the query returned any rows
if ($quer->num_rows > 0) {
  // create an empty array to store the data
  $data = array();

  // loop through each row and store the data in the array
  while ($row = $quer->fetch_assoc()) {
    $data[] = array(
      'name' => $row['name'],
      'description' => $row['description'],
      'temp' => $row['temp'],
      'humidity' => $row['humidity'],
      'speed' => $row['speed'],
      'dt' => $row['dt']
    );
  }

  // output the data in a table format
  echo '<table>';
  echo '<tr><th>Name</th><th>Description</th><th>Temp</th><th>Humidity</th><th>Speed</th><th>Date/Time</th></tr>';

  foreach ($data as $row) {
    echo '<tr>';
    echo '<td>' . $row['name'] . '</td>';
    echo '<td>' . $row['description'] . '</td>';
    echo '<td>' . $row['temp'] . '</td>';
    echo '<td>' . $row['humidity'] . '</td>';
    echo '<td>' . $row['speed'] . '</td>';
    echo '<td>' . $row['dt'] . '</td>';
    echo '</tr>';
  }

  echo '</table>';
}

else { //when row is empty
    echo "0 results";
}

// Close the database connection
$conn->close();
?>
