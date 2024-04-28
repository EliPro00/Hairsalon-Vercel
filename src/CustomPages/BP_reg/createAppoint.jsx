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

const CreateAppointmentForm = () => {
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
  const [ newspec , setNewSpec] = useState()
  const [ TotalTime , setTotalTime] = useState()
  const [serviceCharges, setServiceCharges] = useState('');
  const [tip, setTip] = useState('');
  const [finalAmount, setFinalAmount] = useState('');


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable the button by setting loading to true
  
    const formData = {
      name,
      service: selectedServices.map(s => s.value), // Ensure you're sending the correct data format
      barber,
      date,
      time,
      phoneNumber,
      email,
    };
  
    try {
      const response = await axios.post("http://localhost:4000/appointment/", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAlert({
        show: true,
        type: "success",
        message: "Appointment created successfully!",
      });
      // Set a timeout to refresh the page after 3 seconds
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 3000);
    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Failed to create appointment.",
      });
    } finally {
      setLoading(false); // Re-enable the button by setting loading to false
    }
  };

 

  const animatedComponents = makeAnimated();

  // Convert your spec array for react-select
// Convert your spec array for react-select
// Convert your spec array for react-select directly from spec
const serviceOptions = spec.map(s => ({ value:  s.speciality, label:  `${s.speciality}  -$${s.price}` , price : s.price  , time : s.time}));


  useEffect(() => {
    const setDisabled = async() => {
      if(matchDate){
        const newBookedItems = await matchDate.filter((appointment) => appointment.barber === barber && appointment.date === date)
        const newBookedItemsTime = await newBookedItems.map(( appointment ) => appointment.time)
        setBookedTimes(newBookedItemsTime)
        console.log('time ' , newBookedItemsTime)

        if(time){
          const test222 = newBookedItemsTime.includes(time)
          
          if(!test222){
            setAlert({
              show: false,
              type: "success",
              message: "Failed to create appointment on Weekends.",
            });
          }else{
            setAlert({
              show: true,
              type: "danger",
              message: "Appointment is Booked in that time already.",
            });
          }
        }
      }else {
        console.log("Nothing fetched yet")
      }

    }
    setDisabled()
   
  },[barber , date , time])
  
  const checkForWeekends = (selectedDate) => {
    const dayOfWeek = new Date(selectedDate).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
    if (isWeekend) {
      setAlert({
        show: true,
        type: "danger",
        message: "Appointments cannot be created on weekends.",
      });
    } else {
      setAlert({ show: false, type: "", message: "" });
    }
  };

  useEffect(() => {
    // Assuming you want to check the default or current date initially
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    setDate(currentDate); // Set the current date as default
    checkForWeekends(currentDate); // Check if the default/current date is on a weekend
  }, []);
  const handleBlurTips = (e) => {
    let value = parseFloat(e.target.value);
    if (value < 0) {
      value = 0;
    }
    setTip(value.toString());
  };
  
  // Apply a similar onBlur handler for the tip field as well
  
  
  

  useEffect(() =>{
    const fetchData = async () => {
        try {
          const { id, token } = JSON.parse(localStorage.getItem('user') || '{}');
          if (id && token) {
            const response = await axios.get(`http://localhost:4000/barbers/bpb/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            setData(response);
          }
        } catch (error) {
          console.error("Fetching data failed", error);
        }
      };
    
      fetchData();
    

    
  },[])

  useEffect(() =>{
    const totalamount = Number(serviceCharges) + Number(tip) 
    console.log(totalamount)
    setFinalAmount(totalamount);


  },[serviceCharges , tip])

  const handleServiceChange = (selectedOptions) => {
    // Convert selected options to an array of values
    setSelectedServices(selectedOptions);
    if(selectedOptions){
      const price = selectedOptions.map((s) => s.price)
      const time = selectedOptions.map((s) => s.time)
      const sum = price.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const sumTime = time.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      setTotalTime(sumTime)

      console.log('sum' , sum , 'sumtime' , sumTime )

      setServiceCharges(sum)
    }
    console.log('check' , selectedOptions)
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setService(selectedValues)
    console.log("Selected services values: ", selectedValues);
  };


 

  // Handle change for Service Charges and Tip
  const handleChangeServiceCharges = (e) => {
  };

  const handleChangeTip = (e) => {
    setTip(e.target.value);
  };

  // Calculate final amount
  const calculateFinalAmount = () => {
    const total = Number(serviceCharges) + Number(tip);
    setFinalAmount(total);
  };

  const handlespecs = async(id) => {
    console.log('changed to : ' , id)

    try {
      if (user.id && user.token) {
        const response = await axios.get(`http://localhost:4000/spec/${id}`, {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });
        if(response){
          console.log('response', response)
          const spec = await response.map((barber) => barber.speciality)
          const specPrice = await response.map((barber) => barber.price)
          const specTime = await response.map((barber) => barber.time)
          console.log('spec',spec , 'price' , specPrice ,'time' , specTime ) 
          setSpec(response)
        }
      }
    } catch (error) {
      console.error("fetching for speciality failed", error);
    }
    

  }
  


  useEffect(() => {

    const getTime = async() => {
      const { id, token } = await JSON.parse(localStorage.getItem('user') || '{}');
      if(barber , token){
        try {
          const time = await axios.get(`http://localhost:4000/appointment/barberapp/${barber}` , {
            headers: { Authorization: `Bearer ${token}` }
          })
          setMatchDate(time)
        } catch (error) {
          console.log(error)
        }
      }
    }
    getTime()
  },[barber])



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
                  <Form onSubmit={handleSubmit}>
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
      type="select"
      value={barber}
      onChange={(e) => {
        handlespecs(e.target.value); // Pass the selected barber ID to handlespecs function
        setBarber(e.target.value)}} // This is where the change is captured
      required
    >
      <option value="">Select Barber</option> {/* Add a default "Select" option */}
      {data && data.map((barber, index) => (
        <option key={index} value={barber._id}>{barber.f_name}</option> // Use _id for value, assuming _id is unique
      ))}
    </Input>
  </FormGroup>
</Col>

                    </Row>
                    <Row>
                    <Col md={6}>
                        <FormGroup>
                          <Label for="barberInput">Service</Label>
                          <Select
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            defaultValue={[]}
                            isMulti
                            options={serviceOptions}
                            onChange={handleServiceChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="dateInput">Date</Label>
                          <Input
                          id="dateInput"
                          name="date"
                          type="date"
                          value={date}
                          onChange={(e) => {
                            const newDate = e.target.value;
                            setDate(newDate); // Update the date state
                            checkForWeekends(newDate); // Check if the new date is on a weekend
                          }}
                          required
                        />

                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                        <div className="form-group mb-3">
                      <Label>Pick Desired Time</Label>

                      <InputGroup>
                        <Flatpickr
                          className="form-control d-block"
                          placeholder="Select time"
                          onChange={(selectedDates, dateStr, instance) => {
                           if(TotalTime){
                            console.log(instance )
                           }
                            // selectedDates is an array of Date objects, dateStr is a formatted string representation
                            setTime(dateStr); // Assuming you want to store the time as a string
                          }}                          options={{
                            disable: bookedTimes.map(time => new Date(time)),
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            time_24hr: true,
                            defaultHour : "10",
                            minuteIncrement : 15
                          }}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <i className="mdi mdi-clock-outline" />
                          </span>
                        </div>
                      </InputGroup>
                    </div>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="phoneInput">Phone Number</Label>
                          <InputMask
                            mask="\971 99 999 9999"
                            className="form-control"
                            id="phoneInput"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                      <FormGroup>
        <Label for="serviceChargesInput">Service Charges</Label>
        <Input
          id="serviceChargesInput"
          name="serviceCharges"
          min = "0"
          placeholder="Enter service charges"
          type="number"
          readOnly
          disabled
          value={serviceCharges}
          onChange={handleChangeServiceCharges}
          required
        />
      </FormGroup>
                      </Col>
                      <Col md={4}>
                      <FormGroup>
        <Label for="tipInput">Tip</Label>
        <Input
          min="0"
          onBlur={handleBlurTips}
          id="tipInput"
          name="tip"
          placeholder="Enter tip amount"
          type="number"
          value={tip}

          onChange={handleChangeTip}
          required
        />
        </FormGroup>

                      </Col>
                      <Col md={4}>
                      <FormGroup>
        <Label for="tipInput">Total Amount</Label>
        <Input
          id="tipInput"
          name="Total"
          type="number"
          value={finalAmount}
          required
          readOnly
        />
        </FormGroup>

                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="emailInput">Email</Label>
                          <Input
                            id="emailInput"
                            name="email"
                            placeholder="Enter client's email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                    <Button type="submit" color="primary" disabled={loading || alert.show}>
                      {loading ? 'Submitting...' : 'Create Appointment'}
                    </Button> 
                    </FormGroup>

                    {alert.show && (
                      <Row>
                        <Col md={12}>
                          <Alert color={alert.type}>{alert.message}</Alert>
                        </Col>
                      </Row>
                    )}
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

export default CreateAppointmentForm;
