import axios from 'axios';
import { TEvent } from '../../app/types';
import { DateRange } from 'react-date-range';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CategoryIcon from '@mui/icons-material/Category';
import { urls } from '../../config/urls';
import { useBoundStore, useDatesStore } from '../../store/store';
import { Avatar, Modal, Button, Card, CardContent, Badge } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { useQuery } from '@tanstack/react-query';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window?: () => Window;
    children: React.ReactNode;
}

const drawerWidth = 240;

const labelLinks = [
    {
        key: 'home',
        label: 'Головна',
        to: urls.home,
        icon: <HomeWorkIcon />,
    },
    {
        key: 'categories',
        label: 'Категорії',
        to: urls.categories,
        icon: <CategoryIcon />,
    },
]

const subLinks = [
    {
        key: 'history',
        label: 'Історія оплат',
        to: urls.history,
        icon: <HistoryIcon />,
    },
]

export default function ResponsiveDrawer(props: Props) {
    const user = useBoundStore(state => state.user);
    const userExit = useBoundStore(state => state.forgotUser);

    const { data, isLoading, isSuccess } = useQuery<TEvent[]>(
        {
            queryKey: ['get-notifications'],
            queryFn: async () => (await axios({ method: "GET", url: "http://localhost:5254/api/Event/notify" })).data?.$values
        }
    )

    const dates = useDatesStore(state => state.dates);
    const setDates = useDatesStore(state => state.setDates);
    const location = useLocation();
    const navigate = useNavigate();
    const { window, children } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const openPop = Boolean(anchor);
    const id = open ? 'simple-popper' : undefined;

    React.useEffect(() => {
        setMobileOpen(false);
        return () => setMobileOpen(false);
    }, [location])

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const handleSelect = (ranges: any) => {
        if (!ranges || !ranges?.selection) return;
        setDates('end', ranges.selection.endDate)
        setDates('start', ranges.selection.startDate)
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor ? null : event.currentTarget);
    };
    const handleOpen = () => { setOpen(true) };
    const handleClose = () => setOpen(false);

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {labelLinks.map((item) => (
                    <ListItem key={item.key} disablePadding>
                        <ListItemButton selected={location.pathname === item.to} onClick={() => navigate(item.to)}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {subLinks.map((item) => (
                    <ListItem key={item.key} disablePadding>
                        <ListItemButton selected={location.pathname === item.to} onClick={() => navigate(item.to)}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" noWrap component="div">
                            {`${'Budget App'}${user && ', ' + user?.username}`}
                        </Typography>
                        <Box sx={{ gap: 4, display: 'flex', alignItems: 'center', }}>
                            {((location.pathname === urls.home) && (dates.start && dates.end)) && <Button sx={{ color: 'white' }} onClick={() => {
                                setDates('end', '');
                                setDates('start', '');
                            }}>Показати за весь час</Button>}
                            {location.pathname === urls.home && (
                                <IconButton sx={{ color: 'white' }} onClick={handleOpen}>
                                    <CalendarMonthIcon />
                                </IconButton>
                            )}
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <DateRange
                                        ranges={[{
                                            startDate: dates.start ? new Date(dates.start) : new Date(),
                                            endDate: dates.end ? new Date(dates.end) : new Date(),
                                            key: 'selection',
                                        }]}
                                        onChange={handleSelect}
                                    />
                                </Box>
                            </Modal>
                            <Avatar sx={{ bgcolor: deepOrange[500] }}>{user?.username[0] || 'G'}</Avatar>
                            <IconButton onClick={handleClick}>
                                <Badge badgeContent={isSuccess ? data.length || 0 : 0} color="secondary">
                                    <NotificationsIcon sx={{ color: 'white' }} />
                                </Badge>
                            </IconButton>
                            <BasePopup offset={4} id={id} open={openPop} anchor={anchor} style={{ width: 200 }}>
                                <Box sx={{ paddingTop: 2 }}>
                                    <Box sx={{ padding: 0, backgroundColor: '#fff', boxShadow: '2px 2px 3px 2px black' }}>
                                        {(!isLoading && isSuccess && data) && data.map((event) => (
                                            <Card key={event.id} sx={{ margin: 0, padding: 0 }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Typography>{event.name}</Typography>
                                                        <Typography>{event.number} (UAH)</Typography>
                                                    </Box>
                                                    <Typography>{new Date(event.date).toDateString()}</Typography>
                                                    <Typography>{event.type ? 'Profit' : 'Cost'}</Typography>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                            </BasePopup>
                            <IconButton onClick={userExit}>
                                <LogoutIcon sx={{ color: 'white' }} />
                            </IconButton>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}
