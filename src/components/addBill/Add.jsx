import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./add.css";
import toast from 'react-hot-toast';

const Add = () => {

  const bills = {
    rechnungsNummer:"",
    rechnungsBetrag:"",
    rechnungsBetragNeu:"",
    rechnungsDatum: ""
    
  }

  const [bill, setBill] = useState(bills);
  const navigate = useNavigate();

  const inputHandler = (e) =>{
      const {name, value} = e.target;
      setBill({...bill, [name]:value});
  }

  const submitForm = async(e) =>{
    e.preventDefault();
    await axios.post("http://localhost:8000/api/create", bill)
    .then((response)=>{
       toast.success(response.data.msg, {position:"top-right"})
       navigate("/")
    })
    .catch(error => console.log(error))
  }


  return (
    <div className='addBill'>
        <Link to={"/"}>Zurück</Link>
        <h3>Rechnung Hinzufügen</h3>
        <form className='addBillForm' onSubmit={submitForm}>
            <div className="inputGroup">
                <label htmlFor="rechnungsNummer">Tour Nr.:</label>
                <input type="text" onChange={inputHandler} id="rechnungsNummer" name="rechnungsNummer" autoComplete='off' placeholder='Rechnungsnummer' />
            </div>
            <div className="inputGroup">
                <label htmlFor="rechnungsBetrag">Rechnungsbetrag:</label>
                <input type="text" onChange={inputHandler} id="rechnungsBetrag" name="rechnungsBetrag" autoComplete='off' placeholder='Rechnungsbetrag' />
            </div>
            <div className="inputGroup">
                <label htmlFor="rechnungsBetragNeu">Rechnungsbetrag Neu:</label>
                <input type="text" onChange={inputHandler} id="rechnungsBetragNeu" name="rechnungsBetragNeu" autoComplete='off' placeholder='Rechnungsbetrag Neu' />
            </div>
            <div className="inputGroup">
                <label htmlFor="rechnungsDatum">Rechnungsdatum:</label>
                <input type="date" onChange={inputHandler} id="rechnungsDatum" name="rechnungsDatum" autoComplete='off' placeholder='Rechnungsdatum' />
            </div>
            <div className="inputGroup">
                <button type="submit">Hinzufügen</button>
            </div>
        </form>
    </div>
  )
}

export default Add