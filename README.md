# News API

This is an API built for accessing information such as news articles, topics, and users from a database. Endpoints for this project have been designed to be RESTful. There is functionality to interact with the data, such as inserting new comments into the database, and being able to up/downvote them. This functionality, as well as the error handling for it, was built upon fully integrated testing. Examples of the request methods available for each endpoint can be found within the **endpoints.json file**.

### [Hosted version: take a look!](https://news-rpsp.onrender.com)

_may take a while to warm up_

### Or to clone the repo:

**PLEASE NOTE:**

In order to run this API, you will need to have installed [**Node.js and NPM**\*](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). As PostgreSQL was used to build the database and this project uses it for testing, you will need to install [**PSQL**\*\*](https://www.postgresql.org/download/) and follow the instructions to [create a new user](https://www.postgresql.org/docs/8.0/sql-createuser.html).

\* >= V21.5.0 & V10.2.4 respectively

\*\* >= V14.10\_

**SETUP**

**1. Clone the repository & install dependencies**

To clone the repo you'll need to have a local version of [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed.

1. In your terminal, run the following:
   `git clone https://github.com/tjhind/nc-news.git`
   `cd nc-news`
   And then open the repo in your favourite code editor.

2. Run `npm install` in the terminal of your code editor. This should install all of the dependencies you need: **Express**, **pg**, **pg-format**, and **dotenv**. **supertest** and **jest** should also be installed, along with their add-ons **jest-sorted** and **jest-extended**; they are required for the integrated testing.

**2. Create .env files**

To connect to databases locally, you will have to create two .env files - one for testing called .env.test, which connects to the test database, and another called .env.development which connects to the development database. In order to set the database for each file you will have to add
`PGDATABASE={nc_news_test}` into the test file and `PGDATABASE={nc_news}` into the development file.

**3. Setting up & seeding the databases**

Run the command `npm run setup-dbs` which will set up both development and test databases. To seed the databases, run `npm run seed`.

**4. Running the server or tests**

To run the server: `npm run start`
To run the tests: `npm run test`

**Enjoy! Please feel free to share any feedback by raising an issue on github or sending me a message.**
