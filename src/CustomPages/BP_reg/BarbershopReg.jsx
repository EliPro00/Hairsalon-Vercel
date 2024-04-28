import React, { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  TabContent,
  TabPane,
  Progress,
  NavLink,
  NavItem,
} from "reactstrap";

import classnames from "classnames";
import { Link } from "react-router-dom";
import InputMask from "react-input-mask";
import { useAuthContext } from "../../Hooks/UseUserhook";
import { UncontrolledAlert} from 'reactstrap'
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";

const BarbershopReg = () => {
  document.title = "Register BarberShop | Technova - EasyBarbers";
  const [activeTab, setactiveTab] = useState(1);
  const [activeTabwiz, setoggleTabwiz] = useState(1);
  const {user} = useAuthContext()

  const [passedSteps, setPassedSteps] = useState([1]);
  const [passedStepswiz, setpassedStepswiz] = useState([1]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);


  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];
      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }
  

  function toggleTabwiz(tab) {
    if (activeTabwiz !== tab) {
      var modifiedSteps = [...passedStepswiz, tab];
      if (tab >= 1 && tab <= 3) {
        setoggleTabwiz(tab);
        setpassedStepswiz(modifiedSteps);
      }
    }
  }


  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [emiratesID, setEmiratesID] = useState('');

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [barbershopImg, setBarbershopImg] = useState('');
  const [est_year, setEstYear] = useState('');
  const [operating_hrs, setOperatingHrs] = useState('');
  const [services, setServices] = useState('');
  const [updateID , setUpdateID] = useState()
  const [loading , setLoading] = useState(false)



  useEffect(() => {
    const logged_id = JSON.parse(localStorage.getItem('user'))
    const { id } = logged_id
    setUpdateID(id)
   
  },[])

  
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const owner_data = {
      firstname,
      lastname,
      phone,
      address,
      email,
      emiratesID,
    }
    const barbershop_data = {
      name , location , barbershopImg , est_year , operating_hrs , services
    }
    const updateOperation = updateID ? axios.put(`http://localhost:4000/barbers/bp/${updateID}`, barbershop_data, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    }) : Promise.resolve(); 

  
    
    
    const createOperation = axios.post('http://localhost:4000/owners/', owner_data, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))




  Promise.all([updateOperation, createOperation])
  .then(() => {
    setShowSuccessAlert(true); // Show success alert
    setTimeout(() => {
      window.location.reload(); // Refresh the page after 3 seconds
    }, 10000);
  })
  .catch((err) => console.log(err));
  

 
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Registration Form" breadcrumbItem="Barber Registration" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Registration Form </h4>
                  <div id="progrss-wizard" className="twitter-bs-wizard">
                    <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                      <NavItem
                        className={classnames({
                          active: activeTabwiz === 1,
                        })}
                      >
                        <NavLink
                          className={
                            (classnames({
                              active: activeTabwiz === 1,
                            }))
                          }
                          onClick={() => {
                            toggleTabwiz(1);
                          }}
                        >
                          <span className="step-number">01</span>
                          <span className="step-title" style={{ paddingLeft: "10px" }}>Owner Details</span>
                        </NavLink>
                      </NavItem>
                      <NavItem
                        className={classnames({
                          active: activeTabwiz === 2,
                        })}
                      >
                        <NavLink
                          className={
                            (classnames({
                              active: activeTabwiz === 2,
                            }))
                          }
                          onClick={() => {
                            toggleTabwiz(2);
                          }}
                        >
                          <span className="step-number">02</span>
                          <span className="step-title" style={{ paddingLeft: "10px" }}>BarberShop Details</span>
                        </NavLink>
                      </NavItem>

                      <NavItem
                        className={classnames({
                          active: activeTabwiz === 3,
                        })}
                      >
                        <NavLink
                          className={
                            (classnames({
                              active: activeTabwiz === 3,
                            }))
                          }
                          onClick={() => {
                            toggleTabwiz(3);
                          }}
                        >
                          <span className="step-number">03</span>
                          <span className="step-title" style={{ paddingLeft: "10px" }}>Confirm Detail</span>
                        </NavLink>
                      </NavItem>
                    </ul>
                    <div id="bar" className="mt-4">
                      <div className="mb-4">
                        <Progress
                          value={33 * activeTabwiz}
                          color="success"
                          animated
                        ></Progress>
                      </div>
                    </div>

                    <TabContent activeTab={activeTabwiz} className="twitter-bs-wizard-tab-content">
                      <TabPane tabId={1}>
                        <Form >
                          <Row>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="basicpill-firstname-input12">
                                  First name
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="basicpill-firstname-input12"
                                  placeholder="Enter Your First Name"
                                  onChange={(e) => setFirstname(e.target.value)}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="basicpill-lastname-input22">
                                  Last name
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="basicpill-lastname-input22"
                                  placeholder="Enter Your Last Name"
                                  onChange={(e) => setLastname(e.target.value)}

                                />
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="basicpill-phoneno-input32">
                                  Phone
                                </Label>
                                <InputMask
                                  type="text"
                                  className="form-control"
                                  id="basicpill-phoneno-input32"
                                  mask='\971 99 999 9999'
                                  placeholder="Enter Your Phone No."
                                  onChange={(e) => setPhone(e.target.value)}

                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="basicpill-email-input42">
                                  Email
                                </Label>
                                <Input
                                  type="email"
                                  className="form-control"
                                  id="basicpill-email-input42"
                                  placeholder="Enter Your Email ID"
                                  onChange={(e) => setEmail(e.target.value)}

                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="basicpill-address-input12">
                                  Address
                                </Label>
                                <textarea
                                  id="basicpill-address-input12"
                                  className="form-control"
                                  rows="2"
                                  placeholder="Enter Your Address"
                                  onChange={(e) => setAddress(e.target.value)}

                                />
                              </FormGroup>
                              
                            </Col>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="basicpill-address-input12">
                                  Emirates ID Number
                                </Label>
                                <InputMask
                                  id="basicpill-address-input12"
                                  className="form-control"
                                  rows="2"
                                  mask="999-9999-9999999-9"
                                  placeholder="Enter Your Emirates ID Number"
                                  onChange={(e) => setEmiratesID(e.target.value)}

                                />
                              </FormGroup>
                              
                            </Col>
                          </Row>
                        </Form>
                      </TabPane>
                      <TabPane tabId={2}>
                        <div>
                          <Form>
                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-pancard-input52">
                                    BarberShop Name
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-pancard-input52"
                                    placeholder="Enter The Barbershop Name"
                                    onChange={(e) => setName(e.target.value)}

                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-vatno-input62">
                                    BarberShop Images
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-vatno-input62"
                                    placeholder="Post Images of the barbershop"
                                    onChange={(e) => setBarbershopImg(e.target.value)}

                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-cstno-input72">
                                    Establishment Year
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-cstno-input72"
                                    placeholder="Enter Establishment Year."
                                    onChange={(e) => setEstYear(e.target.value)}

                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-servicetax-input82">
                                    BarberShop Adress
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-servicetax-input82"
                                    placeholder="Enter BarberShop Address."
                                    onChange={(e) => setAddress(e.target.value)}

                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-companyuin-input92">
                                    Operating Hours
                                  </Label>
                                  <InputMask
                                    mask='99 : 99 AM - 99 : 99 PM'
                                    type="text"
                                    className="form-control"
                                    id="basicpill-companyuin-input92"
                                    placeholder="Enter operating Hours"
                                    onChange={(e) => setOperatingHrs(e.target.value)}

                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-declaration-input102">
                                    Services Offered
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-Declaration-input102"
                                    placeholder="Services offered"
                                    onChange={(e) => setServices(e.target.value)}

                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </TabPane>
                    
                      <TabPane tabId={3}>
  <div className="row justify-content-center">
    <Col lg="12">
      <div className="text-center">
        <h5 className="mb-4">Please confirm your details</h5>
        <ul className="list-group list-group-flush text-start">
          <li className="list-group-item">First Name: {firstname}</li>
          <li className="list-group-item">Last Name: {lastname}</li>
          <li className="list-group-item">Phone: {phone}</li>
          <li className="list-group-item">Email: {email}</li>
          <li className="list-group-item">Address: {address}</li>
          <li className="list-group-item">Emirates ID: {emiratesID}</li>
          <li className="list-group-item">Barbershop Name: {name}</li>
          <li className="list-group-item">Location: {location}</li>
          <li className="list-group-item">Establishment Year: {est_year}</li>
          <li className="list-group-item">Operating Hours: {operating_hrs}</li>
          <li className="list-group-item">Services Offered: {services}</li>
        </ul>
      </div>
    </Col>
  </div>
</TabPane>

                    </TabContent>

                    <ul className="pager wizard twitter-bs-wizard-pager-link">
  <li
    className={activeTabwiz === 1 ? "previous disabled me-2" : "previous me-2"}
  >
    <Link
      to="#"
      onClick={() => {
        toggleTabwiz(activeTabwiz - 1);
      }}
    >
      Previous
    </Link>
  </li>
  {activeTabwiz < 3 ? (
    <li className="next">
      <Link
        to="#"
        onClick={() => {
          toggleTabwiz(activeTabwiz + 1);
        }}
      >
        Next
      </Link>
    </li>
  ) : (
<li>
  <button
    type="button"
    className="btn btn-primary"
    onClick={handleSubmit}
  >
    Submit
  </button>
</li>
  )}
</ul>

                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default BarbershopReg;
