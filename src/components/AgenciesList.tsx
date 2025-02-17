import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableSortLabel, TableHead, TableRow, Paper } from '@mui/material';
import { Agency } from '../constants/Agency';

const AgenciesList = () => {
    const [agencies, setAgencies] = useState([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    // in case we want to add more sortable columns...
    const [orderBy, setOrderBy] = useState<'name'>('name');

    const handleRequestSort = () => {
        const isAsc = order === 'asc';

        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(orderBy);
    };

    const sortData = (array: Agency[]) => {
        return array.sort((a, b) => {
            return (a.name < b.name ? -1 : 1) * (order === 'asc' ? 1 : -1);
        });
    };

    useEffect(() => {
        fetch('http://localhost:5001/api/agencies')
            .then((res) => res.json())
            .then((data) => setAgencies(data))
            .catch((err) => console.error('Error fetching data:', err));
    }, []);

    return (
        <div>
            <h2>List of Agencies</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort()}>
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Word Count</TableCell>
                            <TableCell>Related Titles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortData(agencies).map((row: Agency) => {
                            const agencyPath = `/agencies/${row.slug}`;
                            return (
                                <TableRow key={row.slug}>
                                    <TableCell>
                                        <Link to={agencyPath}>{row.name}</Link>
                                    </TableCell>
                                    <TableCell>0</TableCell>
                                    <TableCell>...</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AgenciesList;
