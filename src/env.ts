export const getDomain = (): string => {
    if (localStorage.getItem('ecrf_dev') === 'dev') {
        return 'http://localhost:5001';
    }
    return 'https://ecfranalyzerbackend-production.up.railway.app';
};
