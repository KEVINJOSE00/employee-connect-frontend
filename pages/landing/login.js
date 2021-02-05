import React, { useState } from 'react'
import Router from "next/router";
import Link from 'next/link'

import APIService from '../../services/APIService'
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import avatar from "assets/img/faces/login.png";
import Alert from '@material-ui/lab/Alert';

const styles = {
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0",
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
    },
};

const useStyles = makeStyles(styles);
const alertStyle = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));


function Login() {
   
    const classes = useStyles();
    const alertClass = alertStyle()
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const [alertFlag, setAlertFlag] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false)

    const login = () => {
        const login = new APIService()
        login._Post('/admin/login', data).then((res) => {
            Router.push('/admin/employees')
        }).catch((err) => {
            console.log(err)
            if (err.response.status == 401 || err.response.status == 406) {
                setAlertFlag(true)
                setButtonDisable(true)
            }
        })
    };

    const closeAlert = () => {
        setAlertFlag(false)
        setButtonDisable(false)
    }

    return (
        <div>
            <GridContainer>
                <CardHeader>
                    <h4 className={classes.cardTitleWhite}>Login</h4>
                    <p className={classes.cardCategoryWhite}>login to access</p>
                </CardHeader>

            </GridContainer>
            <GridContainer>
                <CardHeader>
                    <h4 className={classes.cardTitleWhite}>Login</h4>
                    <p className={classes.cardCategoryWhite}>login to access</p>
                </CardHeader>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                    <Card profile>
                        <CardAvatar profile>
                            <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                <img src={avatar} alt="..." />
                            </a>
                        </CardAvatar>
                        <CardBody profile>
                            {alertFlag ? (<div className={alertClass.root}>
                                <Alert severity="error" onClose={closeAlert}>Credentials are invalid — Please try again!</Alert>
                            </div>) : (<div></div>)}


                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <CustomInput
                                        labelText="Email address"
                                        id="email-address"
                                        inputProps={{
                                            onChange: ({ target: { name, value } }) => {
                                                setData({
                                                    ...data,
                                                    [name]: value
                                                })
                                            },
                                            name: "email",
                                        }}
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <CustomInput
                                        labelText="Password"
                                        id="password"
                                        inputProps={{
                                            onChange: ({ target: { name, value } }) => {
                                                setData({
                                                    ...data,
                                                    [name]: value
                                                })
                                            },
                                            name: "password",
                                        }}
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                            <Button color="primary" {...(buttonDisable ? { disabled: true } : {})} onClick={() => login()}>Login</Button>
                          
                            <Link href="/landing/register" color="inherit">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}


export default Login;
