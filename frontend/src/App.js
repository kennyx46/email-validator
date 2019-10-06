import React, { Component, } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';


const delay = (millis) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, millis);
    });
}

class App extends Component {

    state = {
        isLoading: false,
        email: '',
        validationResult: null,
    }

    validateEmail = async (e) => {
        // e.preventDefault();
        this.setState({ isLoading: true, validationResult: null });
        try {
            const res = await fetch('/api/validate-email', {
                method: 'POST',
                body: JSON.stringify({email: this.state.email }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const json = await res.json();
            this.setState({ isLoading: false, validationResult: json });
            console.log(json);
        } catch(e) {
            console.log('error validating email');
            this.setState({ isLoading: false, error: true });
        }
    }

    validateEmailAsync = async () => {
        this.setState({ isLoading: true, validationResult: null });
        try {
            await fetch('/api/validate-email-async', {
                method: 'POST',
                body: JSON.stringify({email: this.state.email }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // const json = await res.json();

            let isProcessed = false;
            let json;
            while (!isProcessed) {
                await delay(1000);
                const res = await fetch(`/api/validate-email?email=${this.state.email}`);
                json = await res.json();
                isProcessed = json.isProcessed;
            }
            this.setState({ isLoading: false, validationResult: json });
            console.log(json);
        } catch(e) {
            console.log('error validating email');
            this.setState({ isLoading: false, error: true });
        }
    }

    setEmailValue = (e) => {
        // e.preventDefault();
        this.setState({
            validationResult: null,
            email: e.target.value,
        });
    }

    render() {
        const { email, isLoading, validationResult } = this.state;

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
                               <Form.Control value={email} size="lg" onKeyPress={e => {e.key === 'Enter' && e.preventDefault()}} onChange={this.setEmailValue} type="email" placeholder="test@test.com" />
                            </Form.Group>
                            <Button variant="primary" size="lg" block disabled={isLoading} onClick={this.validateEmailAsync}>Check email</Button>
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
}

export default App;
