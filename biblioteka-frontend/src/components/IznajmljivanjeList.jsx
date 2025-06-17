import React, { useState, useEffect } from 'react';
import api from '../services/api';

function IznajmljivanjeList({ onRentalReturned, onDeleteSuccess }) {
    const [iznajmljivanja, setIznajmljivanja] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get('/iznajmljivanja');
                setIznajmljivanja(response.data);
            } catch (err) {
                console.error("Greška pri dohvatanju iznajmljivanja:", err);
                setError("Nije moguće dohvatiti iznajmljivanja. Pokušajte ponovo.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const formatujDatumZaPrikaz = (isoDatumString) => {
        if (!isoDatumString) return 'N/A';
        try {
            const date = new Date(isoDatumString);
            return date.toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {
            console.error("Greška pri formatiranju datuma za prikaz:", e);
            return isoDatumString;
        }
    };

    const handleReturn = async (rentalId) => {
        if (window.confirm('Da li ste sigurni da želite da zabeležite povratak ove knjige?')) {
            try {
                await api.put(`/iznajmljivanja/vrati/${rentalId}`);
                alert('Knjiga uspešno vraćena!');
                if (onRentalReturned) {
                    onRentalReturned();
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.response?.data || err.message;
                alert(`Greška pri vraćanju knjige: ${errorMessage}`);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Da li ste sigurni da želite da obrišete ovaj zapis? Akcija se ne može opozvati.')) {
            try {
                await api.delete(`/iznajmljivanja/${id}`);
                alert('Zapis o iznajmljivanju uspešno obrisan!');
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.response?.data || err.message;
                alert(`Greška pri brisanju zapisa: ${errorMessage}`);
            }
        }
    };

    if (loading) return <p className="alert-info">Učitavanje iznajmljivanja...</p>;
    if (error) return <p className="alert-danger">Greška: {error}</p>;

    return (
        <div className="iznajmljivanje-list-container">
            <h2>Lista Iznajmljivanja</h2>
            {iznajmljivanja.length === 0 ? (
                <p className="alert-info">Nema dostupnih iznajmljivanja.</p>
            ) : (
                <div className="table-responsive-container">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Knjiga (Naslov)</th>
                            <th>Knjiga (Autor)</th>
                            <th>Čitalac (Ime i Prezime)</th>
                            <th>Datum Iznajmljivanja</th>
                            <th>Datum Vraćanja</th>
                            <th>Status</th>
                            <th>Akcije</th>
                        </tr>
                        </thead>
                        <tbody>
                        {iznajmljivanja.map(rental => {
                            const { id, knjiga, citalac, datumIznajmljivanja, datumVracanja } = rental;
                            return (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{knjiga ? knjiga.naslov : 'N/A'}</td>
                                    <td>{knjiga ? knjiga.autor : 'N/A'}</td>
                                    <td>
                                        {citalac ? `${citalac.ime} ${citalac.prezime}` : 'N/A'}
                                    </td>
                                    <td>{formatujDatumZaPrikaz(datumIznajmljivanja)}</td>
                                    <td>{formatujDatumZaPrikaz(datumVracanja)}</td>
                                    <td className={datumVracanja ? 'text-success' : 'text-danger'}>
                                        {datumVracanja ? 'Vraćeno' : 'Iznajmljeno'}
                                    </td>
                                    <td>
                                        {!datumVracanja && (
                                            <button className="btn-primary" onClick={() => handleReturn(id)}>
                                                Vrati knjigu
                                            </button>
                                        )}
                                        <button className="btn-danger" onClick={() => handleDelete(id)}>Obriši</button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default IznajmljivanjeList;