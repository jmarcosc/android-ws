var express = require('express');
var load = require('express-load');
var cors = require('cors');
var port = process.env.PORT || 3000;
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcryptjs');

var app = express();
var bodyParser = require('body-parser');

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
global.db = mongoose.connect('mongodb://localhost:27017/mongo_330957');

load('models').into(app);

var User = app.models.users;
var Car = app.models.cars;

//método do serviço
app.get('/', function (request, response) {
  response.send('Servidor no ar');
});

app.post('/users', function (request, response) {
  var email = request.body.email;
  var password = request.body.password;

  var user = {
    'email': email,
    'password': password
  };

  User.create(user, function (erro, user) {
    if (erro) {
      response.json(erro);
    }
    else {
        response.json(user);
    }
  });

});

app.post('/users/login', function (request, response) {
  
  User.findOne({ email : request.body.email }).exec(function (erro, user) {
    if (erro) {
      response.json(erro);
    } else if(!user) {
      response.status(404).json({ "errorMessage" : "User does not exists!" });
    } else {
      User.findOne({ email : request.body.email, password : request.body.password }).exec(function (erro, user) {
        if(erro) {
          response.json(erro);
        } else if(!user) {
          response.status(401).json({ "errorMessage" : "Invalid password!" });
        } else {
          response.status(200).json({ "email" : user.email });
        }
      });
    }
  });

});

app.get('/cars', function (request, response) {
  Car.find(function (erro, cars) {
    if (erro) {
      response.json(erro);
    }
    else {
      response.json(cars);
    }
  });
});

app.get('/cars/:id', function (request, response) {
  var id = request.params.id;
  console.log("id encontrado: " + id);
  Car.findById(id, function (erro, car) {
    if (erro) {
      response.json(erro);
    }
    else {
      response.json(car);
    }
  });
});

app.post('/cars', function (request, response) {
  var model = request.body.model;
  var fuel = request.body.fuel;
  var engine = request.body.engine;
  var price = request.body.price;

  var car = {
    'model': model,
    'fuel': fuel,
    'engine': engine,
    'price': price
  };

  Car.create(car, function (erro, car) {
    if (erro) {
      response.json(erro);
    }
    else {
      response.json(car);
    }
  });

});
app.put('/cars/:id', function (request, response) {
  var id = request.params.id;
  console.log("id para alteracao: " + id);
  Car.findById(id, function (erro, car) {
    if (erro) {
      response.json(erro);
    }
    else {

      var car_upd = car;

      car_upd.model = request.body.model;
      car_upd.fuel = request.body.fuel;
      car_upd.engine = request.body.engine;
      car_upd.price = request.body.price;

      car_upd.save(function (erro, car) {
        if (erro) {
          response.json(erro);
        }
        else {
          response.json(car);
        }
      });
    }
  });
  

});
app.delete('/cars/:id', function (request, response) {
  var id = request.params.id;
  console.log("id para remocao: " + id);
  var car_id = ObjectId(id);
  Car.remove({ _id : car_id }, function (erro, car) {
    if (erro) {
      response.json(erro);
    }
    else {
      response.send('removido');
    }
  });
});



app.listen(port, function () {
  console.log('ok');
});
