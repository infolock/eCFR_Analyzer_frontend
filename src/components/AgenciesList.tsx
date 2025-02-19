import './styles.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableSortLabel, TableHead, TableRow, Paper } from '@mui/material';
import { Agency } from '../constants/Agency';
import { getDomain } from '../env';

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
                const res = await fetch(`${getDomain()}/api/agencies`);
                const data = await res.json();

                const updatedAgencies: Agency[] = [];
                let wordCounts: Record<string, number> = {};

                if (localStorage.getItem('ecrf_word_count')) {
                    wordCounts = JSON.parse(localStorage.getItem('ecrf_word_count') || '{}');
                }

                for (const agency of data) {
                    if (!wordCounts[agency.slug]) {
                        const res = await fetch(`${getDomain()}/api/word_counts/${agency.slug}`);
                        const data = await res.json();

                        wordCounts[agency.slug] = data.wordCount;
                    }
                    updatedAgencies.push({
                        ...(agency as Agency),
                        wordCount: wordCounts[agency.slug],
                    });
                }

                localStorage.setItem('ecrf_word_count', JSON.stringify(wordCounts));

                setAgencies(updatedAgencies);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    if (!agencies.length) {
        return (
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    }

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
