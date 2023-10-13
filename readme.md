# HOW TO RUN
- First of all clone the repository

- Open the terminal in the current folder

- Type the command `npm i` to install all the dependencies

## EDIT THE ENVIRONMENT VARIABLE
 Open `.env` file and put the required Data
* DB_STRING - (mongodb URI)
* JWT_ACCESS_TOKEN - jsonwebtoken secret string
* ALLOWED_ORIGIN - (allowed cors origins if your are working with a front end client (can be either one string origin or an array of origin separated with ", "))


## RUN THE SERVER

start your mongodb server and run `npm run dev` in your command line

## TECH STASK USED:
  - expressjs for server
  - jsonwebtoken for tocken generator
  - mongodb for databases
  
#### ||PS||:
please include jwt tocken in authorization header with Bearer prefix
e.g. (Bearer jsonWebToken)