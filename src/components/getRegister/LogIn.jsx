
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginX.css';
import { toast } from 'react-hot-toast';

const Login = () => {
  const userCredentials = {
    Email: '',
    Passwort: ''
  };

  const [credentials, setCredentials] = useState(userCredentials);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8000/api/login', credentials);
        const { token } = response.data;

        // Speichern Sie den Token im lokalen Speicher
        localStorage.setItem('token', token);

        toast.success('Anmeldung erfolgreich.', { position: 'top-right' });
        navigate('/');
    } catch (error) {
        console.error(error);
        toast.error('Fehler bei der Anmeldung.', { position: 'top-right' });
    }
};

  

  return (
    <div className='userRegister'>
      <Link to={"/"}>Zurück</Link>
      <h3>Anmeldung</h3>
      <form className='userRegisterForm' onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="Email">E-Mail Adresse:</label>
          <input type="text" onChange={inputHandler} id="Email" name="Email" autoComplete='off' placeholder='' />
        </div>
        <div className="inputGroup">
          <label htmlFor="Passwort">Passwort:</label>
          <input type="password" onChange={inputHandler} id="Passwort" name="Passwort" autoComplete='off' placeholder='' />
        </div>
        <div className="inputGroup">
          <button type="submit">Anmelden</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
