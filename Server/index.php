<?php
// CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: multipart/form-data');

// Include functions
require 'vendor/autoload.php';
require 'endpoints/userFunctions.php';
require 'endpoints/taskFunctions.php';

// Connect to MongoDB
$mdbclient = new MongoDB\Client("mongodb+srv://yusufernet:media01@media.0aypy.mongodb.net/?retryWrites=true&w=majority&appName=media");
$mdb = $mdbclient->selectDataBase('media');

// Connect to supabase
$sbservice = new PHPSupabase\Service(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpa3V4eG1pcWRsa3B0am9nbWttIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjUzNTU5MywiZXhwIjoyMDQ4MTExNTkzfQ.gAiOOrJlr3tNJuZJIbMn0vzSROLFyphBOXP_JAL-ClE",
    "https://vikuxxmiqdlkptjogmkm.supabase.co"
);

// Get data from request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));

switch ($request[0]) {
    case 'users':
        switch ($request[1]) {
            case 'login':
                echo login($_POST['username'], $_POST['password'], $sbservice);
                break;
            case 'register':
                echo register($_POST['username'], $_POST['password'], $sbservice);
                break;
            case 'users':
                echo users($sbservice);
                break;
            case 'delete':
                echo deleteUser($_POST['id'], $sbservice);
                break;
            case 'updaterole':
                echo updateRole($_POST['id'], $_POST['role'], $sbservice);
                break;
            case 'reviewers':
                echo getReviewers($sbservice);
                break;
        }
        break;

    case 'tasks':
        switch ($request[1]) {
            case 'get-tasks':
                echo getTasks($_GET['view'], $_GET['user'], $sbservice, $mdb);
                break;
            case 'create-task':
                echo createTask($_POST['name'], $_POST['desc'], $_FILES['img'], $_POST['installer'], $sbservice, $mdb);
                break;
            case 'delete-task':
                echo deleteTask($_POST['id'], $sbservice);
                break;
            case 'update-status':
                echo updateStatus($_POST['id'], $_POST['status'], $sbservice);
                break;
            case 'assign-to':
                echo assignToTask($_POST['id'], $_POST['reviewer'], $sbservice);
                break;
        }
        break;

    case 'comments':
        switch ($request[1]) {
            case 'create-comment':
                echo createComment($_POST['taskId'], $_POST['user'], $_POST['comment'], $_POST['date'], $sbservice);
                break;
            case 'delete-comment':
                echo deleteComment($_POST['taskId'], $_POST['commentIndex'], $sbservice);
                break;
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}