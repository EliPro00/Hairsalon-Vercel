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

const Calendar = () => {
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
          const response = await axios.get(`http://localhost:4000/appointment/bpapp/${id}`, {
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

export default Calendar;



