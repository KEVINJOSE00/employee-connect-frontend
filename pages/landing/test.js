import React, { useState, useEffect } from 'react';
import openSocket from 'socket.io-client'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Admin from "layouts/Admin.js";
import AuthServices from '../../services/AuthServices'
import APIservices from '../../services/APIservices'
import Router from "next/router";
import * as cookie from 'cookie'
import jwt_decode from "jwt-decode";


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const authService = new AuthServices();
const { access, refresh } = authService.getAuth()
const socket = openSocket.connect('http://localhost:3000', {
    query: { access, refresh }
})

const Chat = ({ }) => {
    const classes = useStyles();
    const [message, setMessage] = useState('')
    const [disable, setDisable] = useState(false)
    const [user, setUser] = useState('')
    const [data, setData] = useState([])
    const [allUser, setAllUser] = useState([])

    const inputMessage = (e) => {
        setMessage(e.target.value)
    }

    const sendMessage = () => {

        setDisable(true)
        console.log("data", data)
        socket.emit('sendMessage', message, (message) => {
            setDisable(false)
            setMessage('')
        })
    }

    useEffect(() => {
        socket.on('message1', (m) => {
            setUser(m.user_id)
        })
        socket.on('message', (m) => {
            if (m.message !== "welocome")
                setData(data => [...data, m])
        })
        const list = new APIService()
        const accessToken = headers.acess
        const refreshToken = headers.refresh
        list._Get(`/admin/`, { refreshToken, accessToken }).then((res) => {
            setAllUser(res.data)
        })
    }, [])

    const fetch = async (e) => {
        console.log(e.target.alt)
    }
    return (
        <div>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <List>
                        {allUser.map(ele => (
                            ele.uid === user ? <ListItem button key={ele.uid} >
                                <ListItemIcon>
                                    <Avatar alt={ele.email} src={ele.img} />
                                </ListItemIcon>
                                <ListItemText primary={ele.firstName}>{ele.firstName}</ListItemText>
                            </ListItem> : " "
                        ))}
                    </List>
                    <Grid item xs={12} style={{ padding: '10px' }}>
                    </Grid>
                    <List>
                        {allUser.map(ele => (
                            <ListItem button key={ele.uid} primaryText={ele.uid}>
                                <ListItemIcon onClick={(event) => { event.persist(); fetch(event) }}  >
                                    <Avatar alt={ele.uid} src={ele.img} />
                                </ListItemIcon>
                                <ListItemText primary={ele.firstName}>{ele.firstName} {ele.lastName}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={9}>
                    <List className={classes.messageArea}>
                        {data.map(ele => (
                            <ListItem button key="1" ref={'change'}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ListItemText align={ele.user_id == user ? "right" : "left"} primary={ele.text}></ListItemText>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ListItemText align={ele.user_id == user ? "right" : "left"} secondary={moment(ele.createdAt).format('h:mm a')}></ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <Grid container style={{ padding: '9px' }}>
                        <Grid item xs={11}>
                            <TextField id="basic" label="Type Something" fullWidth onChange={inputMessage} value={message || ''} />
                        </Grid>
                        <Grid xs={1} align="right">
                            <Fab color="primary" aria-label="add" onClick={sendMessage} {...(disable ? { disabled: true } : {})}><SendIcon /></Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}


Chat.layout = Admin;
export default Chat;
