import { useEffect, useState } from 'react';
import { makeStyles } from '@griffel/react';
import { Card, Text, Spinner, CardFooter, Button, Select, useId, SelectProps } from '@fluentui/react-components';
import { PersonDelete24Regular } from "@fluentui/react-icons";
import axios from 'axios';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
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

interface User {
  id: string;
  username: string;
  role: string;
}

function UsersPage(props: SelectProps) {
  const classes = useStyles();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const selectId = useId();

  async function deleteUser(id:string) {
    const body = new URLSearchParams();
    body.append('id', id);

    try {
      await axios.post('http://localhost:8000/users/delete', body, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})

      setUsers(users => 
        users.filter(user => user.id !== id)
      );
    } catch (error) {
      alert("An unexpected error has occurred");
    }
  }

  async function changeRole(id:string, role:string) {
    const body = new URLSearchParams();
    body.append('id', id);
    body.append('role', role)

    try {
      await axios.post('http://localhost:8000/users/updaterole', body, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});

      setUsers(users => 
        users.map(user => 
          user.id === id ? { ...user, role: role } : user
        )
      );
    } catch (error) {
      alert("An unexpected error has occurred");
    }
  }

  useEffect(() => {
    fetch('http://localhost:8000/users/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then((data) => {
        const Users: User[] = data.users.map((user: any) => ({
          id: user.id,
          username: user.username,
          role: user.role
        }));
        setUsers(Users);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner className={classes.spinner} label="Loading users..." />;
  }

  return (
    <div className={classes.container}>
      <Text className={classes.title} block>
        User List
      </Text>
      <div className={classes.userContainer}>
        {users.map((user) => (
          <Card key={user.id} className={classes.userCard}>
            <Text>{user.username}</Text>
            <Text>ID: {user.id}</Text>
            <Text className={classes.role}>{user.role}</Text>
            <CardFooter>
              {user.username !== localStorage.getItem('user') && localStorage.getItem('role') === "admin" && (
                <>
                  <Button icon={<PersonDelete24Regular />} onClick={() => deleteUser (user.id)}>Delete</Button>
                  <Select id={selectId} {...props} onChange={(e) => changeRole(user.id, e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="uploader">Uploader</option>
                  </Select>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UsersPage;