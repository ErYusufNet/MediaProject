import { useNavigate } from 'react-router-dom';
import '../assets/styles/navbar.css';

// Set up values for component
interface InputProps {
  changeView: (value: string) => void;
}

export function NavBar({ changeView }: InputProps) {
  const navigate = useNavigate();

  // Send signal to parent when an option is pressed
  function handleClick(value: string) {
    changeView(value);
  }

  // Logout function (change when server is implemented)
  function logout() {
    localStorage.removeItem('user');
    navigate('/login');
  }

  if (localStorage.getItem('role') == 'admin') {
    return (
      <div className="navbar">
        <h1>BuildScope</h1>
        <nav>
          <div className='sidebar-option' onClick={() => handleClick('tasks')}>Tasks</div>
          <div className='sidebar-option' onClick={() => handleClick('users')}>Users</div>
        </nav>
        <div className='usercontent'>
          <div className='user'>
            {localStorage.getItem('user')}
            <p></p>
            {localStorage.getItem('role')}
            <div className='logout' onClick={logout}>log out</div>
          </div>
        </div>
      </div>
    );
  } else if (localStorage.getItem('role') == 'reviewer') {
    return (
      <div className="navbar">
        <h1>BuildScope</h1>
        <nav>
          <div className='sidebar-option' onClick={() => handleClick('tasks')}>Tasks</div>
        </nav>
        <div className='usercontent'>
          <div className='user'>
            {localStorage.getItem('user')}
            <p></p>
            {localStorage.getItem('role')}
            <div className='logout' onClick={logout}>log out</div>
          </div>
        </div>
      </div>
    );
  } else if (localStorage.getItem('role') == 'uploader') {
    return (
      <div className="navbar">
        <h1>BuildScope</h1>
        <nav>
          <div className='sidebar-option' onClick={() => handleClick('tasks')}>Tasks</div>
          <div className='sidebar-option' onClick={() => handleClick('upload')}>Upload</div>
        </nav>
        <div className='usercontent'>
          <div className='user'>
            {localStorage.getItem('user')}
            <p></p>
            {localStorage.getItem('role')}
            <div className='logout' onClick={logout}>log out</div>
          </div>
        </div>
      </div>
    )
  }
  console.log(localStorage.getItem('role'))
  return (
    <div className="navbar">
      <h1>BuildScope</h1>
      <nav>
        <div className='sidebar-option' onClick={() => handleClick('tasks')}>Tasks</div>
        <div className='sidebar-option' onClick={() => handleClick('upload')}>Upload</div>
        <div className='sidebar-option' onClick={() => handleClick('users')}>Users</div>
      </nav>
      <div className='usercontent'>
        <div className='user'>
          {localStorage.getItem('user')}
          <p></p>
          {localStorage.getItem('role')}
          <div className='logout' onClick={logout}>log out</div>
        </div>
      </div>
    </div>
  );
}