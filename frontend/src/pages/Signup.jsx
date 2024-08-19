import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }), // Include role
      });

      const result = await response.json();

      if (response.status === 201) {
        alert(result.message);
        navigate('/login');
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form className='form' onSubmit={handleSignup}>
        <input
          type='text'
          placeholder='Username'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <input
          type='email'
          placeholder='Email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type='password'
          placeholder='Password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="organizer">Organizer</option>
        </select><br />
        <button type='submit'>Signup</button>
        <Link className="nav-link nav-anchor" to="/login">
          Existing User? Login
        </Link>
      </form>
    </div>
  );
};
