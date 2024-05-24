import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { UseMutateFunction } from "@tanstack/react-query";
import { Card, Typography, CardContent, CardActionArea, CardHeader, Menu, IconButton, MenuItem } from "@mui/material";

import { formatDate } from "../../components/forms/event-form";
import { urls } from "../../config/urls";

interface RootCardProps {
    item: any;
    RenderTitle: (item: any) => ReactNode;
    RenderDesc?: ((item: any) => ReactNode) | undefined;
    isRouting?: boolean;
    onChangeCategory: (category?: any) => void
    onRemoveElement: UseMutateFunction<any, Error, void, unknown>
}

const RootCard: React.FC<RootCardProps> = ({ item, RenderTitle, RenderDesc = undefined, isRouting = false, onChangeCategory = () => { }, onRemoveElement = () => { } }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();  // Prevent the card click event
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCardClick = () => {
        if (isRouting && !open) {
            navigate(`${urls.categories}/${item.id}`);
        }
    };

    return (
        <Card sx={{ width: '100%' }}>
            <CardActionArea onClick={handleCardClick}>
                <CardHeader
                    action={
                        <>
                            <IconButton aria-label="settings" onClick={handleClick}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={() => {
                                    onChangeCategory(item);
                                    handleClose();
                                }}>Змінити</MenuItem>
                                <MenuItem onClick={() => {
                                    onRemoveElement(item.id);
                                    handleClose();
                                }}>Видалити</MenuItem>
                            </Menu>
                        </>
                    }
                    title={<RenderTitle {...item} />}
                    subheader={item.date ? formatDate(item.date) : new Date(item.createdAt).toDateString()}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {RenderDesc !== undefined && <RenderDesc {...item} />}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default RootCard;
