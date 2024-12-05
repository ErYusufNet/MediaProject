import React, { useEffect, useState } from "react";
import "../assets/styles/taskspage.css";
import {
  Select,
  useId,
  Label,
  Dropdown,
  Option,
  Field,
  Input,
  Button, 
  Card, 
  Text,
  Spinner, 
  CardFooter, 
  SelectProps
} from "@fluentui/react-components";
import { makeStyles } from '@griffel/react';
import axios from 'axios';

const useStyles = makeStyles({
  title: {
    textAlign: 'left',
    fontSize: '20px',
    width: '100%'
  },
  taskComments: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'left',
    alignItems: 'left',
    backgroundColor: 'lightgray',
    padding: '5px',
  },
  commentHolder: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '5px',
    margin: '3px',
  },
  commentUser: {
    fontWeight: 'bold'
  },
  comment: {

  },
  commentDate: {
    fontSize: '13px',
  },
  input: {
    '& .fui-Input__input': {
      background: 'rgb(0, 0, 0, 0.1)',
      padding: '5px',
      height: '85%',
      marginTop: '3px',
      maxWidth: '200px'
    }
  },
  newComment: {
    width: '100%'
  },
  button: {
    borderRadius: '10px',
    background: 'rgb(0, 0, 0, 0.1)',
    marginTop: '3px',
    width: '100px'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  userCard: {
    width: '300px',
    marginBottom: '10px',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  spinner: {
    marginTop: '20px',
  },
  userContainer: {
    maxHeight: '735px',
    overflowY: 'scroll',
    overflowX: 'hidden',
    width: '100%',
  },
  role: {
    color: '#d13438'
  }
});

// Interface for comment
interface Comment {
  user: string;
  comment: string;
  date: string;
}

interface Task {
  id: string;
  name: string;
  desc: string;
  img: string;
  status: string;
  assigned_to: Array<String>;
  created_at: Date;
  comments: Comment[];
  installer: String;
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]); // Variable for storing tasks
  const [currentView, setCurrentView] = useState(""); // Variable for storing tasks
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({}); // Variable for storing new comments
  const styles = useStyles();
  const [assigning, setAssigning] = useState(true);
  const [reviewers, setReviewers] = useState([]);
  const [assignTo, setAssignTo] = useState("");

  async function displayTasks(view: string) {
    setCurrentView(view);
    const response = await axios.get(`http://localhost:8000/tasks/get-tasks?view=${view}&user=${localStorage.getItem('user')}`)
    setTasks(response.data.message);
  }

  async function changeStatus(value: string, id: string) {
    const body = new URLSearchParams();
    body.append('id', id);
    body.append('status', value);

    await axios.post('http://localhost:8000/tasks/update-status', body, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
  }

  function handleCommentChange(taskId: string, value: string) {
    setNewComment((prev) => ({ ...prev, [taskId]: value }));
  }

  // a function for submitting new comments
  async function submitComment(taskId: string) {
    const commentText = newComment[taskId];

    if (commentText) {
        const newComment: Comment = {
            user: localStorage.user, 
            comment: commentText,
            date: new Date().toLocaleDateString(),
        };

      const body = new URLSearchParams();
      body.append('taskId', taskId);
      body.append('user', localStorage.user);
      body.append('comment', commentText);
      body.append('date', new Date().toLocaleDateString());

      try {
        const response = await axios.post('http://localhost:8000/comments/create-comment', body, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        alert(response.data.message);

        const updatedTasks = tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, comments: [...task.comments, newComment] };
          }
          return task;
        });
        setTasks(updatedTasks);
        setNewComment((prev) => ({ ...prev, [taskId]: "" }));
      } catch (error) {
        console.error(error);
        alert("An unexpected error has occurred.");
      }
    }
  }

  // function for deleting comments
  async function deleteComment(taskId: string, commentIndex: number) {
    const body = new URLSearchParams();
      body.append('taskId', taskId);
      body.append('commentIndex', commentIndex.toString());

      try {
        const response = await axios.post('http://localhost:8000/comments/delete-comment', body, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        alert(response.data.message);

        const updatedTasks = tasks.map((task) => {
          if (task.id === taskId) {
            const updatedComments = task.comments.filter((_, index) => index !== commentIndex);
            return { ...task, comments: updatedComments };
          }
          return task;
        });
      
        setTasks(updatedTasks);
      } catch (error) {
        console.error(error);
        alert("An unexpected error has occurred.");
      }
  }

  async function displayReviwers(id: string) {
    const response = await axios.get(`http://localhost:8000/users/reviewers`)
    setReviewers(response.data.message);
    setAssignTo(id);
    //console.log(reviewers, "and", response.data.message, "are same");
    setAssigning(false);
  }

  async function assignToTask(reviewer: string) {
    const body = new URLSearchParams();
    body.append('id', assignTo);
    body.append('reviewer', reviewer);
    console.log(body);
    const response = await axios.post(`http://localhost:8000/tasks/assign-to`, body, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    alert(response.data.message);
    setReviewers([]);
    setAssignTo("");
    setAssigning(true);
  }

  function cancel() {
    setReviewers([]);
    setAssignTo("");
    setAssigning(true);
  }

  async function deleteTask(id: string) {
    const body = new URLSearchParams();
    body.append('id', id);

    try {
      await axios.post('http://localhost:8000/tasks/delete-task', body, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})

      setTasks(tasks => 
        tasks.filter(task => task.id !== id)
      );
    } catch (error) {
      alert("An unexpected error has occurred");
    }
  }

  // Initialize page
  useEffect(() => {
    if (localStorage.getItem('role') === 'reviewer') {
      displayTasks("your-tasks");
    } else if (localStorage.getItem('role') === 'uploader') {
      displayTasks("your-uploads");
    } else {
      displayTasks("unassigned-tasks");
    }
    
  }, []);

  return (
    <div className='tasksholder'>
      <nav className='tasknav'>
        <div className='task-option' onClick={() => displayTasks("all-tasks")}>
          All tasks
        </div>
      {localStorage.getItem('role') === 'reviewer' && (
        <div className='task-option' onClick={() => displayTasks("your-tasks")}>
          Your tasks
        </div>
      )}
      {localStorage.getItem('role') === 'uploader' && (
        <div className='task-option' onClick={() => displayTasks("your-uploads")}>
          Your Uploads
        </div>
      )}
      {localStorage.getItem('role') === 'admin' && (
        <div className='task-option' onClick={() => displayTasks("unassigned-tasks")}>
          Unassigned tasks
        </div>
      )}
      </nav>
      {assigning 
      ? <div className='task-content'>
      {
        tasks.map((task) => (
          <div className='task-item'>
            <img className='task-img' src={task.img} alt={task.name}/>

            <div className='task-info'> 
              <div className='task-name'>{task.name}</div>
              <div className='installer-name'>Installer: {task.installer}</div>
              <div className='installer-name'>Assigned: {task.assigned_to}</div>
              <div className='task-description'>Description: {task.desc}</div>
              {currentView === "unassigned-tasks" && (
                <div>
                  <div className={styles.button}>
                    <Button className='assignment-button' onClick={(e) => displayReviwers(task.id)}>ASSIGN</Button>
                  </div>
                  <div className={styles.button}>
                    <Button className='delete-button' onClick={(e) => deleteTask(task.id)}>DELETE</Button>
                  </div>
                </div>
              )}
              <div className='task-status'>
                <Label htmlFor="status-select">Status: </Label>
                {currentView === "your-tasks" ? (
                  <Dropdown id="status-select" placeholder={task.status}>
                    <Option onClick={(e) => changeStatus('Waiting', task.id)} value="Waiting">Waiting</Option>
                    <Option onClick={(e) => changeStatus('Approved', task.id)} value="Approved">Approved</Option>
                    <Option onClick={(e) => changeStatus('Denied', task.id)} value="Denied">Denied</Option>
                  </Dropdown>
                ) : (
                  <div>{task.status}</div>
                )}
              </div>
            </div>

          <div className={styles.taskComments}>
            <div className={styles.title}>Comments:</div>
            {task.comments.map((comment, index) => (
              <div className={styles.commentHolder} key={index}>
                <div className={styles.commentUser}>{comment.user}</div>
                <div className={styles.comment}>{comment.comment}</div>
                <div className={styles.commentDate}>{comment.date}</div>
                {localStorage.getItem("user") === comment.user && (
                  <div className={styles.button}>
                    <Button onClick={(event) => {event.preventDefault(); deleteComment(task.id, index);}}>Delete</Button>
                  </div>)}
              </div>
            ))}
            <div className={styles.newComment}>
              <Field>
                <Input
                  className={styles.input}
                  type="text"
                  maxLength={90}
                  placeholder="Add a comment"
                  value={newComment[task.id] || ""}
                  onChange={(e) => handleCommentChange(task.id, e.target.value)}
                />
              </Field>
                <div className={styles.button}>
                  <Button onClick={(event) => {event.preventDefault(); submitComment(task.id);}}>Submit</Button>
                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    : <div>
        {reviewers.map((reviewer) => (
            <Card key={reviewer} className={styles.userCard}>
            <Text>{reviewer}</Text>
            <CardFooter>
              <div className={styles.button}>
                <Button onClick={(e) => assignToTask(reviewer)}>Assign</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        <Button onClick={(e) => cancel()}>Cancel</Button>
      </div>}
    </div>
  );
}

export default TasksPage;