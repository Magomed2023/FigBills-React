import React, { useEffect, useState } from 'react';
import axios from "axios";
import toast from "react-hot-toast";
import "./bill.css";
import { Link } from 'react-router-dom';
import Logo from '../img/logo123.jpg';
import { isTokenValid } from '../getRegister/token';
import Pagination from './Pagination';
import Chart from 'chart.js/auto';
import moment from 'moment'; // date format

const Bill = () => {
  const [bills, setBills] = useState([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setLastUpdate] = useState(Date.now());
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [selectedSpedition, setSelectedSpedition] = useState(''); // State für ausgewählte Spedition
  const [searchTerm, setSearchTerm] = useState(''); // State für Suchbegriff


  const getMonthName = (monthIndex) => { // Monatsnamen für Chart
    const months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    return months[monthIndex];
  };

  // Daten für Chart
  const aggregateDataByMonth = (bills) => { 
    const aggregatedData = Array.from({ length: 12 }, (_, index) => ({
      month: index,
      rechnungsbetrag: 0,
      rechnungsbetragNeu: 0,
      differenz: 0,
    }));
    
    // Berechnung der Differenz für Chart
    bills.forEach((bill) => { 
      const month = new Date(bill.rechnungsDatum).getMonth();
      aggregatedData[month].rechnungsbetrag += bill.rechnungsBetrag;
      aggregatedData[month].rechnungsbetragNeu += bill.rechnungsBetragNeu;
      aggregatedData[month].differenz += bill.rechnungsBetrag - bill.rechnungsBetragNeu;
    });
  
    return aggregatedData;
  };
  
  

  // Überprüfung, ob Benutzer eingeloggt ist
  const isLoggedIn = isTokenValid();

  // Funktion zum Ausloggen
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setLastUpdate(Date.now());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Abruf von Daten unter Berücksichtigung der aktuellen Seite
        const response = await axios.get(`http://localhost:8000/api/getall?page=${currentPage}`);
        //console.log(response);
        setBills(response.data.data);
        setPages(response.data.pagination.pages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
 
    fetchData();
  }, [currentPage]); // Füge currentPage als Abhängigkeit hinzu

  // Funktion zum Löschen einer Rechnung

  const handleDeleteConfirm = async (billId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/delete/${billId}`);
      setBills((prevBill) => prevBill.filter((bill) => bill._id !== billId));
      toast.success(response.data.msg, { position: 'top-right' });
      setConfirmDelete(null); // Schließe das Bestätigungsmodal
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  // Charts
  useEffect(() => {
    let myChart = null;

    const renderChart = async () => {
        const ctx = document.getElementById('myChart').getContext('2d');

        try {
            // Chart-Daten abrufen
            const chartResponse = await axios.get(`http://localhost:8000/api/getall?useAll=true`);
            const aggregatedData = aggregateDataByMonth(chartResponse.data.data);

            const data = {
              labels: Array.from({ length: 12 }, (_, index) => getMonthName(index)),
              datasets: [
                {
                  label: 'Rechnungsbetrag',
                  data: aggregatedData.map((item) => item.rechnungsbetrag),
                  backgroundColor: 'rgba(23, 113, 215, 0.2)',
                  borderColor: 'rgba(23, 113, 215, 1)',
                  borderWidth: 1,
                },
                {
                  label: 'Rechnungsbetrag korrigiert',
                  data: aggregatedData.map((item) => item.rechnungsbetragNeu),
                  backgroundColor: 'rgba(236, 140, 22, 0.2)',
                  borderColor: 'rgba(236, 140, 22, 1)',
                  borderWidth: 1,
                },
                {
                  label: 'Differenz',
                  data: aggregatedData.map((item) => item.differenz),
                  backgroundColor: aggregatedData.map((item) =>
                    item.differenz >= 0 ? 'rgba(50, 205, 50, 0.2)' : 'rgba(255, 0, 0, 0.2)'
                  ),
                  borderColor: aggregatedData.map((item) =>
                    item.differenz >= 0 ? 'rgba(50, 205, 50, 1)' : 'rgba(255, 0, 0, 1)'
                  ),
                  borderWidth: 1,
                },
              ],
            };
            

        if (!myChart) {
            myChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    scales: {
                        x: { beginAtZero: true },
                        y: { beginAtZero: true },
                    },
                },
            });
        } else {
            // Aktualisiere die Chart-Daten
            myChart.data = data;
            myChart.update();
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Chart-Daten:', error);
    }
};

renderChart();

return () => {
    if (myChart) {
        myChart.destroy();
    }
};
}, [bills]);  // Füge bei Bedarf andere Abhängigkeiten hinzu

  return (
    <div className='billTable'>
      {/* Logo */}
      <Link to={"/"}>
        <img src={Logo} alt="Logo" className='logo' width="125" height="80" />
      </Link>

      {/* Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {!isLoggedIn && (
          <>
            <Link to={"/register"} className='regButton'>Registrieren</Link>
            <span style={{ margin: '0 10px' }}></span>
            <Link to={"/login"} className='logInButton'>Anmelden</Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <span style={{ margin: '0 10px' }}></span>
            <Link to={"/"} className='logInButton' onClick={logout}>Logout</Link>
          </>
        )}
        <span style={{ margin: '0 10px' }}></span>
      </div>

      {/* "Hinzufügen"-Button (nur sichtbar, wenn eingeloggt) */}
      {isLoggedIn && (
        <div className='addButtonContainer'>
          <Link to={"/add"} className='addButton'>Hinzufügen</Link>

          {/* Container für Dropdown-Liste und Suchfeld in der Mitte */}
          <div className='centerContainer'>
            {/* Dropdown-Liste für Speditionen */}
            <div className='dropdownContainer'>
              <select
                value={selectedSpedition}
                onChange={(e) => setSelectedSpedition(e.target.value)}
                className='speditionDropdown'
              >
                <option value="">Alle Speditionen</option>
                <option value="spedition1">Spedition 1</option>
                <option value="spedition2">Spedition 2</option>
                <option value="spedition3">Spedition 3</option>
              </select>
            </div>

            {/* Suchfeld */}
            <div className='searchContainer'>
              <input
                type="text"
                placeholder="Suche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='searchInput'
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabelle */}
      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>Tour Nr.:</th>
            <th>Datum:</th>
            <th>Netto Betrag:</th>
            <th>Betrag korrigiert:</th>
            <th>Differenz:</th>
            {/* Optionen-Spalte (nur sichtbar, wenn eingeloggt) */}
            {isLoggedIn && (<th>Optionen</th>)}
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => {
            // Berechnung der Differenz
            const Differenz = (bill.rechnungsBetrag - bill.rechnungsBetragNeu).toFixed(2);
            const amountClass = Differenz >= 0 ? 'positiveAmount' : 'negativeAmount';

            return (
              <tr key={bill._id}>
                <td>{bill.rechnungsNummer}</td>
                <td>{moment(bill.rechnungsDatum).format('DD.MM.YYYY')}</td>
                <td>{bill.rechnungsBetrag.toFixed(2)}</td>
                <td>{bill.rechnungsBetragNeu.toFixed(2)}</td>
                <td className={amountClass}>{Differenz}</td>
                {/* Aktionen (nur sichtbar, wenn eingeloggt) */}
                {isLoggedIn && (
                  <td className='actionButtons'>
                      <button onClick={() => setConfirmDelete(bill._id)}>
                        <i className="fa-solid fa-trash"></i>Löschen
                      </button>
                      {confirmDelete && (
                        <div className="delete-modal">
                          <p>Möchten Sie die Rechnung wirklich löschen?</p>
                        <div>
                          <button onClick={() => handleDeleteConfirm(confirmDelete)}>Löschen</button>
                          <button onClick={() => setConfirmDelete(null)}>Abbrechen</button>
                        </div>
                      </div>
                          )}
                    <Link to={`/edit/` + bill._id}>
                      <i className="fa-solid fa-pen-to-square"></i>Bearbeiten
                    </Link>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Pagination-Komponente */}
      <Pagination
        data={bills}
        currentPage={currentPage}
        pages={pages}
        onPageChange={(page) => setCurrentPage(page)}
        className="pagination"
      />
        <div style={{ width: "100%", height: "400px", position: "relative" }}>
        <canvas id="myChart" style={{ width: "100%", height: "100%" }}></canvas>
      </div>
    </div>
  );
};

export default Bill;
