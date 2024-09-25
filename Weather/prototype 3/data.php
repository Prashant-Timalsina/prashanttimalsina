<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "database1";

// create connection
$conn = new mysqli($servername, $username, $password, $database);

// check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// fetches data from OpenWeatherMap API
$q = "Jaleshwor";
$api_url = "https://api.openweathermap.org/data/2.5/weather?q=$q&units=metric&appid=30ea757d9d69636c874e460800611b40";
$php_records = json_decode(file_get_contents($api_url), true);

$name = $php_records['name'];
$description = $php_records['weather'][0]['description'];
$temp = $php_records['main']['temp'];
$humidity = $php_records['main']['humidity'];
$speed = $php_records['wind']['speed'];
$dt = date('Y-m-d');

// insert or update data in the database
$sql = "SELECT * FROM weather_database WHERE dt = '$dt' AND name = '$name'";
$quer = $conn->query($sql);

if ($quer->num_rows == 0) {
    $result = "INSERT INTO weather_database (name, description, temp, humidity, speed, dt) VALUES ('$name', '$description', $temp, $humidity, $speed, '$dt')";
} else {
    $result = "UPDATE weather_database SET description = '$description', temp = $temp, humidity = $humidity, speed = $speed WHERE dt = '$dt' AND name = '$name'";
}

if ($conn->query($result) === TRUE) {
    // echo "Data saved successfully";
} else {
    echo "Error: " . $result . "<br>" . $conn->error;
}

// select data from the database
$sql = "SELECT * FROM weather_database ORDER BY dt DESC LIMIT 7";
$quer = $conn->query($sql);

if ($quer->num_rows > 0) {
    $data = array();

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
} else {
    echo "0 results";
}

// close the database connection
$conn->close();
?>
