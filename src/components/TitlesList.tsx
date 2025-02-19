import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableSortLabel, TableHead, TableRow, Paper } from '@mui/material';
import { getDomain } from '../env';

type Title = {
    number: number;
    name: string;
};

function TitlesList() {
    const [titles, setTitles] = useState([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    // in case we want to add more sortable columns...
    const [orderBy, setOrderBy] = useState<'name'>('name');

    const handleRequestSort = () => {
        const isAsc = order === 'asc';

        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(orderBy);
    };

    const sortData = (array: Title[]) => {
        return array.sort((a, b) => {
            return (a.name < b.name ? -1 : 1) * (order === 'asc' ? 1 : -1);
        });
    };

    useEffect(() => {
        fetch(`${getDomain()}/api/titles`)
            .then((res) => res.json())
            .then((data) => setTitles(data))
            .catch((err) => console.error('Error fetching data:', err));
    }, []);

    return (
        <div>
            <h2>List of Titles</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort()}>
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Related Agencies</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortData(titles).map((row: Title) => (
                            <TableRow key={row.number}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>...</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default TitlesList;
