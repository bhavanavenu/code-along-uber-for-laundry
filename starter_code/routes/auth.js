const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();


router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

router.post('/signup', (req, res, next) => {
    const nameInput = req.body.name;
    const emailInput = req.body.email;
    const passwordInput = req.body.password;
  
    if (emailInput === '' || passwordInput === '') {
      res.render('auth/signup', {
        errorMessage: 'Enter both email and password to sign up.'
      });
      return;
    }
  
    User.findOne({ email: emailInput }, '_id', (err, existingUser) => {
      if (err) {
        next(err);
        return;
      }
  
      if (existingUser !== null) {
        res.render('auth/signup', {
          errorMessage: `The email ${emailInput} is already in use.`
        });
        return;
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPass = bcrypt.hashSync(passwordInput, salt);
  
      const userSubmission = {
        name: nameInput,
        email: emailInput,
        password: hashedPass
      };
  
      const theUser = new User(userSubmission);
  
      theUser.save((err) => {
        if (err) {
          res.render('auth/signup', {
            errorMessage: 'Something went wrong. Try again later.'
          });
          return;
        }
  
        res.redirect('/');
      });
    });
  });

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'never do your own laundry again',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUserInfo = req.session.currentUser;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }

  next();
});

app.use('/', index);

router.get('/logout', (req, res, next) => {
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }
  
    req.session.destroy((err) => {
      if (err) {
        next(err);
        return;
      }
  
      res.redirect('/');
    });
  });
  

module.exports = router;