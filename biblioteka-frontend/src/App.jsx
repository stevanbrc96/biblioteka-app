import React, { useState } from 'react';
import KnjigaList from './components/KnjigaList';
import KnjigaForm from './components/KnjigaForm';
import CitalacList from './components/CitalacList';
import CitalacForm from './components/CitalacForm';
import IznajmljivanjeList from './components/IznajmljivanjeList';
import IznajmljivanjeForm from './components/IznajmljivanjeForm';
import './App.css';

function App() {
    const [refreshKnjigaListKey, setRefreshKnjigaListKey] = useState(0);
    const [knjigaToEdit, setKnjigaToEdit] = useState(null);
    const [refreshCitalacListKey, setRefreshCitalacListKey] = useState(0);
    const [citalacToEdit, setCitalacToEdit] = useState(null);
    const [refreshIznajmljivanjeListKey, setRefreshIznajmljivanjeListKey] = useState(0);
    const [activeTab, setActiveTab] = useState('knjige');

    const handleKnjigaAddedOrUpdated = () => {
        setRefreshKnjigaListKey(prev => prev + 1);
        setKnjigaToEdit(null);
    };
    const handleEditKnjiga = (knjiga) => {
        setKnjigaToEdit(knjiga);
        setActiveTab('knjige');
        window.scrollTo(0, 0);
    };
    const handleDeleteKnjigaSuccess = () => {
        setRefreshKnjigaListKey(prev => prev + 1);
        setKnjigaToEdit(null);
    };

    const handleCitalacAddedOrUpdated = () => {
        setRefreshCitalacListKey(prev => prev + 1);
        setCitalacToEdit(null);
    };
    const handleEditCitalac = (citalac) => {
        setCitalacToEdit(citalac);
        setActiveTab('citaoci');
        window.scrollTo(0, 0);
    };
    const handleDeleteCitalacSuccess = () => {
        setRefreshCitalacListKey(prev => prev + 1);
        setCitalacToEdit(null);
    };

    const handleRentalActionCompleted = () => {
        setRefreshIznajmljivanjeListKey(prev => prev + 1);
        setRefreshKnjigaListKey(prev => prev + 1);
    };

    return (
        <div className="App">
            <header className="main-header">
                <h1>Sistem za Upravljanje Bibliotekom</h1>
            </header>

            <main className="main-content">
                <div className="tab-container">
                    <div className="nav-buttons">
                        <button
                            className={activeTab === 'knjige' ? 'active' : ''}
                            onClick={() => setActiveTab('knjige')}
                        >
                            Knjige
                        </button>
                        <button
                            className={activeTab === 'citaoci' ? 'active' : ''}
                            onClick={() => setActiveTab('citaoci')}
                        >
                            Čitaoci
                        </button>
                        <button
                            className={activeTab === 'iznajmljivanja' ? 'active' : ''}
                            onClick={() => setActiveTab('iznajmljivanja')}
                        >
                            Iznajmljivanja
                        </button>
                    </div>

                    {activeTab === 'knjige' && (
                        <>
                            <KnjigaForm
                                initialKnjiga={knjigaToEdit}
                                onKnjigaAddedOrUpdated={handleKnjigaAddedOrUpdated}
                            />
                            <KnjigaList
                                key={refreshKnjigaListKey}
                                onEdit={handleEditKnjiga}
                                onDeleteSuccess={handleDeleteKnjigaSuccess}
                            />
                        </>
                    )}

                    {activeTab === 'citaoci' && (
                        <>
                            <CitalacForm
                                initialCitalac={citalacToEdit}
                                onCitalacAddedOrUpdated={handleCitalacAddedOrUpdated}
                            />
                            <CitalacList
                                key={refreshCitalacListKey}
                                onEdit={handleEditCitalac}
                                onDeleteSuccess={handleDeleteCitalacSuccess}
                            />
                        </>
                    )}

                    {activeTab === 'iznajmljivanja' && (
                        <>
                            <IznajmljivanjeForm onRentalAdded={handleRentalActionCompleted} />
                            <IznajmljivanjeList
                                key={refreshIznajmljivanjeListKey}
                                onRentalReturned={handleRentalActionCompleted}
                                onDeleteSuccess={handleRentalActionCompleted}
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;