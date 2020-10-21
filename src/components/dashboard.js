import React, { Component } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";
import "../App.css";
import Footer from "./footer";

export default class Dashboard extends Component {
  state = {
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    isActive: true,

    columnDefs: [
      {
        headerName: "User Id",
        field: "_id",
        suppressSizeToFit: true,
        width: 250,
      },
      {
        headerName: "User Name",
        field: "userName",
      },
      {
        headerName: "Email",
        field: "email",
      },
      {
        headerName: "First Name",
        field: "firstName",
      },
      {
        headerName: "Last Name",
        field: "lastName",
      },
      {
        headerName: "is Active",
        field: "isActive",
        cellRendererFramework: (params) => {
          let isActive = params.data.isActive;

          return (
            <div>
              <div>
                <i
                  className="fa fa-circle"
                  style={{ color: isActive === "true" ? "green" : "red" }}
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          );
        },
      },
      {
        headerName: "Delete",
        maxWidth: 100,
        cellRendererFramework: (params) => {
          let id = params.data._id;
          return (
            <div>
              <div>
                <Button
                  color="danger"
                  value={id}
                  onClick={this.openDeleteModal}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        },
      },
      {
        headerName: "Edit",
        field: "Edit",
        editable: true,
        maxWidth: 100,
        cellRendererFramework: (params) => {
          let id = params.data._id;
          return (
            <Button color="primary" value={id} onClick={this.openEditModal}>
              Edit
            </Button>
          );
        },
      },
    ],
    defaultColDef: { resizable: true },
    rowData: [],
    showModal: false,
    openModal: false,
    openEditModal: false,
    Id: "",
    isAlertVisible: false,
    closeAlert: false,
    alertColor: "",
    alertMessage: "",
  };
  componentDidMount = () => {
    this.getData();
  };

  toggle = () => {
    this.setState({
      openModal: false,
      openEditModal: false,
    });
  };

  getData = () => {
    axios
      .get("http://localhost:5000/total/users")
      .then((res) => {
        console.log(res);
        this.setState({
          rowData: res.data,
        });
        console.log(this.state.rowData);
        console.log();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  openEditModal = async (e) => {
    let id = e.target.value;
    await this.setState({
      openEditModal: !this.state.openEditModal,
      Id: id,
      isActive: true,
    });
    await this.getDataById();
  };

  editData = (e) => {
    let id = e.target.value;
    console.log(e.target.value, "id");
    axios
      .put(`http://localhost:5000/user/update/${id}`, {
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        isActive: this.state.isActive,
      })
      .then(async (res) => {
        console.log(res.data);
        await this.getData();
        await this.setState({
          alertColor: "success",
          alertMessage: "User is Successfully Active",
          isAlertVisible: true,
        });
        setTimeout(async () => {
          await this.setState({
            isAlertVisible: false,
          });
        }, 3000);
      })
      .catch((err) => console.log(err));

    this.toggle();
  };

  openDeleteModal = async (e) => {
    let id = e.target.value;
    await this.setState({
      openModal: !this.state.openModal,
      Id: id,
      isActive: false,
    });
  };
  deleteData = async (e) => {
    let id = e.target.value;
    await axios
      .post(`http://localhost:5000/user/delete/${id}`, {
        isActive: this.state.isActive,
      })
      .then(async (res) => {
        console.log(res.data);

        await this.toggle();
        await this.getData();
        await this.setState({
          alertColor: "danger",
          alertMessage: "User is inActive",
          isAlertVisible: true,
        });
        setTimeout(async () => {
          await this.setState({
            isAlertVisible: false,
          });
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  showModal = () => {
    this.setState({
      showModal: true,
      userName: "",
      email: "",
      firstName: "",
      lastName: "",
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/add", {
        userName: this.state.userName,
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
      })
      .then(async () => {
        await this.handleClose();
        await this.getData();

        await this.setState({
          alertColor: "info",
          alertMessage: "Added Successfully",
          isAlertVisible: true,
        });
        setTimeout(async () => {
          await this.setState({
            isAlertVisible: false,
          });
        }, 3000);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  getDataById = async () => {
    await axios
      .get(`http://localhost:5000/get/user/${this.state.Id}`)
      .then((res) => {
        console.log(res);
        this.setState({
          //   rowData: res.data,
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          userName: res.data.userName,
        });
        console.log(this.state.rowData);
      })
      .catch((err) => {
        console.log(err);
      });
    //api call
    //setstate
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  render() {
    return (
      <div>
        <div>
          <div>
            <nav
              className="navbar navbar-expand-lg navbar-dark "
              style={{ backgroundColor: "#0074D9" }}
            >
              <i className="fa fa-user-o" style={{ color: "white" }}></i>&nbsp;
              <span className="navbar-brand">
                &nbsp;Welcome {this.state.userName}
                <br />
              </span>
            </nav>
          </div>
          <div className="header">
            <div className="reservation">Users List</div>
            <button
              type="button"
              className="btn btn-success btn newUserButton"
              onClick={this.showModal}
            >
              <i className="fa fa-plus" aria-hidden="true"></i>&nbsp; Add New
              User
            </button>
          </div>
          <Alert
            color={this.state.alertColor}
            isOpen={this.state.isAlertVisible}
            toggle={() => {
              this.setState({
                isAlertVisible: false,
              });
            }}
          >
            {this.state.alertMessage}
          </Alert>
          <div>
            <Modal isOpen={this.state.showModal}>
              <Form className="form">
                <FormGroup row>
                  <Label for="userName" sm={3}>
                    User Name
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      id="userName"
                      placeholder="User Name"
                      value={this.state.userName}
                      required
                      onChange={(e) => {
                        this.setState({ userName: e.target.value });
                      }}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label for="email" sm={3}>
                    Email
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={(e) => {
                        this.setState({ email: e.target.value });
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="firstName" sm={3}>
                    First Name
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="First Name"
                      value={this.state.firstName}
                      onChange={(e) => {
                        this.setState({ firstName: e.target.value });
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="lastName" sm={3}>
                    Last Name
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Last Name"
                      value={this.state.lastName}
                      onChange={(e) => {
                        this.setState({ lastName: e.target.value });
                      }}
                    />
                  </Col>
                </FormGroup>

                <button
                  type="button"
                  className="btn btn-info mr-2"
                  onClick={this.handleSubmit}
                >
                  Save
                </button>
                <button
                  onClick={this.handleClose}
                  type="button"
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              </Form>
            </Modal>
          </div>
        </div>

        <Modal isOpen={this.state.openModal} toggle={this.toggle}>
          <ModalBody>Are you sure want to delete?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              value={this.state.Id}
              onClick={this.deleteData}
            >
              Yes
            </Button>
            <Button color="secondary" onClick={this.toggle}>
              No
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.openEditModal} toggle={this.toggle}>
          <Form className="form">
            <h3>Edit Reservation</h3>
            <FormGroup row>
              <Label for="userName" sm={2}>
                User Name
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  name="userName"
                  id="userName"
                  placeholder="UserName"
                  value={this.state.userName}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="email" sm={2}>
                Email
              </Label>
              <Col sm={10}>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="firstName" sm={2}>
                First Name
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChange={(e) => {
                    this.setState({ firstName: e.target.value });
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="lastName" sm={2}>
                Last Name
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  value={this.state.lastName}
                  onChange={(e) => {
                    this.setState({ lastName: e.target.value });
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="isActive" sm={2}>
                Is Active
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  name="isActive"
                  id="isActive"
                  placeholder="Is Active"
                  value={this.state.isActive}
                />
              </Col>
            </FormGroup>
            <Button
              color="primary"
              value={this.state.Id}
              onClick={this.editData}
            >
              Update
            </Button>
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </Form>
        </Modal>
        <div
          className="table ag-theme-alpine"
          style={{
            height: "500px",
            width: "95%",
          }}
        >
          <AgGridReact
            onGridReady={this.onGridReady}
            ariaHideApp={false}
            rowSelection="single"
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            onSelectionChanged={this.onSelectionChanged}
            rowData={this.state.rowData}
          ></AgGridReact>
        </div>
        <br />
        <br />
        <Footer />
      </div>
    );
  }
}
