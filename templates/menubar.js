import React, { useState, useEffect, Component } from "react";
import { AppBar, Box, Toolbar, Typography, Button, Link } from '@mui/material';
import logo from '../styles/image/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Constant from '../util/constant_variables';
//아메시스트 : #9966CC 밝은 레드오렌지 : #ffb7b3
export default function Menubar() {
    const navigate = useNavigate();

    const handlehome = () => {
        navigate('/');
    }
    const handleLogout = async () => {
        try {
            await axios.get(Constant.serviceURL + "/logout", { withCredentials: true });
            setTimeout(() => { navigate('/'); }, 2000);
        } catch (error) {
            console.error('로그아웃 오류:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <img src={logo} width={100} onClick={handlehome} />
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>LOGOUT</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}


