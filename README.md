# Northcoders News API

Welcome to my News API!

This is an API built for the purpose of accessing information that would be useful on a news application such as Reddit which can be provided to front-end architecture.

Database is PSQL and I interact with it using node-postgres.

Here is a link to the hosted version: https://news-rpsp.onrender.com (this URL is equal to the "/" endpoint)

**SETUP**

Firstly you will need to clone this repository

**CREATING .ENV FILES**

To connect to databases locally, you will have to create two .env files - one for testing called .env.test, which connects to the test database, and another called .env.development which connects to the development database. In order to set the database for each file you will have to add PGDATABASE={insert database name here} with the appropriate database name for that environment (see /db/setup.sql for database names).

**PLEASE NOTE:**

In order to run this API, you will need to have installed Node.js (minimum version V21.5.0) and PostgreSQL (minimum version V14.10)
