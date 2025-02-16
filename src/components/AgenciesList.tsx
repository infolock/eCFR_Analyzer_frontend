import React, { useEffect, useState } from "react";

function AgenciesList() {
    const [agencies, setAgencies] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/api/agencies")
            .then(res => res.json())
            .then(data => setAgencies(data))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    return (
        <div>
            <h2>List of Agencies</h2>
            <ul>
                {
                    agencies.map((agency: { slug: string; name: string; }) => (
                        <li key={agency.slug}>{agency.name}</li>
                    ))
                }
            </ul>
        </div>
    );
}

export default AgenciesList;