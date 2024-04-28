


import React, { useState, useCallback, useRef, useEffect } from 'react';
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
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { useAuthContext } from "../../Hooks/UseUserhook";
import 'boxicons/css/boxicons.min.css';
import InputMask from "react-input-mask";
import Alert from '@mui/material/Alert';
import ReactCrop from "react-image-crop";





const AddBarberForm = () => {
  document.title = "Add Barber | Upzet - React Admin & Dashboard Template";
  const [ id , setID] = useState()
  const { user }= useAuthContext()

  // State to store form inputs
  const [f_name, setFName] = useState('');
  const [l_name, setLName] = useState('');
  const [specialties, setSpecialties] = useState([{name : '' , price : '' , time : ''}]);
  const [experienceYears, setExperienceYears] = useState();
  const [image, setImage] = useState(null);
  const [ speclist , setlist ] = useState([{ service : ''} ])
  const [phoneNumber , setPhone] = useState('')
  const [loading,setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [ newSpecID , setNewSpec] = useState()
  const [ newDATA  , setNewDATA] = useState()

  useEffect(() => {
    specialties.forEach((single , index) => {
      console.log(`Row ${index} : ` , single)
    })

  },[specialties ])

  useEffect(() => {
    if(newDATA){
      newDATA.forEach((single,index) => {
        console.log('post req' , single , index)
      })
    }
 
  },[newDATA])

 

  const handleSpecialtyChange = (index, event) => {
    const newSpecialties = [...specialties];
    newSpecialties[index] = {
      ...newSpecialties[index],
      [event.target.name]: event.target.value,
    };
    setSpecialties(newSpecialties);
  };
  
  

  const handleAddSpecialty = () => {
    const newSpecialty = { name: '', price: '' , time: ''};
    setSpecialties([...specialties, newSpecialty]);
  };
  

  const handleRemoveSpecialty = (index) => {
    const newSpecialties = [...specialties];
    newSpecialties.splice(index, 1);
    setSpecialties(newSpecialties);
  };
  
  // Handle form input changes
  



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(image)
  
 

    const formData = new FormData();
    // Append file to formData
    formData.append('f_name', f_name);
    formData.append('l_name', l_name);
    formData.append('specialties', specialties.map(s => s.name));
    formData.append('experienceYears', experienceYears);
    formData.append('phoneNumber', phoneNumber);
    formData.append('image', image);






    const { id } = JSON.parse(localStorage.getItem('user'))
    if( id ){
      try {
        const response = await axios.post(`http://localhost:4000/barbers/${id}/barbers`, formData, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        await console.log(response.barber._id)
        await setNewSpec(response.barber._id)
        await setNewDATA(response.barber.specialties)
        await submitSpecialties(response.barber._id);


        setAlert({ show: true, type: 'success', message: 'Barber added successfully!' });
        // Reset form or redirect user
      } catch (error) {
        setAlert({ show: true, type: 'error', message: error.response?.data?.message || 'Failed to add barber.' });
      } finally {
        setLoading(false);
      }
    }
    
  };
  useEffect(() => {
    const { id } = JSON.parse(localStorage.getItem('user'))
    setID ( id )

  },[])
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 10000); // Alert will disappear after 5 seconds
  
      return () => clearTimeout(timer);
    }
  }, [alert]);
  

  const submitSpecialties = async (barberId) => {
    specialties.forEach(async (specialty) => {
      const specialtyData = { b_id : barberId , price : specialty.price , speciality: specialty.name , time :specialty.time  }; // Prepare data for post request
      try {
        console.log('success' , specialtyData)
        const response = await axios.post("http://localhost:4000/spec/", specialtyData, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json', // Correct Content-Type for JSON
          },
        });
        console.log('ss' , response)
        // Handle successful submission of specialty name
      } catch (error) {
        console.log('error' , specialtyData)
        // Handle error in submitting specialty name
        console.error('Error submitting specialty:', error);
      }
    });
  };



  return (
<React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Barbers" breadcrumbItem="Add Barber" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Barber Information</h4>

                  <Form onSubmit={handleSubmit}>
                    <Row form>
                      {/* First and Last Name */}
                      <Col md={6}>
                        <FormGroup>
                          <Label for="f_name">First Name</Label>
                          <Input
                            id="f_name"
                            name="f_name"
                            placeholder="Enter first name"
                            type="text"
                            onChange={(e) => setFName(e.target.value)}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="l_name">Last Name</Label>
                          <Input
                            id="l_name"
                            name="l_name"
                            placeholder="Enter last name"
                            type="text"
                            onChange={(e) => setLName(e.target.value)}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* Specialties and Experience */}
                    {/* Specialties */}
                    <Row>
  {specialties.map((specialty, index) => (
    <React.Fragment key={index}>
      <Col md={4}>
        <FormGroup>
          <Label for={`specialty-${index}`}>Specialty #{index + 1}</Label>
          <Input
            id={`specialty-${index}`}
            name="name"
            placeholder="Enter Specialty"
            type="text"
            value={specialty.name}
            onChange={(e) => handleSpecialtyChange(index, e)}
            required
          />
        </FormGroup>
      </Col>
      <Col md={3}>
        <FormGroup>
          <Label for={`specialty-${index}`}>Price #{index + 1}</Label>
          <Input
            id={`Price-${index}`}
            name="price"
            placeholder="Enter Price"
            onChange={(e) => handleSpecialtyChange(index, e)}

            type="text"
            value={specialty.price}
          />
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label for={`specialty-${index}`}>Time Taken #{index + 1}</Label>
          <Input
            id={`Time Taken-${index}`}
            name="time"
            placeholder="Enter Price"
            onChange={(e) => handleSpecialtyChange(index, e)}

            type="text"
            value={specialty.time}
          />
        </FormGroup>
      </Col>
      <Col md={1} className="d-flex align-items-center">
        <Button color="danger" onClick={() => handleRemoveSpecialty(index)} className="btn-icon me-2">
          <i className='bx bx-minus'></i>
        </Button>
        {index === specialties.length - 1 && specialties.length < 5 && (
          <Button color="primary" onClick={handleAddSpecialty} className="btn-icon">
            <i className='bx bx-plus'></i>
          </Button>
        )}
      </Col>
      {/* Empty column or for additional information */}
      
    </React.Fragment>
  ))}
  <Col md={5}>
        {/* This can be empty or you can place additional form controls or information here */}
        {/* Example: You can place a description input for each specialty */}
        <FormGroup>
          <Label>Phone Number</Label>
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
      <Col md={4}>
        {/* This can be empty or you can place additional form controls or information here */}
        {/* Example: You can place a description input for each specialty */}
        <FormGroup>
          <Label>Experience Year</Label>
          <InputMask
            type="number"
            className="form-control"
            id="basicpill-phoneno-input32"
            placeholder="Enter Years of Experience."
            onChange={(e) => setExperienceYears(e.target.value)}

                                />
        </FormGroup>
      </Col>
</Row>
{
alert.show && (
  <Row>
    <Col md={12}>
      <Alert severity={alert.type}>{alert.message}</Alert>
    </Col>
  </Row>
)}
            



                    {/* Image Upload */}
                    <Row form>
                    <Col md={12}>
          <FormGroup>
            <Label for="image">Barber Image</Label>
            <Input
              type="file"


              id="image"
              name="image"
              onChange={(e) => {
                setImage(e.target.files[0])}}
              
            />
          </FormGroup>
        </Col>


                    </Row>

                    
                    

                    <Button type="submit" disabled={loading} color="primary">
                      Submit
                    </Button>
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
 

export default AddBarberForm;