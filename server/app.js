import  createError  from 'http-errors';
import  express  from 'express';
import  path  from 'path';
import  cookieParser  from 'cookie-parser';
import  logger  from 'morgan';
import  dotenv  from 'dotenv';
import  mongoose  from 'mongoose';
dotenv.config()

import  indexRouter  from './routes/index';
import  usersRouter  from './routes/users';

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('MongoDb connected')
})
.catch((err)=>{
    console.log(err)
})



app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
