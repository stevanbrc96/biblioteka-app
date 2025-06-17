import React, { useState, useEffect } from 'react';
import api from '../services/api';

function KnjigaForm({ onKnjigaAddedOrUpdated, initialKnjiga }) {
    const [knjiga, setKnjiga] = useState({
        id: null, naslov: '', autor: '', isbn: '', godinaIzdanja: '', brojKopija: '', dostupneKopije: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialKnjiga) {
            const godinaIzdanjaFormatted = initialKnjiga.godinaIzdanja
                ? new Date(initialKnjiga.godinaIzdanja).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : '';
            setKnjiga({
                id: initialKnjiga.id, naslov: initialKnjiga.naslov, autor: initialKnjiga.autor,
                isbn: initialKnjiga.isbn, godinaIzdanja: godinaIzdanjaFormatted,
                brojKopija: initialKnjiga.brojKopija, dostupneKopije: initialKnjiga.dostupneKopije
            });
            setMessage(''); setError(null);
        } else {
            setKnjiga({ id: null, naslov: '', autor: '', isbn: '', godinaIzdanja: '', brojKopija: '', dostupneKopije: '' });
            setMessage(''); setError(null);
        }
    }, [initialKnjiga]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setKnjiga(prevKnjiga => ({ ...prevKnjiga, [name]: value }));
        setMessage(''); setError(null);
    };

    const formatujDatumZaBackend = (srpskiDatum) => {
        if (!srpskiDatum || srpskiDatum.trim() === '') return null;
        const datumBezPoslednjeTacke = srpskiDatum.endsWith('.') ? srpskiDatum.slice(0, -1) : srpskiDatum;
        const delovi = datumBezPoslednjeTacke.split('.');
        if (delovi.length === 3) {
            const dan = parseInt(delovi[0].trim());
            const mesec = parseInt(delovi[1].trim());
            const godina = parseInt(delovi[2].trim());
            if (isNaN(dan) || isNaN(mesec) || isNaN(godina) || mesec < 1 || mesec > 12 || dan < 1 || dan > 31 || godina < 1000 || godina > new Date().getFullYear() + 10) {
                return null;
            }
            return `${godina}-${String(mesec).padStart(2, '0')}-${String(dan).padStart(2, '0')}`;
        } else {
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const godinaIzdanjaBackend = formatujDatumZaBackend(knjiga.godinaIzdanja);

        if (!knjiga.naslov || knjiga.naslov.trim() === '') { setError("Naslov je obavezan."); return; }
        if (!knjiga.autor || knjiga.autor.trim() === '') { setError("Autor je obavezan."); return; }
        if (!knjiga.isbn || knjiga.isbn.trim() === '') { setError("ISBN je obavezan."); return; }
        if (!knjiga.brojKopija || parseInt(knjiga.brojKopija) < 0) { setError("Broj kopija je obavezan i mora biti veći od 0."); return; }
        if (knjiga.godinaIzdanja.trim() !== '' && godinaIzdanjaBackend === null) { setError("Datum godine izdanja nije u ispravnom formatu (DD.MM.YYYY.)."); return; }

        const knjigaToSend = {
            ...knjiga,
            godinaIzdanja: godinaIzdanjaBackend,
            brojKopija: parseInt(knjiga.brojKopija),
            dostupneKopije: knjiga.id ? parseInt(knjiga.dostupneKopije) : undefined
        };

        try {
            let response;
            if (knjiga.id) {
                response = await api.put(`/knjige/${knjiga.id}`, knjigaToSend);
                setMessage(`Knjiga "${response.data.naslov}" uspešno ažurirana!`);
            } else {
                response = await api.post('/knjige', knjigaToSend);
                setMessage(`Knjiga "${response.data.naslov}" uspešno dodata!`);
            }
            setError(null);
            if (!knjiga.id) { setKnjiga({ id: null, naslov: '', autor: '', isbn: '', godinaIzdanja: '', brojKopija: '', dostupneKopije: '' }); }
            if (onKnjigaAddedOrUpdated) { onKnjigaAddedOrUpdated(); }
        } catch (err) {
            console.error("Greška pri slanju podataka:", err.response ? err.response.data : err.message);
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'string') {
                    setError(err.response.data);
                } else if (Array.isArray(err.response.data)) {
                    setError(err.response.data.join(', '));
                }
                else if (err.response.data.message) {
                    setError(err.response.data.message);
                } else if (err.response.data.error) {
                    setError(err.response.data.error);
                } else {
                    setError("Nepoznata greška sa servera.");
                }
            } else {
                setError("Došlo je do greške pri slanju podataka (moguće mrežni problem ili CORS).");
            }
            setMessage('');
        }
    };

    return (
        <div className="knjiga-form-container">
            <h2>{knjiga.id ? 'Izmeni knjigu' : 'Dodaj novu knjigu'}</h2>
            {message && <p className="alert-success">{message}</p>}
            {error && <p className="alert-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="naslov">Naslov:</label>
                    <input type="text" id="naslov" name="naslov" value={knjiga.naslov} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="autor">Autor:</label>
                    <input type="text" id="autor" name="autor" value={knjiga.autor} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="isbn">ISBN:</label>
                    <input type="text" id="isbn" name="isbn" value={knjiga.isbn} onChange={handleChange} required disabled={knjiga.id !== null} />
                </div>
                <div>
                    <label htmlFor="godinaIzdanja">Godina Izdanja (DD.MM.YYYY.):</label>
                    <input type="text" id="godinaIzdanja" name="godinaIzdanja" value={knjiga.godinaIzdanja} onChange={handleChange} placeholder="npr. 01.01.1943." />
                </div>
                <div>
                    <label htmlFor="brojKopija">Broj Kopija:</label>
                    <input type="number" id="brojKopija" name="brojKopija" value={knjiga.brojKopija} onChange={handleChange} min="0" required />
                </div>
                {knjiga.id && (
                    <div>
                        <label htmlFor="dostupneKopije">Dostupne Kopije:</label>
                        <input type="number" id="dostupneKopije" name="dostupneKopije" value={knjiga.dostupneKopije} onChange={handleChange} min="0" />
                    </div>
                )}
                <button type="submit" className="btn-success">{knjiga.id ? 'Ažuriraj knjigu' : 'Dodaj knjigu'}</button>
                {knjiga.id && (
                    <button type="button" className="btn-secondary" onClick={() => setKnjiga({ id: null, naslov: '', autor: '', isbn: '', godinaIzdanja: '', brojKopija: '', dostupneKopije: '' })}>
                        Otkaži izmenu
                    </button>
                )}
            </form>
        </div>
    );
}

export default KnjigaForm;