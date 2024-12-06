<?php

// Function to retrieve tasks based on the view and user
function getTasks($view, $user, $service, $mdb) {
    // Initialize the database with 'tasks' as the collection name and 'id' as the key
    $db = $service->initializeDatabase('tasks', 'id');

    try {
        // Determine the view type and fetch tasks accordingly
        if ($view === "your-tasks") {
            // Fetch tasks assigned to the user
            $result = $db->findBy('assigned_to', $user)->getResult();
        } else if ($view === "your-uploads") {
            // Fetch tasks uploaded by the user (installer)
            $result = $db->findBy('installer', $user)->getResult();
        } else if ($view === "all-tasks") {
            // Fetch all tasks in the database
            $result = $db->fetchAll()->getResult();
        } else {
            // Fetch unassigned tasks
            $result = $db->findBy('assigned_to', "")->getResult();
        }

        // Convert the database result to an array
        $tasks = iterator_to_array($result);

        // Loop through each task and add an image if available
        foreach ($tasks as &$task) {
            // Find the associated image for the task
            $image = $mdb->images->findOne(['task_id' => $task->id]);

            if ($image) {
                // If an image is found, encode it in base64 format
                $task->img = 'data:image/png;base64,' . base64_encode($image->img->getData());
            } else {
                // If no image is found, set image to null
                $task->img = null;
            }
        }

        // Send a 200 HTTP response and return the tasks as JSON
        http_response_code(200);
        return json_encode(['message' => $tasks]);
    } catch (Error $e) {
        // Handle errors by sending a 500 HTTP response and returning the error message
        http_response_code(500);
        return $e->getMessage();
    }
}

// Function to create a new task
function createTask($name, $desc, $img, $installer, $service, $mdb) {
    // Initialize the database with 'tasks' as the collection name and 'id' as the key
    $db = $service->initializeDatabase('tasks', 'id');

    try {
        // Prepare the task data for insertion
        $newtask = [
            'name' => $name,
            'desc' => $desc,
            'status' => "Unassigned",
            'assigned_to' => "",
            'created_at' => date("Y-m-d H:i:s"),
            'comments' => [],
            'installer' => $installer
        ];

        // Insert the new task into the database
        $data = $db->insert($newtask);

        // Save the associated image in the MongoDB database
        $mdb->images->insertOne([
            'task_id' => $data[0]->id,
            'img' => new MongoDB\BSON\Binary(file_get_contents($img['tmp_name']), MongoDB\BSON\Binary::TYPE_GENERIC),
        ]);

        // Send a 201 HTTP response indicating successful creation
        http_response_code(201);
        echo json_encode(["message" => "Task created successfully."]);
    } catch (Error $e) {
        // Handle errors by sending a 500 HTTP response and returning the error message
        http_response_code(500);
        return $e->getMessage();
    }
}

// Function to update the status of a task
function updateStatus($id, $status, $service) {
    // Initialize the database with 'tasks' as the collection name and 'id' as the key
    $db = $service->initializeDatabase('tasks', 'id');

    try {
        // Prepare the updated status data
        $updatedtask = [
            'status' => $status
        ]
