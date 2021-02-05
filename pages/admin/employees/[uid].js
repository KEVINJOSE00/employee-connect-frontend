import React, { useState, useEffect } from 'react'
import Router from "next/router";
import AWS from 'aws-sdk';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from "@material-ui/core/TextField";
import *  as cookie from 'cookie'
import APIService from '../../../services/APIService'
import avatar from "assets/img/faces/login.png";
import Image from 'next/image'
import AWSServices from '../../../services/awsServices'


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

function UserProfile({ result }) {
  const uploadClass = uploadStyles()
  const classes = useStyles();

  const [data, setData] = useState({
    "firstName": result.firstName,
    "lastName": result.lastName,
    "designation": result.designation,
    "email": result.email,
    "password": "",
    "confirm": "",
    "img": result.img
  })

  const [profileData, setProfileData] = useState({
    "firstName": result.firstName,
    "lastName": result.lastName,
    "designation": result.designation,
    "email": result.email,
    "password": result.password,
    "img": result.img
  })

  const [file, setFile] = useState()
  const [fileName, setFileName] = useState()
  const [imgData, setImgData] = useState(profileData.img);


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
    if (file && fileName) {
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

  }



  const update = async () => {
    const pic = await s3Upload()
    var picData = " "
    pic ? (picData = pic.Location) : (picData = result.img)
    const items = {
      "firstName": data.firstName,
      "lastName": data.lastName,
      "designation": data.designation,
      "email": data.email,
      "password": data.password,
      "img": picData
    }

    const update = new APIService()

    update._Patch(`/admin/${result.uid}`, items)
      .then((response) => {
        setProfileData({
          "firstName": items.firstName,
          "lastName": items.lastName,
          "designation": items.designation,
          "email": items.email,
          "img": items.img
        })
      }, (error) => {
        if (error.response.status == 401) {
          Router.push('/')
        }
      })
  }

  return (
    <div>
      <form>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                <p className={classes.cardCategoryWhite}>Complete your profile</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      required
                      id="first-name"
                      label="First Name"
                      InputProps={{
                        onChange: ({ target: { name, value } }) => {
                          setData({
                            ...data,
                            [name]: value
                          })
                        },
                        name: "firstName",
                      }}
                      defaultValue={profileData.firstName}
                      variant="outlined"
                      fullWidth
                      success
                      margin='dense'
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      required
                      id="lastName"
                      label="Last Name"
                      InputProps={{
                        onChange: ({ target: { name, value } }) => {
                          setData({
                            ...data,
                            [name]: value
                          })
                        },
                        name: "lastName",
                      }}
                      defaultValue={profileData.lastName}
                      variant="outlined"
                      fullWidth
                      success
                      margin='dense'

                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      required
                      id="designation"
                      label="Designation"
                      InputProps={{
                        onChange: ({ target: { name, value } }) => {
                          setData({
                            ...data,
                            [name]: value
                          })
                        },
                        name: "designation",
                      }}
                      defaultValue={profileData.designation}
                      variant="outlined"
                      fullWidth
                      success
                      margin='dense'

                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      required
                      id="email"
                      label="Email address"
                      InputProps={{
                        onChange: ({ target: { name, value } }) => {
                          setData({
                            ...data,
                            [name]: value
                          })
                        },
                        name: "email",
                      }}
                      defaultValue={profileData.email}
                      variant="outlined"
                      fullWidth
                      success
                      margin='dense'

                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  {data.password.length < 6 ? (<GridItem xs={12} sm={12} md={6}>
                    <TextField
                      required
                      id="password"
                      label="New Password should atleast than 6"
                      InputProps={{
                        onChange: ({ target: { name, value } }) => {
                          setData({
                            ...data,
                            [name]: value
                          })
                        },
                        name: "password",
                      }}
                      variant="outlined"
                      fullWidth
                      margin='dense'

                    />
                  </GridItem>) : (<GridItem xs={12} sm={12} md={6}>
                    <TextField
                      required
                      id="password"
                      label="New Password"
                      InputProps={{
                        onChange: ({ target: { name, value } }) => {
                          setData({
                            ...data,
                            [name]: value
                          })
                        },
                        name: "password",
                      }}
                      success
                      variant="outlined"
                      fullWidth
                      margin='dense'

                    />
                  </GridItem>)}

                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      required
                      id="confirm-password"
                      label="Confirm Password"
                      InputProps={{
                        onChange: ({ target: { name, value } }) => {
                          setData({
                            ...data,
                            [name]: value
                          })
                        },
                        name: "confirm",
                      }}
                      variant="outlined"
                      {...(data.confirm.length > 0 ? { ...(data.password.length > 0 && data.password !== data.confirm && data.confirm.length > 0 ? { error: true } : { success: true }) } : {})}
                      fullWidth
                      success
                      margin='dense'

                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" onClick={() => update()}>Update Profile</Button>
              </CardFooter>
            </Card>
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
                <h4 className={classes.cardTitle}>{profileData.firstName} {profileData.lastName}</h4>
                <h4 className={classes.cardCategory}>{profileData.designation}</h4>
                <h4 className={classes.cardTitle}>{profileData.email}</h4>
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
                      Change Pic
                    </Button>
                  </label>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </form>
    </div>
  );
}

UserProfile.layout = Admin;










export async function getServerSideProps(context) {
  if (!context.req.headers.cookie) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }
  const parsedCookies = cookie.parse(context.req.headers.cookie)
  const { refreshToken, accessToken } = parsedCookies
  const list = new APIService()
  const employeeList = await list._Get(`/admin/${context.query.uid}`, { refreshToken, accessToken })
  const result = employeeList.data
  console.log(result)
  if (employeeList.message === 'Authentication failed') {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }
  return { props: { result } }
}

export default UserProfile;







