import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import passport from 'passport';
import passportMiddleware from './middlewares/passport';

//inicializaciones
const app = express();


//setting 
app.set('port', process.env.port || 8000);


// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(passport.initialize());
passport.use(passportMiddleware);


//rutas
app.get('/', (req, res) => {
    res.send('hola mundo');
})
 //importar las rutas
import authRoutes from './routes/auth.routes';
import specialRoute from './routes/special.routes';
//usar las rutas
app.use(authRoutes);
app.use(specialRoute);


export default app;