import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import authRoutes from './router/route.js';
import postRoutes from './router/postRoute.js';
import itiRoutes from './router/itineraryRoute.js'
import multer from 'multer';
import bodyParser from 'body-parser';
const upload = multer({ dest: 'uploads/' })

const app = express();

/** middlewares */
app.use(express.json({
    limit:'100mb'
}));

// Configure CORS to allow requests from http://localhost:3000
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))
app.use('/posts/uploads', express.static('uploads'))

const port = 8080;

/** HTTP GET Request */
app.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

/** api routes */
app.use('/api', authRoutes);  
app.use('/api', postRoutes);  
app.use('/api', itiRoutes);  


/** start server only when we have a valid connection */
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log('Cannot connect to the server');
    }
  })
  .catch(error => {
    console.log("Invalid database connection...!");
  });
