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
import AuthService from '../../../services/AuthService'
import moment from 'moment'
import APIService from '../../../services/APIService'
import { ButtonBase } from '@material-ui/core';


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

const authService = new AuthService()
const headers = authService.getCookie();
const socket = openSocket.connect('http://localhost:3000', {
    query: headers
})

const Chat = () => {
    const classes = useStyles();
    const [message, setMessage] = useState('')
    const [disable, setDisable] = useState(false)
    const [user, setUser] = useState('')
    const [allUser, setAllUser] = useState([])
    const [online, setOnline] = useState([])
    const [newMessage, setNewMessage] = useState([])
    const [getsender, setGetSender] = useState()
    const [sender, setsender] = useState()

    const inputMessage = (e) => {
        setMessage(e.target.value)
    }

    const sendMessage = () => {
        setDisable(true)
        online[online.length - 1].map((data) => {
            if (getsender === data.userName) {
                setNewMessage(newMessage => [...newMessage, {
                    msg: message,
                    reciever: "",
                    sender: "",
                    createdAt: new Date().getTime()
                }])
                const payLoad = {
                    msg: message,
                    toid: data.id,
                    name: data.userName
                }
                socket.emit('getMsg', payLoad, (callback) => {
                    setDisable(false)
                    setMessage('')
                })
            }
        })
    }

    const fetch = async (e) => {
        setGetSender(e.target.alt)
        const list = new APIService()
        const accessToken = headers.acess
        const refreshToken = headers.refresh
        await list._Get(`/admin/${e.target.alt}`, { refreshToken, accessToken }).then((res) => {
            setsender(res.data)
            console.log(sender)
        })
        
    }

    useEffect(() => {
        socket.on('message1', (m) => {
            setUser(m.user_id)
            socket.emit('username', (m.user_id))
            socket.on('userList', (users, id) => {
                setOnline(online => [...online, users])
            })
        })

        socket.on('sendMsg', (m) => {
            setNewMessage(newMessage => [...newMessage, m])
        })

        const list = new APIService()
        const accessToken = headers.acess
        const refreshToken = headers.refresh
        list._Get(`/admin/`, { refreshToken, accessToken }).then((res) => {
            setAllUser(res.data)
        })
    }, [])

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
                    <Divider />
                    <Grid item xs={12} style={{ padding: '10px' }}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                    </Grid>
                    <Divider />
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
                        {newMessage.map(ele => (<ListItem button key={ele.createdAt} >
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText align={ele.reciever == user ? "left" : "right"} primary={ele.msg}></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText align={ele.reciever == user ? "left" : "right"} secondary={moment(ele.createdAt).format('h:mm a')}></ListItemText>
                                </Grid>
                            </Grid>
                        </ListItem>))}
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

export async function getServerSideProps(context) {

    return { props: {} }
}




































