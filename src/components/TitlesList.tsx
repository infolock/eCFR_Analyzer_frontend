import React, { useEffect, useState } from 'react';

function TitlesList() {
    const [titles, setTitles] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/titles')
            .then((res) => res.json())
            .then((data) => setTitles(data))
            .catch((err) => console.error('Error fetching data:', err));
    }, []);

    return (
        <div>
            <h2>List of Titles</h2>
            <ul>
                {titles.map((title: { number: number; name: string }) => (
                    <li key={title.number}>{title.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default TitlesList;
