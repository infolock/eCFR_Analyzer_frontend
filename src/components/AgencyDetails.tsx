import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Agency } from '../constants/Agency';

const AgencyDetails = () => {
    const { slug } = useParams();
    const [agency, setAgency] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5001/api/agencies/${slug}`)
            .then((res) => res.json())
            .then((data) => setAgency(data))
            .catch((err) => console.error('Error fetching data:', err));
    }, []);

    return (
        <div>
            <h2>Agency Details</h2>
            <pre>{JSON.stringify(agency, null, 2)}</pre>
        </div>
    );
};

export default AgencyDetails;
