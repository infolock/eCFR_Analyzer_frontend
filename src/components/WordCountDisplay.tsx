import React, { useEffect, useState } from 'react';

function WordCountDisplay() {
    const [wordCounts, setWordCounts] = useState({});

    useEffect(() => {
        fetch('http://localhost:5001/api/word_counts')
            .then((res) => res.json())
            .then((data) => setWordCounts(data))
            .catch((err) => console.error('Error fetching data:', err));
    }, []);

    return (
        <div>
            <h2>Word Count by Agency</h2>
            <ul>
                {Object.entries(wordCounts).map(([agency, count]) => (
                    <li key={agency}>
                        {agency}: {count as number} words
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WordCountDisplay;
