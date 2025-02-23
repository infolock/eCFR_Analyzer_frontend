import './App.css';
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom'; // Change to NavLink
import TitlesList from './components/TitlesList';
import AgenciesList from './components/AgenciesList';
import AgencyDetails from './components/AgencyDetails';

const MainPage = () => {
    return (
        <div>
            <h1>About this Project</h1>
            <p>
                The goal of this website is to create a simple solution to analyze Federal Regulations. The eCFR is available at{' '}
                <a href="https://www.ecfr.gov">https://www.ecfr.gov/</a>. There is a public api for it.
            </p>
            <p>We download the current eCFR and analyze it for items such as word count per agency and historical changes over time.</p>
        </div>
    );
};

const App = () => (
    <div>
        <header id="ecfr-header">
            <div className="container">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="title">
                            <h1>ECFR Analyzer</h1>
                        </div>
                        <nav>
                            <ul>
                                <li>
                                    {/* Using NavLink to add "active" class */}
                                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                                        Home
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/titles" className={({ isActive }) => (isActive ? 'active' : '')}>
                                        Titles
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/agencies" className={({ isActive }) => (isActive ? 'active' : '')}>
                                        Agencies
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
        <main id="main-content">
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/titles" element={<TitlesList />} />
                <Route path="/agencies" element={<AgenciesList />} />
                <Route path="/agencies/:slug" element={<AgencyDetails />} />
            </Routes>
        </main>
    </div>
);

export default App;
