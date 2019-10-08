import React, { Component, } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

import api from './services/api';

class App extends Component {

    state = {
        isLoading: false,
        email: '',
        validationResult: null,
        error: '',
    }

    validateEmailAsync = async () => {
        this.setState({ isLoading: true, validationResult: null, error: '' });
        try {
            const validationResult = await api.validateEmailAsync(this.state.email);
            this.setState({ isLoading: false, validationResult });
        } catch(error) {
            this.setState({ isLoading: false, error: error.message || 'Error checking email, please try again later' });
        }
    }

    setEmailValue = (e) => {
        this.setState({
            validationResult: null,
            error: '',
            email: e.target.value,
        });
    }

    render() {
        const { email, isLoading, validationResult, error } = this.state;

        return (
            <Container className="appContainer">
                <Row>
                    <Col xs={12} md={12} lg={12} >
                        <h1 className="mb-4">Email checker</h1>
                        <Form>
                            <Form.Group controlId="email">
                               <Form.Label>Email address</Form.Label>
                               <Form.Control value={email} size="lg"
                                    onKeyPress={e => {e.key === 'Enter' && e.preventDefault()}}
                                    onChange={this.setEmailValue} type="email" placeholder="test@test.com" />
                            </Form.Group>
                            <Button variant="primary" size="lg" block disabled={email.length === 0 || isLoading} onClick={this.validateEmailAsync}>
                                Check email
                            </Button>
                        </Form>

                        <div className="feedbackWrapper">
                            { isLoading && <Spinner className="text-center" animation="border" variant="primary" size="lg"/> }

                            { !isLoading && <p>Please enter email in the field and press `check email` button</p> }

                            { error &&
                                <Alert variant="danger">{error}</Alert>
                            }

                            {validationResult && (validationResult.isValid ?
                                <Alert variant="success">Email is valid</Alert>
                                :
                                <Alert variant="danger">The email is not valid</Alert>
                            )}

                            {validationResult && validationResult.confidence &&
                                (<Button variant="secondary" disabled>
                                  Confidence <Badge variant="light">{`${validationResult.confidence * 100}%`}</Badge>
                                </Button>)
                            }

                        </div>
                        <h2>Verification steps:</h2>
                        <ListGroup >
                            <ListGroup.Item>1. Format check</ListGroup.Item>
                            <ListGroup.Item>2. Domain check</ListGroup.Item>
                            <ListGroup.Item>3. SMTP check</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;
