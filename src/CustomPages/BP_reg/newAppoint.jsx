import React, { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  NavLink,
  NavItem,
  FormGroup,
  Input,
  Label,
  TabContent,
  TabPane,
  Progress,
  Form,
  CardImg,
  CardText,
  Alert,
  InputGroup,
  Button

} from "reactstrap";
import classnames from "classnames";
import { useState } from "react";
import { Link } from "react-router-dom";
import {UncontrolledCarousel } from "reactstrap";
import { useAuthContext } from "../../Hooks/UseUserhook";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import InputMask from "react-input-mask";






// Carousel
import Slide from "./CarouselTypes/slide";
import Slidewithcontrol from "./CarouselTypes/slidewithcontrol";
import Slidewithindicator from "./CarouselTypes/slidewithindicator";
import Slidewithcaption from "./CarouselTypes/slidewithcaption";
import Slidewithfade from "./CarouselTypes/slidewithfade";
import SlidewithcaptionDark from "./CarouselTypes/slidewithcaptionDark";
import Slideinterval from "./CarouselTypes/slideinterval";
import axios from "axios";


//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const NewAppoint = () => {

    const [activeTab, setactiveTab] = useState(1);
    const [activeTabwiz, setoggleTabwiz] = useState(1);
    const [passedSteps, setPassedSteps] = useState([1]);
    const [passedStepswiz, setpassedStepswiz] = useState([1]);
    const [data , setData ] = useState()
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedservice, setSelService] = useState([]);
    const [date, setDate] = useState("");
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [ matchDate , setMatchDate] = useState()
    const [bookedTimes, setBookedTimes] = useState([]);
    const [time, setTime] = useState("");
    const [finalAmount, setFinalAmount] = useState('');
    const [serviceCharges, setServiceCharges] = useState('');
    const [ name , SetName ] = useState('')
    const [ number , setNumber] = useState()
    const [loading, setLoading] = useState(false);
    const [ fullname , setFullName] = useState('')



    useEffect(() => {
      const total = selectedservice.reduce((acc, curr) => acc + parseFloat(curr.price), 0);
      setFinalAmount(total);
      console.log("Updated Total Amount: ", total);
  }, [selectedservice]);





    const [spec , setSpec] = useState([])
    const { user } = useAuthContext();


 
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
          if (tab >= 1 && tab <= 4) {
            setoggleTabwiz(tab);
            setpassedStepswiz(modifiedSteps);
          }
        }
      }

      useEffect(() => {
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


  document.title = "Carousel | Upzet - React Admin & Dashboard Template";



  const toggleSelection = async(id , fname , lname) => {

    if (selectedBarber === id) {
      setSelectedBarber(null); // Unselect if the same barber is clicked again
    } else {
      await setFullName(fname , " " , lname)
      setSelectedBarber(id); 
      try {
        if(id){
          const response = await axios.get(`http://localhost:4000/spec/${id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` },
          })
          const spec = await response.map((barber) => barber.speciality)
          const specPrice = await response.map((barber) => barber.price)
          setSpec(response)
        }
          
      } catch (error) {
        console.log(error) 
      }

      
    }
    
  };

  useEffect(() => {

    const getTime = async() => {
      const { id, token } = await JSON.parse(localStorage.getItem('user') || '{}');
      if(selectedBarber , token){
        try {
          const time = await axios.get(`http://localhost:4000/appointment/barberapp/${selectedBarber}` , {
            headers: { Authorization: `Bearer ${token}` }
          })
          setMatchDate(time)
        } catch (error) {
          console.log(error)
        }
      }
    }
    getTime()
  },[selectedBarber])

  useEffect(() => {
    const setDisabled = async() => {
      if(matchDate){
        const newBookedItems = await matchDate.filter((appointment) => appointment.barber === selectedBarber && appointment.date === date)
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
   
  },[selectedBarber , date , time])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable the button by setting loading to true
  
    const formData = {
      name,
      service: selectedservice.map(s => s.name), // Ensure you're sending the correct data format
      barber : selectedBarber,
      date,
      time,
      phoneNumber : number,
    };
  
    try {
      console.log(formData)
      const response = await axios.post("http://localhost:4000/appointment/", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAlert({
        show: true,
        type: "success",
        message: "Appointment created successfully!",
      });
      // Set a timeout to refresh the page after 3 seconds

    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        type: "dagner",
        message: error.response?.data?.message || "Failed to create appointment.",
      });
    } finally {
      setLoading(false); // Re-enable the button by setting loading to false
    }
  };

useEffect(() => {
  console.log(' selected service ',selectedservice.map(s => s.name))
},[selectedservice])


  const toggleService = (serviceName, price) => {
    setSelService(currentSelected => {
        // Check if the service is already selected based on its name
        const index = currentSelected.findIndex(service => service.name === serviceName);
        if (index > -1) {
            // Remove the service from the array (unselect it)
            return currentSelected.filter(service => service.name !== serviceName);
        } else {
            // Add the service to the array (select it) along with its price
            return [...currentSelected, { name: serviceName, price: price }];
        }
    });
};

useEffect(() => {
  console.log("Selected Services:", selectedservice);
}, [selectedservice]);


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






  const handlespecs = async(id) => {

    try {
      if (user.id && user.token) {
        const response = await axios.get(`http://localhost:4000/spec/${id}`, {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });
        if(response){
         
          const specTime = await response.map((barber) => barber.time)
          setSpec(response)
        }
      }
    } catch (error) {
      console.error("fetching for speciality failed", error);
    }
    

  }

  useEffect(() => {
    setSelService([])
  },[selectedBarber])

  return (
    <React.Fragment>

      <div className="page-content">
        <Container fluid={true}>
          <Form onSubmit={handleSubmit}>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Carousel" />
            <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Wizard with Progressbar</h4>
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
                          <span className="step-title" style={{ paddingLeft: "10px" }}>Choose Your Barber</span>
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
                          <span className="step-title" style={{ paddingLeft: "10px" }}>Choose Services</span>
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
                          <span className="step-title" style={{ paddingLeft: "10px" }}>Bank Details</span>
                        </NavLink>
                      </NavItem>

                      <NavItem
                        className={classnames({
                          active: activeTabwiz === 4,
                        })}
                      >
                        <NavLink
                          className={
                            (classnames({
                              active: activeTabwiz === 4,
                            }))
                          }
                          onClick={() => {
                            toggleTabwiz(4);
                          }}
                        >
                          <span className="step-number">04</span>
                          <span className="step-title" style={{ paddingLeft: "10px" }}>Confirm Detail</span>
                        </NavLink>
                      </NavItem>
                    </ul>
                    <div id="bar" className="mt-4">
                      <div className="mb-4">
                        <Progress
                          value={25 * activeTabwiz}
                          color="success"
                          animated
                        ></Progress>
                      </div>
                    </div>

                    <TabContent activeTab={activeTabwiz} className="twitter-bs-wizard-tab-content">
                      <TabPane tabId={1}>
                        <Form>
                        <Row>
                      {data && data.map((single, index) => (
                        <Col lg={6} key={index}>
                          <Card 
                          onChange={() => handlespecs(single._id)}
                            onClick={() => toggleSelection(single._id , single.f_name , single.l_name)}
                            style={{ 
                              cursor: "pointer", 
                              border: selectedBarber === single._id ? '2px solid blue' : 'none' 
                            }}
                          >
                            <Row className="no-gutters align-items-center">
                              <Col md={4}>
                                <CardImg className="img-fluid" src={`http://localhost:4000/Images/${single.image}`} alt="Barber" />
                              </Col>
                              <Col md={8}>
                                <CardBody>
                                  <CardTitle>{single.f_name} {single.l_name}</CardTitle>
                                  <CardText>
                                  {single.f_name} {single.l_name}, with {single.experienceYears} years' experience, ensuring tailored styling for every client
                                  </CardText>
                                </CardBody>
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      ))}
                      </Row>

                            
                        </Form>
                      </TabPane>
                      <TabPane tabId={2}>
                        <div>
                          <Form>
                            
                            <Row>
                              {spec && spec.map((single , index) => 
                              {

                                return(
                                  <Col lg={6}>
              <Card  className="card-info"
              key={single.speciality} 
              onClick={() => toggleService(single.speciality , single.price)}
                            style={{ 
                              cursor: "pointer",
                              backgroundColor: selectedservice.find(s => s.name === single.speciality) ? 'green' : 'black',
                              color: selectedservice.find(s => s.name === single.speciality) ? 'white' : 'black',
                              border: selectedservice.find(s => s.name === single.speciality) ? '2px solid green' : 'red'
                            }}>
              <h6 className="card-header">{single.speciality} : AED {single.price}</h6>


              </Card>
            </Col>
                                )
                              })}
                            

                              
                            </Row>
                            <Row>
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
                            
                          </Form>
                        </div>
                      </TabPane>
                      <TabPane tabId={3}>
                        <div>
                          <Form>
                            <Row>
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
                      <Col md={6}>
                        <FormGroup>
                        <div className="form-group mb-3">
                      <Label>Pick Desired Time</Label>

                      <InputGroup>
                        <Flatpickr
                          className="form-control d-block"
                          placeholder="Select time"
                          onChange={(selectedDates, dateStr, instance) => {
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
                                    
                            </Row>
                            <Row>

                            <Col md={6}>
                      <FormGroup>
        <Label for="tipInput">Customer Full Name</Label>
        <Input
          id="tipInput"
          name="Total"
          type="text"
          value={name}
          placeholder="Enter Full Name"

          onChange={(e) => SetName(e.target.value)}
          required
        />
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
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            required
                          />
                        </FormGroup>
                      </Col>

                              
                            </Row>
                            <Row>
                              <Col md={6}>
                              <Row>
                        {alert.show && (
                      <Row>

                        <Col md={12}>
                        <FormGroup>

                          <Alert color={alert.type}>{alert.message}</Alert>
                          </FormGroup>
                        </Col>
                      </Row>
                    )}
                        </Row>
                              </Col>
                            </Row>
      
                          </Form>
                        </div>
                      </TabPane>
                      <TabPane tabId={4}>
                        <div className="row justify-content-center">
                        <Col lg="12">
      <div className="text-center">
        <h5 className="mb-4">Please confirm your details</h5>
        <ul className="list-group list-group-flush text-start">
          <li className="list-group-item">Full Name : {name}</li>
          <li className="list-group-item">Phone: {number}</li>
          <li className="list-group-item">Barber: {fullname}</li>
          <li className="list-group-item">Selected Services: {selectedservice.map(service => service.name).join(', ')}</li>
          <li className="list-group-item">Total : {finalAmount}</li>
          <li className="list-group-item">Date: {date}</li>
          <li className="list-group-item">Time: {time}</li>

                    



        </ul>
      </div>
    </Col>
                        </div>
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
                      </TabPane>
                    </TabContent>

                    <ul className="pager wizard twitter-bs-wizard-pager-link">
                      <li
                        className={
                          activeTabwiz === 1
                            ? "previous disabled me-2"
                            : "previous me-2"
                        }
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
                      <li
                        className={
                          activeTabwiz === 4 ? "next disabled" : "next"
                        }
                      >
                        <Link
                          to="#"
                          onClick={() => {
                            toggleTabwiz(activeTabwiz + 1);
                          }}
                        >
                          Next
                        </Link>
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </Col>
            </Row>

            </Form>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default NewAppoint;
