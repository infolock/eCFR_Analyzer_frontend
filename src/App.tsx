import './App.css';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TitlesList from './components/TitlesList';
import AgenciesList from './components/AgenciesList';
import AgencyDetails from './components/AgencyDetails';

function MainPage() {
    return (
        <div>
            <h1>eCFR Analyzer</h1>
            <p>Select a page:</p>
        </div>
    );
}

function App() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">eCFR Anlyzer</Link>
                    </li>
                    <li>
                        <Link to="/titles">Titles</Link>
                    </li>
                    <li>
                        <Link to="/agencies">Agencies</Link>
                    </li>
                </ul>
            </nav>

            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/titles" element={<TitlesList />} />
                <Route path="/agencies" element={<AgenciesList />} />
                <Route path="/agencies/:slug" element={<AgencyDetails />} />
            </Routes>
        </div>
    );
}

export default App;
