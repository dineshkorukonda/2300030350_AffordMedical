# AffordMedical

- logging_middleware/ - log function for evaluation server
- notification_app_be/ - stage 1

## stage 1

Priority inbox - gets notifications from api and prints top 10 important ones.

Priority order is Placement > Result > Event. If same type, newer one comes first.

### how to run

npm install
node notification_app_be/app.js


Need EVALUATION_TOKEN=your_token in .env file at root.

