import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

import { PieChart } from '@mui/x-charts/PieChart';
import { PieItemIdentifier } from '@mui/x-charts';
import { Chip } from '@mui/material';

export default function HomeMainChart({ pieChartData }: { pieChartData: any[] }) {
    const [itemData, setItemData] = React.useState<PieItemIdentifier | null>(null);

    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 0, md: 4 }}
            sx={{ width: '100%' }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <PieChart
                    series={[
                        {
                            data: pieChartData,
                            innerRadius: 38,
                            outerRadius: 100,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        },
                    ]}
                    width={400}
                    height={200}
                    slotProps={{
                        legend: { hidden: true },
                    }}
                    onItemClick={(event, d) => setItemData(d)}
                />
            </Box>

            <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography>Натисніть на діаграму</Typography>
                    <IconButton
                        aria-label="reset"
                        size="small"
                        onClick={() => {
                            setItemData(null);
                        }}
                    >
                        <UndoOutlinedIcon fontSize="small" />
                    </IconButton>
                </Box>
                {pieChartData && pieChartData.length > 0 && itemData ? (
                    <React.Fragment>
                        <Typography>Тип:  <Chip label={pieChartData[itemData.dataIndex].type} color={pieChartData[itemData.dataIndex].type === 'profit' ? 'success' : 'error'} /></Typography>
                        <Typography>Назва: {pieChartData[itemData.dataIndex].label}</Typography>
                        <Typography>Значення: {pieChartData[itemData.dataIndex].value}</Typography>
                    </React.Fragment>
                ) : (
                    'Виберіть кусок діаграми'
                )}
            </Stack>
        </Stack>
    );
}
