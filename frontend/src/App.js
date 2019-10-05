import React, { useState, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

function App() {

  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState();

  const onClick = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationResult();
    try {
      const res = await fetch('/api/validate-email', {
        method: 'POST',
        body: JSON.stringify({email: value }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const json = await res.json();
      setValidationResult(json);
      console.log(json);
    } catch(e) {
      console.log('error validating email');
    }

    setIsLoading(false);
  })

  // console.log('render');

  return (
      <Container style={{backgroundColor: 'white', borderRadius: '10px', padding: '50px'}}>
      <Row>
        <Col xs={12} md={12} lg={12} >
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p> */}
        {/*   Edit <code>src/App.js</code> and save to reload. */}
        {/* </p> */}
        {/* <a */}
        {/*   className="App-link" */}
        {/*   href="https://reactjs.org" */}
        {/*   target="_blank" */}
        {/*   rel="noopener noreferrer" */}
        {/* > */}
        {/*   Learn React */}
        {/* </a> */}
        {/* {isLoading ? <p>Loading...</p> : <p> </p>} */}
        {/* <div className="formWrapper"> */}
          <h1 className="mb-4">Email checker</h1>
          <Form>
            <Form.Group controlId="email">
               <Form.Label>Email address</Form.Label>
               <Form.Control value={value} size="lg" onChange={(e) => {setValidationResult(); setValue(e.target.value)}} type="email" placeholder="test@test.com" />
             </Form.Group>
            <Button variant="primary" size="lg" block disabled={isLoading} onClick={onClick}>Check email</Button>
          </Form>

          <div className="feedbackWrapper">
            { isLoading && <Spinner style={{textAlign: 'center'}} animation="border" variant="primary" size="lg"/> }

            {validationResult && (validationResult.isValid ?
              <Alert variant="success">Email is valid</Alert>
              :
              <Alert variant="danger">The email is not valid</Alert>
            )}
          </div>


        {/* </div> */}
        </Col>
        </Row>
        </Container>
  );
}

export default App;
