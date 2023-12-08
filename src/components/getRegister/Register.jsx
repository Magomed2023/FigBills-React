// register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';
import toast from 'react-hot-toast';

const Register = () => {
  const users = {
    Name: '',
    Email: '',
    Passwort: ''
  };

  const [user, setReg] = useState(users);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setReg({ ...user, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/register', user)
      .then((response) => {
        toast.success(response.data.msg, { position: 'top-right' });
        navigate('/');
      })
      .catch(error => console.log(error));
  };

  return (
    <div className='userRegister'>
      <Link to={"/"}>Zurück</Link>
      <h3>Registrierung</h3>
      <form className='userRegisterForm' onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="Name">Name:</label>
          <input type="text" onChange={inputHandler} id="Name" name="Name" autoComplete='off' placeholder='' />
        </div>
        <div className="inputGroup">
          <label htmlFor="Email">E-Mail Adresse:</label>
          <input type="text" onChange={inputHandler} id="Email" name="Email" autoComplete='off' placeholder='' />
        </div>
        <div className="inputGroup">
          <label htmlFor="Passwort">Passwort:</label>
          <input type="text" onChange={inputHandler} id="Passwort" name="Passwort" autoComplete='off' placeholder='' />
        </div>
        <div className="inputGroup">
          <button type="submit">Registrieren</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
