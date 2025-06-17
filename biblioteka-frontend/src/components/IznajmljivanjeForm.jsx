import React, { useState, useEffect } from 'react';
import api from '../services/api';

function IznajmljivanjeForm({ onRentalAdded }) {
    const [knjige, setKnjige] = useState([]);
    const [citaoci, setCitaoci] = useState([]);
    const [selectedKnjigaId, setSelectedKnjigaId] = useState('');
    const [selectedCitalacId, setSelectedCitalacId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const knjigeResponse = await api.get('/knjige');
                setKnjige(knjigeResponse.data.filter(k => k.dostupneKopije > 0));

                const citaociResponse = await api.get('/citaoci');
                setCitaoci(citaociResponse.data);
            } catch (err) {
                console.error("Greška pri dohvatanju podataka:", err);
                setError("Nije moguće dohvatiti knjige ili čitaoce.");
            }
        })();
    }, []);

    const handleRentalSuccess = () => {
        (async () => {
            try {
                const knjigeResponse = await api.get('/knjige');
                setKnjige(knjigeResponse.data.filter(k => k.dostupneKopije > 0));
            } catch (err) {
                console.error("Greška pri dohvatanju knjiga:", err);
            }
        })();

        if (onRentalAdded) {
            onRentalAdded();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage('');

        if (!selectedKnjigaId || !selectedCitalacId) {
            setError("Molimo izaberite i knjigu i čitaoca.");
            return;
        }

        const iznajmljivanjeData = {
            knjigaId: parseInt(selectedKnjigaId),
            citalacId: parseInt(selectedCitalacId)
        };

        try {
            await api.post('/iznajmljivanja', iznajmljivanjeData);
            setMessage(`Knjiga je uspešno iznajmljena!`);
            setSelectedKnjigaId('');
            setSelectedCitalacId('');
            handleRentalSuccess();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data || err.message;
            setError(errorMessage || "Greška pri povezivanju sa serverom.");
        }
    };

    return (
        <div className="iznajmljivanje-form-container">
            <h2>Iznajmi knjigu</h2>
            {message && <p className="alert-success">{message}</p>}
            {error && <p className="alert-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="knjiga">Izaberite knjigu:</label>
                    <select
                        id="knjiga"
                        value={selectedKnjigaId}
                        onChange={(e) => setSelectedKnjigaId(e.target.value)}
                        required
                    >
                        <option value="">-- Izaberite knjigu --</option>
                        {knjige.map(k => (
                            <option key={k.id} value={k.id}>
                                {k.naslov} ({k.dostupneKopije} dostupno)
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="citalac">Izaberite čitaoca:</label>
                    <select
                        id="citalac"
                        value={selectedCitalacId}
                        onChange={(e) => setSelectedCitalacId(e.target.value)}
                        required
                    >
                        <option value="">-- Izaberite čitaoca --</option>
                        {citaoci.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.ime} {c.prezime}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn-primary">Iznajmi knjigu</button>
            </form>
        </div>
    );
}

export default IznajmljivanjeForm;