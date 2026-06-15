export const CURRENT_PERIOD_GREEN = '#3A9D5D';

export const getPriceCardSx = (isCurrent) => ({
    mb: 2,
    p: 2,
    height: '100%',
    position: 'relative',
    border: '2px solid',
    borderColor: isCurrent ? CURRENT_PERIOD_GREEN : 'transparent',
    bgcolor: isCurrent ? 'rgba(58, 157, 93, 0.07)' : 'background.paper',
    boxShadow: isCurrent ? '0 10px 24px rgba(58, 157, 93, 0.18)' : undefined,
    transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
});
