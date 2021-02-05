
import React, { useState } from 'react'
// import { uploadFile } from 'react-s3';
import Link from 'next/link'
import Router from "next/router";
import AWS from 'aws-sdk';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import APIService from '../../services/APIService'

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Alert from '@material-ui/lab/Alert';
import Image from 'next/image'
import avatar from "assets/img/faces/login.png";


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
const uploadStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1)
        }
    },
    input: {
        display: "none"
    }
}))

const alertStyle = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

function Register() {
    const alertClass = alertStyle()
    const uploadClass = uploadStyles()
    const classes = useStyles();
    const [data, setData] = useState({
        "firstName": "",
        "lastName": "",
        "designation": "",
        "email": "",
        "password": "",
        "confirm": "",
        "img": ""
    })
    const [buttonDisable, setButtonDisable] = useState(false)
    const [alertFlag, setAlertFlag] = useState(false);
    const [file, setFile] = useState()
    const [fileName, setFileName] = useState()
    const [imgData, setImgData] = useState();

    const register = async() => {
        if (data.password.length < 6) {
            console.log('Password should atleast than 6')

        }
        else if (data.password !== data.confirm) {
            console.log("confirm password is incorrect!")
        }
        else {

            const pic = await s3Upload()
            
            const items = {
                "firstName": data.firstName,
                "lastName": data.lastName,
                "designation": data.designation,
                "email": data.email,
                "password": data.password,
                "img": pic.Location
            }
            
            setButtonDisable(true)

            const register = new APIService()

            register._Post('/admin', items).then((res) => {
                console.log(items)
                Router.push('/admin/employees')
            }).catch((err) => {
                console.log(err)
                if (err.response.status) {
                    setAlertFlag(true)
                    setButtonDisable(true)
                }
            })

        }
    }

    const closeAlert = () => {
        setAlertFlag(false)
        setButtonDisable(false)
    }


    const uploadPic = (e) => {
        if (e.target.files[0]) {
            setFileName(e.target.files[0].name,)
            setFile(e.target.files[0])
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const s3Upload = () => {
        AWS.config.update({
            region: process.env.AWS_REGION,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID
        })
        const upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: process.env.BUCKET_NAME,
                Body: file,
                Key: 'kevin/' + fileName,
            }

        })
        return upload.promise()
    }


    return (
        <div>
            <GridContainer>
                <CardHeader>
                    <h4 className={classes.cardTitleWhite}>Register</h4>
                    <p className={classes.cardCategoryWhite}>Complete your profile</p>
                </CardHeader>
            </GridContainer>
            <GridContainer>
                <CardHeader>
                    <h4 className={classes.cardTitleWhite}>Register</h4>
                    <p className={classes.cardCategoryWhite}>Complete your profile</p>
                </CardHeader>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                    <Card profile>
                        <CardAvatar profile>
                            <Image
                                src={imgData ? imgData : avatar}
                                width={500}
                                height={500}
                            />
                        </CardAvatar>
                        <CardBody profile>
                            {alertFlag ? (<div className={alertClass.root}>
                                <Alert severity="error" onClose={closeAlert}>Email already exists — Please try again!</Alert>
                            </div>) : (<div></div>)}
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="First Name"
                                        id="first-name"
                                        inputProps={{
                                            onChange: ({ target: { name, value } }) => {
                                                setData({
                                                    ...data,
                                                    [name]: value
                                                })
                                            },
                                            name: "firstName",

                                        }}
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Last Name"
                                        id="lastname"
                                        inputProps={{
                                            onChange: ({ target: { name, value } }) => {
                                                setData({
                                                    ...data,
                                                    [name]: value
                                                })
                                            },
                                            name: "lastName",
                                        }}
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="designation"
                                        id="designation"
                                        inputProps={{
                                            onChange: ({ target: { name, value } }) => {
                                                setData({
                                                    ...data,
                                                    [name]: value
                                                })
                                            },
                                            name: "designation",
                                        }}
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
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
                                {data.password.length < 6 ? (<GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Password (length should atleast 6)"
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
                                </GridItem>) : (<GridItem xs={12} sm={12} md={6}>
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
                                        success
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                    />
                                </GridItem>)}
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Confirm Password"
                                        id="confirm-password"
                                        inputProps={{
                                            onChange: ({ target: { name, value } }) => {
                                                setData({
                                                    ...data,
                                                    [name]: value
                                                })
                                            },
                                            name: "confirm",
                                        }}
                                        {...(data.confirm.length > 0 ? { ...(data.password.length > 0 && data.password !== data.confirm && data.confirm.length > 0 ? { error: true } : { success: true }) } : {})}
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <div className={classes.root}>
                                        <input
                                            accept="image/*"
                                            className={uploadClass.input}
                                            id="contained-button-file"
                                            onChange={uploadPic}
                                            type="file"
                                        />
                                        <label htmlFor="contained-button-file">
                                            <Button variant="contained" color="primary" component="span" >
                                                Upload Pic
                                  </Button>
                                        </label>
                                    </div>
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                            <Button color="primary" {...(buttonDisable ? { disabled: true } : {})} onClick={() => register()}>Register</Button>

                            <Link href="/landing/login" color="inherit">
                                {'Login'}
                            </Link>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
export default Register;






