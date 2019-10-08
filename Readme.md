# Email validation service 
[Heroku link to the deployed service](https://shrouded-thicket-15123.herokuapp.com)

Provides a way to check email validity.

## High level desciption
The process includes few steps:
1. Validating email format with official standard email regexp.
2. Autodiscovery of email domain.
3. SMTP connection to the server and attempt to simulate sending an email to email box under validation.

There are 2 ways to receive the response from the service:
* synchronous
* asynchronous (creating email validation job and polling for the results). **This is the preferred way as all the checks can take a lot of time**.

The service can be used either with the accompanying UI or as an API.

## Technical decisions
**Backend**
* Service uses layered architecture, separating routes, handlers, services and data access layer
* Postgres database, sequelize orm and migrations for storing the validation reults in case of asynchronous check
* RabbitMQ as a queue for async processing the email validation 
* PM2 as a node manager for deploying node app and worker
* Heroku as a platform for deploying the service

**Frontend**
* React as a UI library
* Bootstrap css for styling

 Note: in case of async validation the emails are considered valid one hour after initiating the job.

## Further improvements
* Add bulk email checks possibility
* Add cron job to remove old emails in one hour
* Increase test coverage
* Add more extended error handling
* Improve logging and add statsd client
* Add Swagger documentation
* Improve error handling
* Add attempts logic

## API
##### POST /validate-email
Request Body
```
{
    "email": "myemail@example.com"
}
```

Response
```
{
    "isValid": true|false,
    "confidence": 0..1
}
```


##### POST /validate-email-async
Request Body
```
{
    "email": "myemail@example.com"
}
```

Response
```
{
    "inProgress": true|false,
    "jobId": 1
}
```

##### GET /validate-email
Query params
```
?email=myemail@example.com
```

Response
```
{
    "isValid": true|false,
    "confidence": 0..1,
    "isProcessed": true|false
}
```
