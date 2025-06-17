import React, { useState, useEffect } from 'react';
import api from '../services/api';

function CitalacList({ onEdit, onDeleteSuccess }) {
    const [citaoci, setCitaoci] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get('/citaoci');
                setCitaoci(response.data);
            } catch (err) {
                console.error("Greška pri dohvatanju čitalaca:", err);
                setError("Nije moguće dohvatiti čitaoce. Pokušajte ponovo.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Da li ste sigurni da želite da obrišete ovog čitaoca?')) {
            try {
                await api.delete(`/citaoci/${id}`);
                alert('Čitalac uspešno obrisan!');
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.response?.data || err.message;
                alert(`Greška pri brisanju čitaoca: ${errorMessage}`);
            }
        }
    };

    if (loading) return <p className="alert-info">Učitavanje čitalaca...</p>;
    if (error) return <p className="alert-danger">Greška: {error}</p>;

    return (
        <div className="citalac-list-container">
            <h2>Lista Čitalaca</h2>
            {citaoci.length === 0 ? (
                <p className="alert-info">Nema dostupnih čitalaca.</p>
            ) : (
                <div className="table-responsive-container">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Email</th>
                            <th>Akcije</th>
                        </tr>
                        </thead>
                        <tbody>
                        {citaoci.map(citalac => (
                            <tr key={citalac.id}>
                                <td>{citalac.id}</td>
                                <td>{citalac.ime}</td>
                                <td>{citalac.prezime}</td>
                                <td>{citalac.email}</td>
                                <td>
                                    <button className="btn-warning" onClick={() => onEdit(citalac)}>Izmeni</button>
                                    <button className="btn-danger" onClick={() => handleDelete(citalac.id)}>Obriši</button>
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

export default CitalacList;