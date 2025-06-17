import React, { useState, useEffect } from 'react';
import api from '../services/api';

function CitalacForm({ onCitalacAddedOrUpdated, initialCitalac }) {
    const [citalac, setCitalac] = useState({
        id: null, ime: '', prezime: '', email: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialCitalac) {
            setCitalac({
                id: initialCitalac.id, ime: initialCitalac.ime, prezime: initialCitalac.prezime, email: initialCitalac.email
            });
            setMessage(''); setError(null);
        } else {
            setCitalac({ id: null, ime: '', prezime: '', email: '' });
            setMessage(''); setError(null);
        }
    }, [initialCitalac]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCitalac(prevCitalac => ({ ...prevCitalac, [name]: value }));
        setMessage(''); setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!citalac.ime || citalac.ime.trim() === '') { setError("Ime je obavezno."); return; }
        if (!citalac.prezime || citalac.prezime.trim() === '') { setError("Prezime je obavezno."); return; }
        if (!citalac.email || citalac.email.trim() === '') { setError("Email je obavezan."); return; }
        if (!/\S+@\S+\.\S+/.test(citalac.email)) { setError("Email nije u ispravnom formatu."); return; }

        try {
            let response;
            if (citalac.id) {
                response = await api.put(`/citaoci/${citalac.id}`, citalac);
                setMessage(`Čitalac "${response.data.ime} ${response.data.prezime}" uspešno ažuriran!`);
            } else {
                response = await api.post('/citaoci', citalac);
                setMessage(`Čitalac "${response.data.ime} ${response.data.prezime}" uspešno dodat!`);
            }
            setError(null);
            if (!citalac.id) { setCitalac({ id: null, ime: '', prezime: '', email: '' }); }
            if (onCitalacAddedOrUpdated) { onCitalacAddedOrUpdated(); }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data || err.message;
            setError(errorMessage || "Greška pri povezivanju sa serverom.");
        }
    };

    return (
        <div className="citalac-form-container">
            <h2>{citalac.id ? 'Izmeni čitaoca' : 'Dodaj novog čitaoca'}</h2>
            {message && <p className="alert-success">{message}</p>}
            {error && <p className="alert-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="ime">Ime:</label>
                    <input type="text" id="ime" name="ime" value={citalac.ime} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="prezime">Prezime:</label>
                    <input type="text" id="prezime" name="prezime" value={citalac.prezime} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={citalac.email} onChange={handleChange} required disabled={citalac.id !== null} />
                </div>
                <button type="submit" className="btn-success">
                    {citalac.id ? 'Ažuriraj čitaoca' : 'Dodaj čitaoca'}
                </button>
                {citalac.id && (
                    <button type="button" className="btn-secondary" onClick={() => setCitalac({ id: null, ime: '', prezime: '', email: '' })}>
                        Otkaži izmenu
                    </button>
                )}
            </form>
        </div>
    );
}

export default CitalacForm;