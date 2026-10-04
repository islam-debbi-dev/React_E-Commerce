# E-Commerce Website

A Ecommerce Website made with React.js Framework.


## Demo

https://reactjs-ecommerce-app.vercel.app/

## Features

- Easy to integrate with Backend
- Fully Responsive


## Screenshots

![App Screenshot](https://i.ibb.co/fQ293tm/image.png)



## Run Locally

Clone the project

```bash
  git clone https://github.com/ssahibsingh/React_E-Commerce
```

Go to the project directory

```bash
  cd React_E-Commerce
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```



## Backend

The shop talks to the API in [`backend/`](backend/README.md) (Express + MongoDB + Cloudinary).
Start it before `npm start`, then seed the database once:

```bash
  cd backend
  npm install
  cp .env.example .env
  npm run seed
  npm run dev      # http://localhost:5001/api
```

`npm start` proxies `/api` to `http://localhost:5001`, so no frontend config is needed in
development. Orders placed at checkout are saved in MongoDB, pushed to Telegram through a bot
and handed to WhatsApp as a pre-filled message.



## Tech Stack

* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Bootstrap](https://getbootstrap.com/)
* [Express](https://expressjs.com/) + [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
* [Cloudinary](https://cloudinary.com/) for product images
* [DummyJSON](https://dummyjson.com/) as the seed catalogue

## Contributing

Contributions are always welcome!
Just raise an issue, we will discuss it.


## Feedback

If you have any feedback, please reach out to me [here](https://ssahibsingh.github.io/#contact)


