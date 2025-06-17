import React, { useState, useEffect } from 'react';
import api from '../services/api';

function KnjigaList({ onEdit, onDeleteSuccess }) {
    const [knjige, setKnjige] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKnjige = async () => {
            try {
                const response = await api.get('/knjige');
                setKnjige(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Greška pri dohvatanju knjiga:", err);
                setError("Nije moguće dohvatiti knjige. Pokušajte ponovo.");
                setLoading(false);
            }
        };
        fetchKnjige();
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

    const handleDelete = async (id) => {
        if (window.confirm('Da li ste sigurni da želite da obrišete ovu knjigu?')) {
            try {
                await api.delete(`/knjige/${id}`);
                alert('Knjiga uspešno obrisana!');
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            } catch (err) {
                console.error("Greška pri brisanju knjige:", err.response ? err.response.data : err.message);
                const errorMessage = err.response && err.response.data ? err.response.data : err.message;
                alert(`Greška pri brisanju knjige: ${errorMessage}`);
            }
        }
    };

    if (loading) return <p className="alert-info">Učitavanje knjiga...</p>;
    if (error) return <p className="alert-danger">Greška: {error}</p>;

    return (
        <div className="knjiga-list-container">
            <h2>Lista Knjiga</h2>
            {knjige.length === 0 ? (
                <p className="alert-info">Nema dostupnih knjiga.</p>
            ) : (
                <div className="table-responsive-container">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Naslov</th>
                            <th>Autor</th>
                            <th>ISBN</th>
                            <th>Godina Izdanja</th>
                            <th>Ukupno kopija</th>
                            <th>Dostupno</th>
                            <th>Akcije</th>
                        </tr>
                        </thead>
                        <tbody>
                        {knjige.map(knjiga => (
                            <tr key={knjiga.id}>
                                <td>{knjiga.id}</td>
                                <td>{knjiga.naslov}</td>
                                <td>{knjiga.autor}</td>
                                <td>{knjiga.isbn}</td>
                                <td>{formatujDatumZaPrikaz(knjiga.godinaIzdanja)}</td>
                                <td>{knjiga.brojKopija}</td>
                                <td>{knjiga.dostupneKopije}</td>
                                <td>
                                    <button className="btn-warning" onClick={() => onEdit(knjiga)}>Izmeni</button>
                                    <button className="btn-danger" onClick={() => handleDelete(knjiga.id)}>Obriši</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default KnjigaList;