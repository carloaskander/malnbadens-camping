import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { CURRENT_PERIOD_GREEN } from './currentPricePeriodStyles';

function CurrentPricePeriodBadge({ label }) {
    return (
        <Box
            component="span"
            sx={{
                position: 'absolute',
                top: -2,
                right: -2,
                px: 1.5,
                py: 0.45,
                maxWidth: 'calc(100% - 24px)',
                bgcolor: CURRENT_PERIOD_GREEN,
                color: '#fff',
                borderBottomLeftRadius: '8px',
                fontFamily: 'Bebas Neue, Arial, sans-serif',
                fontSize: '0.95rem',
                lineHeight: 1.2,
                letterSpacing: '0.6px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                zIndex: 1,
            }}
        >
            {label}
        </Box>
    );
}

CurrentPricePeriodBadge.propTypes = {
    label: PropTypes.string.isRequired,
};

export default CurrentPricePeriodBadge;
