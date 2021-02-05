import React from "react";
import Router from "next/router";
import APIService from '../../../services/APIService'

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// layout for this page
import Admin from "layouts/Admin.js";
import *  as cookie from 'cookie'

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import { DataGrid } from '@material-ui/data-grid';
//  import { useDemoData } from '@material-ui/x-grid-data-generator';

import Button from '@material-ui/core/Button';

import EditRoundedIcon from '@material-ui/icons/EditRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import Link from 'next/link'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const path = require('path');

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TableList({ result }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  var arr = []
  result.map((res) => {
    const {
      uid: id,
      firstName,
      lastName,
      email,
      designation } = res
    arr.push({ id, firstName, lastName, email, designation })
  })

  const [data, setData] = React.useState([...arr])
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState('')

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log("here we Abort")
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);

    const del = new APIService()
    del._Delete(`/admin/${id}`)
      .then((response) => {
        console.log(response)
        var index = data.findIndex(item => item.id == id)
        data.splice(index, 1)
        setData([...data])
      }, (error) => {
        if (error.response.status == 401) {
          Router.push('/')
        }
      })
  };

  const generateId = (uid) => {
    setId(uid)
    handleClickOpen()
  }
  
  var rows = data
  const columns = [
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'email', headerName: 'email', width: 200 },
    { field: 'designation', headerName: 'designation', width: 150 },
    {
      field: 'Update', headerName: 'Edit Profile', width: 200,
      renderCell: (params) => (
        <strong>
          <Link href={path.join("/admin/employees/" + params.row.id)}>
            <Button
              variant="contained"
              color="default"
              size="small"
              style={{ marginLeft: 16 }}
            >
              <EditRoundedIcon />
            </Button>
          </Link>
          <Button
            variant="contained"
            color="default"
            size="small"
            onClick={() => { generateId(params.row.id) }}
            style={{ marginLeft: 16 }}
          >
            <DeleteRoundedIcon />
          </Button>
        </strong>
      ),
    }];

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Employee List</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a list of the Employees of the company
          </p>
          </CardHeader>
          <CardBody>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                onSelectionChange={(newSelection) => {
                }}
              />
            </div>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">{"Are you sure that you want to delete this profile?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">

                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
        </Button>
                <Button onClick={handleDelete} color="primary">
                  Confirm
        </Button>
              </DialogActions>
            </Dialog>
          </CardBody>
        </Card>
      </GridItem>

    </GridContainer>
  );
}
TableList.layout = Admin;

export default TableList;


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
  
  const employeeList = await list._Get(`/admin`, { refreshToken, accessToken })
  const result = [...employeeList.data]

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







