# AffordMedical 

`logging_middleware/` -> loggind_middleware

`notification_app_be/` -> Stage 1 — CLI script that prints top priority notifications 

`notification_app_fe/` -> Stage 2 — Next.js app with Material UI (runs on port 3000) 



## Stage 1 — Backend (priority inbox)

npm install

node notification_app_be/app.js

EVALUATION_TOKEN=your_token_here is needed for the api to work at .env

Prints the top 10 unread notifications to the terminal using the evaluation notifications API.

## Stage 2 — Frontend (Next.js)

From `notification_app_fe/`:


npm install

npm run dev

EVALUATION_TOKEN=your_token_here is needed for the api to fetch and show data in frontend at .env.local

open (http://localhost:3000).

`/` -> All notifications — new vs read 

`/priority` -> Top N unread by priority, with type filter 

`/notificationUtils.js` -> modular helper between the pages to display the logic and store the read is and mui theme


