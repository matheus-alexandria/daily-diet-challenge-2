# Daily Diet API

The second challenge for the Ignite Backend NodeJS. In this project I will create an API to supply the needed data for the following app:
<a href='https://www.figma.com/community/file/1218573349379609244'>Figma Daily Diet</a>

This is an API for an daily diet app, where you can keep track of your daily meals and if they are a part of your diet or not.
To start using the API you can start cloning this rep and running:
```
npm install
```
Create your .env file following the example

Then run the docker-compose file to create the PostgreSQL database:
```
docker-compose up -d
```

Finally run the prisma command to build your database:
database:
```
npx prisma migrate dev
```

With all this set up you will be able to test and use this API to build your own Daily Diet application.