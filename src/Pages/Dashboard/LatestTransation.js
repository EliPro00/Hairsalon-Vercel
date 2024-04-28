import React, { useEffect, useState } from 'react';

import { Row, Col, Button } from 'reactstrap';

import axios from 'axios';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';




const LatestTransation = () => {

    const [data,setData] = useState()
    const[render , setrender] = useState(false)

    useEffect(() => {
        const fetchAppointments = async () => {
            const { id, token } = JSON.parse(localStorage.getItem('user') || '{}');
            if (!id || !token) return;
    
            try {
                const response = await axios.get(`http://localhost:4000/appointment/bpapp/${id}`, {
                    headers: { Authorization: `Bearer ${token}`}
                });
                const appointments =  response;
    
                // Fetch barber details for each appointment
                const barberDetailsPromises = appointments.map(async (appointment) => {
                    const barberResponse = await axios.get(`http://localhost:4000/barbers/${appointment.barber}`, {
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
                await axios.patch(`http://localhost:4000/appointment/toggleapp/${id}` , {} , {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                setrender(!render)

            } catch (error) {
                console.log(error)
                
            }
        }
      }

      const sendWhatsAppMessage = (num , name , date , time) => {
        const phoneNumber = num.replace(" " , "");
        console.log(phoneNumber) // Replace with the phone number you want to send message to
        const message = `Hello there! Your appointment with ${name}  on ${date}  at ${time} is confirmed.
         Please be there 15 min before your appointment time to avoid any confusions `;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=+${phoneNumber}&text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank'); // Opens WhatsApp URL in a new tab
      };

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
                                                <button type="button" className="btn btn-outline-danger btn-sm me-1">Cancel</button>
                                            </td>
                                        </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default LatestTransation;