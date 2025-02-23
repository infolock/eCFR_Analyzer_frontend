import './styles.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableSortLabel, TableHead, TableRow, Paper } from '@mui/material';
import { Agency } from '../constants/Agency';
import { getDomain } from '../env';

const WAIT_TIME_BETWEEN_REQS = 30000;

const AgenciesList = () => {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    // these are the things we want to process and request
    const [wordCountQueue, setWordCountQueue] = useState<string[]>([]);
    // this will help us maintain a single request until its done processing between intervals...
    const [isProcessingQueue, setIsProcessingQueue] = useState(false);
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

    const processQueue = async () => {
        // nothing to do...
        if (isProcessingQueue || !wordCountQueue.length) {
            return;
        }

        // process the queue...
        setIsProcessingQueue(true);

        let wordCounts: Record<string, number> = {};

        if (localStorage.getItem('ecrf_word_count')) {
            wordCounts = JSON.parse(localStorage.getItem('ecrf_word_count') || '{}');
        }

        try {
            const agencySlug = wordCountQueue.shift() as string;
            const agency = agencies.find((item) => item.slug === agencySlug);
            if (!agency) {
                setIsProcessingQueue(false);
                return;
            }

            const res = await fetch(`${getDomain()}/api/word_counts/${agencySlug}`);
            const data = await res.json();

            wordCounts[agencySlug] = data.wordCount;
            agency.wordCount = data.wordCount;

            const updatedAgencies = agencies.map((item) => {
                if (item.slug === agencySlug) {
                    return agency;
                }
                return item;
            });

            localStorage.setItem('ecrf_word_count', JSON.stringify(wordCounts));
            setAgencies(updatedAgencies);
        } catch (error) {
            console.log('ERROR: ' + error);
        }

        setIsProcessingQueue(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${getDomain()}/api/agencies`);
                const data = await res.json();
                const queue: string[] = [];

                setAgencies(
                    data.map((agency: Agency) => {
                        let wordCounts: Record<string, number> = {};

                        if (localStorage.getItem('ecrf_word_count')) {
                            wordCounts = JSON.parse(localStorage.getItem('ecrf_word_count') || '{}');
                        }

                        if (wordCounts[agency.slug]) {
                            return {
                                ...agency,
                                wordCount: wordCounts[agency.slug],
                            };
                        }

                        queue.push(agency.slug);
                        return agency;
                    })
                );

                setWordCountQueue(queue);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setInterval(() => processQueue(), WAIT_TIME_BETWEEN_REQS);
    }, [wordCountQueue]);

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
                                    <TableCell>
                                        {row.wordCount || (
                                            <div className="lds-ring">
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                        )}
                                    </TableCell>
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
