import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDomain } from '../env';

const AgencyDetails = () => {
    const { slug } = useParams();
    const [agency, setAgency] = useState([]);

    useEffect(() => {
        fetch(`${getDomain()}/api/agencies/${slug}`)
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
