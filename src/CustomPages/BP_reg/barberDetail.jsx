import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import axios from "axios";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useAuthContext } from "../../Hooks/UseUserhook";
import { Modal, ModalHeader, ModalBody, ModalFooter , Button } from 'reactstrap';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const BarberDetail = () => {
  const { user } = useAuthContext();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [currentEvent, setCurrentEvent] = useState(null);
const [calendarHeight, setCalendarHeight] = useState(1000); // Default height



  const handlecheck = () => {
    console.log('clicked')
  }

  const sendWhatsAppMessage = (num , name ) => {
    const phoneNumber = num.replace(" " , "");
    console.log(phoneNumber) // Replace with the phone number you want to send message to
    const message = `Hello ${name}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+${phoneNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank'); // Opens WhatsApp URL in a new tab
  };
  

  useEffect(() => {
    const fetchAppointments = async () => {
      const { id, token } = JSON.parse(localStorage.getItem('user') || '{}');
      if (id && token) {
        try {
          const response = await axios.get(`https://hairsalon-vercel-test2.vercel.app/appointment/bpapp/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const formattedEvents = response.map(appointment => ({
            id: appointment._id,
            title: `${appointment.name} - ${appointment.service.join(', ')}`,
            start: `${appointment.date}T${appointment.time}`,
            extendedProps: {
              time : appointment.time,
              service : appointment.service.join(' , '),
              name : appointment.name,
              email: appointment.email,
              phoneNumber: appointment.phoneNumber,
              barber: appointment.barber
            }
          }));
          setEvents(formattedEvents);
        } catch (error) {
          console.error("Error fetching appointments", error);
        }
      }
    };
    fetchAppointments();
  }, [user]);

  useEffect(() => {
    // This function updates the height based on the screen size
    const updateHeight = () => {
      const screenHeight = window.innerWidth; // Use window.innerWidth for compatibility
      if (screenHeight < 577) {
        setCalendarHeight(600); // Set height for mobile devices
      } else {
        setCalendarHeight(1000); // Set height for desktop
      }
    };

    updateHeight(); // Update height on mount
    window.addEventListener('resize', updateHeight); // Update height on window resize

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);


  const handleEventClick = (clickInfo) => {
    setCurrentEvent({
      id: clickInfo.event.id,
      ...clickInfo.event.extendedProps,
    });
    console.log(clickInfo.event.extendedProps.name)
    setIsModalOpen(true);
  };

  const [data,setData] = useState()
  const[render , setrender] = useState(false)

  useEffect(() => {
      const fetchAppointments = async () => {
          const { id, token } = JSON.parse(localStorage.getItem('user') || '{}');
          if (!id || !token) return;
  
          try {
              const response = await axios.get(`https://hairsalon-vercel-test2.vercel.app/appointment/bpapp/${id}`, {
                  headers: { Authorization: `Bearer ${token}`}
              });
              const appointments =  response;
  
              // Fetch barber details for each appointment
              const barberDetailsPromises = appointments.map(async (appointment) => {
                  const barberResponse = await axios.get(`https://hairsalon-vercel-test2.vercel.app/barbers/${appointment.barber}`, {
                      headers: { Authorization: `Bearer ${token}`}
                  });
                  const fullName = `${barberResponse.f_name} ${barberResponse.l_name}`;
                  return { ...appointment, barberName: fullName};
              });
  
              // Wait for all barber details to be fetched
              const enrichedAppointments = await Promise.all(barberDetailsPromises);
              setData(enrichedAppointments);
              console.log(enrichedAppointments)
          } catch (error) {
              console.error("Error fetching appointments:", error);
          }
      };
  
      fetchAppointments();
  }, [render]);


  
  function arrayToListWithCommasAndAnd(array) {
      if (array.length === 1) {
        return array[0];
      }
      const allButLast = array.join(", ");
      return `${allButLast}`;
    }
    
    const toggleAppoint = async(id)=> {
      const {token } = JSON.parse(localStorage.getItem('user') || '{}');
      if(token){
          try {
              await axios.patch(`https://hairsalon-vercel-test2.vercel.app/appointment/toggleapp/${id}` , {} , {
                  headers: { 'Authorization': `Bearer ${token}` }
              })
              setrender(!render)

          } catch (error) {
              console.log(error)
              
          }
      }
    }



    const privateMessage = (num , name) => {
      const phoneNumber = num.replace(" " , "");
      console.log(phoneNumber) // Replace with the phone number you want to send message to
      const message = `Hello there! ${name}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=+${phoneNumber}&text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank'); // Opens WhatsApp URL in a new tab
    };
  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Appointments" breadcrumbItem="Calendar" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody >
                  <FullCalendar
                    plugins={[BootstrapTheme, dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar = {{
                      left: 'prev,next',
                      center: 'title',
                      right: 'dayGridWeek,dayGridDay,dayGridMonth'
                    }}
  
                    events={events}
                    eventClick={handleEventClick}
                    editable={true}
                    selectable={true}
                    contentHeight={calendarHeight}
                    
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
                <Col lg={12}>
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Latest Appointments</h4>

                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0">

                                    <thead>
                                        <tr>
                                            <th scope="col" style={{ width: "50px" }}>
                                                <div className="form-check">
                                                    <label className="form-check-label" htmlFor="customCheckall"></label>
                                                </div>
                                            </th>
                                            <th scope="col" style={{ width: "60px" }}></th>
                                            <th scope="col">Customer Name</th>
                                            <th scope="col">Service</th>
                                            <th scope="col">Barber</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Time</th>
                                            <th scope="col">Confirmation</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data && data.map((appointment, key) => (<tr key={key}>
                                            <td>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" id={appointment._id}
                                                    />
                                                    <label className="form-check-label" htmlFor={appointment._id}></label>
                                                </div>
                                            </td>
                                            <td>
                                               {/*  {item.src ? <img src={item.src} alt="user" className="avatar-xs rounded-circle" /> : <div className="avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-primary-subtle text-success">
                                                        {item.clientName.charAt(0)}
                                                    </span>
                                                </div>} */}
                                            </td>
                                            <td>
                                                <p className="mb-1 font-size-12">{appointment.phoneNumber}</p>
                                                <h5 className="font-size-15 mb-0">{appointment.name}</h5>
                                            </td>
                                            <td>{arrayToListWithCommasAndAnd(appointment.service)}</td>
                                            <td>{appointment.barberName}</td>
                                            <td>{appointment.date}</td>

                                            <td>
                                                 {appointment.time}
                                            </td>
                                            <td>
                                               {appointment && appointment.status ? <td className="status"><span className="badge badge-soft-success text-uppercase" onClick={() => toggleAppoint(appointment._id)}>Confirmed</span></td> :
                                                <td className="status"><span className="badge badge-soft-danger text-uppercase" onClick={() => {
                                                    sendWhatsAppMessage(appointment.phoneNumber , appointment.barberName , appointment.date , appointment.time)
                                                    toggleAppoint(appointment._id)}}>Not Confirmed</span></td>  } 
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-outline-success btn-sm me-1" onClick={() => privateMessage(appointment.phoneNumber , appointment.barberName)}><WhatsAppIcon></WhatsAppIcon></button>
                                                <Button type="Button" color="secondary" style={{marginLeft : "8px"}}>Review</Button>
                                            </td>
                                        </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
          <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>
          Appointment Details
        </ModalHeader>
          {currentEvent && (
            <div>
                    <ModalBody>

            <div>
              <p><strong>Name:</strong> {currentEvent.name}</p>
              <p><strong>Barber:</strong> {currentEvent.barber}</p>
              <p><strong>Service:</strong> {currentEvent.service}</p>
              <p><strong>Time:</strong> {currentEvent.time}</p>
              <p><strong>Phone Number:</strong> {currentEvent.phoneNumber}</p>
              <p><strong>Email:</strong> {currentEvent.email}</p>
            </div>
            </ModalBody>
                    <ModalFooter>
                    <Button color="danger">Delete Appointment</Button>
                    <Button color="primary" onClick={() => sendWhatsAppMessage(currentEvent.phoneNumber , currentEvent.name)}><WhatsAppIcon></WhatsAppIcon></Button>
                    <Button color="primary" onClick={() => setIsModalOpen(!isModalOpen)}>Close</Button>
                  </ModalFooter>
                  </div>

          )}

      </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default BarberDetail;



