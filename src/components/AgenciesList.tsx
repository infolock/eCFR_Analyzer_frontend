import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableSortLabel, TableHead, TableRow, Paper } from '@mui/material';
import { Agency } from '../constants/Agency';

const AgenciesList = () => {
    const [agencies, setAgencies] = useState<Agency[]>([]);
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
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/agencies');
                console.log('Res = ', res);
                const data = await res.json();
                console.log('data = ', data);

                const updatedAgencies: Agency[] = [];
                for (const agency of data) {
                    const res = await fetch(`http://localhost:5001/api/word_counts/${agency.slug}`);
                    const data = await res.json();

                    updatedAgencies.push({
                        ...(agency as Agency),
                        wordCount: data.wordCount,
                    });
                }

                setAgencies(updatedAgencies);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
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
                                    <TableCell>{row.wordCount}</TableCell>
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
