# gamicoProject

With regards to setting up this project..

This project uses the MERN stack - MySQL, Express, ReactJS, Node

In order to test the website you'll need to...
1) Clone it into a GIT repository.
2) Set up a table on MySQL entitled users, with the required parameters. Run the MySQL server. I have attached a script to create the correct table.
3) using GIT bash or Powershell "cd" into the main folder and type npm install (which should install all dependencies locally)
4) change the app.js file such that the MySQL information matches your own.
5) npm start
6) Open a SECOND Bash terminal/Powershell in the main project, 'cd' into client.
7) in the second terminal; npm install
8) npm start
9) Navigate to localhost:3000 on your web browser (I used Firefox)
10) Use the app!

--------------------------------------------------------------
I tested it by:

1) Not filling all the fields on registration
2) trying special characters for the username
3) Filling in fields incorrectly
4) re-registering with the same information
5) logging in with a non-existent email, then an incorrect password
6) Typing a non-existent page into the URL
7) Typing /dashboard directly into the URL
8) Turning off front-end validations

I recommend you try some or all of these!
