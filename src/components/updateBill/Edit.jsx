import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import "../addBill/add.css";
import toast from 'react-hot-toast';

const Edit = () => {

 const bills = {
    rechnungsNummer:"",
    rechnungsBetrag:"",
    rechnungsBetragNeu:""
    
  }

 const {id} = useParams();
 const navigate = useNavigate();
 const [bill, setBill] = useState(bills);

 const inputChangeHandler = (e) =>{
    const {name, value} = e.target;
    setBill({...bill, [name]:value});
    console.log(bill);
 }

 useEffect(()=>{
    axios.get(`http://localhost:8000/api/getone/${id}`)
    .then((response)=>{
        setBill(response.data)
    })
    .catch((error)=>{
        console.log(error);
    })
 },[id])


 const submitForm = async(e)=>{
    e.preventDefault();
    await axios.put(`http://localhost:8000/api/update/${id}`, bill)
    .then((response)=>{
       toast.success(response.data.msg, {position:"top-right"})
       navigate("/")
    })
    .catch(error => console.log(error))
 }

  return (
    <div className='addBill'>
        <Link to={"/"}>Zurück</Link>
        <h3>Update Bill</h3>
        <form className='addBillForm' onSubmit={submitForm}>
            <div className="inputGroup">
                <label htmlFor="rechnungsNummer">Rechnungsnummer:</label>
                <input type="text" value={bill.rechnungsNummer} onChange={inputChangeHandler} id="rechnungsNummer" name="rechnungsNummer" autoComplete='off' placeholder='Rechnungsnummer' />
            </div>
            <div className="inputGroup">
                <label htmlFor="rechnungsBetrag">Rechnungsbetrag:</label>
                <input type="text" value={bill.rechnungsBetrag} onChange={inputChangeHandler} id="rechnungsBetrag" name="rechnungsBetrag" autoComplete='off' placeholder='Rechnungsbetrag' />
            </div>
            <div className="inputGroup">
                <label htmlFor="rechnungsBetragNeu">Rechnungsbetrag Neu:</label>
                <input type="text" value={bill.rechnungsBetragNeu} onChange={inputChangeHandler} id="rechnungsBetragNeu" name="rechnungsBetragNeu" autoComplete='off' placeholder='Rechnungsbetrag Neu' />
            </div>
            <div className="inputGroup">
                <label htmlFor="rechnungsDatum">Datum:</label>
                <input type="date" value={bill.rechnungsBetragNeu} onChange={inputChangeHandler} id="rechnungsDatum" name="rechnungsDatum" autoComplete='off' placeholder='rechnungsDatum' />
            </div>
            <div className="inputGroup">
                <button type="submit">Bearbeiten</button>
            </div>
        </form>
    </div>
  )
}

export default Edit