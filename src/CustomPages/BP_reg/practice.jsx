import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Button,
  Alert,
  InputGroup
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { useAuthContext } from "../../Hooks/UseUserhook";
import InputMask from "react-input-mask";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const Practice = () => {
  document.title = "Create Appointment";
  const { user } = useAuthContext();

  // State to store form inputs
  const [name, setName] = useState("");
  const [service, setService] = useState([]);
  const [barber, setBarber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]); // Updated for multiple services
  const [ id , setID] = useState()
  const [ data, setData] = useState()
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [ spec , setSpec] = useState([])
  const [ matchDate , setMatchDate] = useState()
  const [bookedTimes, setBookedTimes] = useState([]);

  const [ inputFields , setInputField] = useState([
    {firstName : '' , lastName : ''},
    {firstName : '' , lastName : ''},
    
  ])

  useEffect(() => {
    inputFields.forEach((field, index) => {
        console.log(`Row ${index}: `, field);
    });
}, [inputFields]); // This useEffect runs whenever inputFields changes


  // Handle form submission

  // Convert your spec array for react-select

  const handleChange = ( index, e) =>{
    const values = [...inputFields]
    console.log(values)
    values[index][e.target.name] = e.target.value
    console.log(e.target.value)
    setInputField(values)


    if(inputFields){
        inputFields.map((single) => {
            console.log('check ' , single)
        })
    }
  }


  


  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Appointments" breadcrumbItem="Create Appointment" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Appointment Information</h4>
                  <Form >
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="nameInput">Name</Label>
                          <Input
                            id="nameInput"
                            name="name"
                            placeholder="Enter client's name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
  <FormGroup>
    <Label for="barberSelect">Barber</Label>
    <Input
      id="barberSelect"
      name="barber"
      type="text"
      value={barber}
      onChange={(e) => setBarber(e.target.value)}
    >
    </Input>
  </FormGroup>
</Col>
</Row>
                {inputFields.map((inputField , index) => (
                    <Row key={index}>
                        <Col lg={4}>
                        <Label for="nameInput">Name</Label>
                                <Input
                                                id="nameInput"
                                                name="firstName"
                                                placeholder="Enter client's name"
                                                type="text"
                                                value={inputField.firstName}
                                                onChange={(e) => handleChange(index, e)}
                                                required
                                            />
                        </Col>
                        <Col lg={4}>
                        <Label for="nameInput">LastName</Label>
                                <Input
                                                id="nameInput"
                                                name="lastName"
                                                placeholder="Enter client's name"
                                                type="text"
                                                required
                                                value={inputField.lastName}
                                                onChange={(e) => handleChange(index, e)}


                                            />
                        </Col>
                        <Col md={2} className="d-flex align-items-center">
        <Button color="danger" className="btn-icon me-2">
          <i className='bx bx-minus'></i>
        </Button>
       
          <Button color="primary" className="btn-icon">
            <i className='bx bx-plus'></i>
          </Button>
      </Col>
                    </Row>
                ))}
                      <Button>send</Button>

                    <Row>
                        
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Practice;
