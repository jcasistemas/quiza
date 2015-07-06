var fs = require('fs');
var models = require("../models/models.js");

//Autoload
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
			where: {id: Number(quizId)},
			include: [{model:models.Comment}]
		}).then(function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				new Error("No existe quizId=" + quizId);
			}
		}).catch(function(error){
			next(error);
		})
};

//GET /quizes
exports.index = function(req, res){
/*	var search = req.query.search;
	search = false;
	console.log("search: "+ search);
	if(search && search != ""){
		var find = ' ';
		var re = new RegExp(find, 'g');

		var str = search.replace(re, '%');

		models.Quiz.findAll({where: ["pregunta LIKE ?", "%" + str + "%"]}).then(function(quizes){
			res.render('quizes/index.ejs', {search: search,quizes:quizes, errors: []});
		});
	}else{ */
		search = false;
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index', {search: search,quizes:quizes, errors: []});
		}); 
//	}
};

//GET /quizes/:id
exports.show = function(req, res){
	res.render("quizes/show", {quiz: req.quiz});
	/*models.Quiz.findAll().success(function(quiz){
		res.render("quizes/show", {quiz: quiz});
	});*/	
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = "Incorrecto";
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = "Correcto";
	}
	res.render("quizes/answer", {quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.new = function(req, res){
	var quiz = models.Quiz.build(//crea objeto quiz
		{pregunta:"Pregunta", respuesta: "Respuesta", tema: "Tema"}
		);
	
	res.render("quizes/new", {quiz: quiz, errors: []});
};
//POST /quizes/create
exports.create = function(req, res){
	var  quiz = models.Quiz.build(req.body.quiz);
	quiz.save({fields:["pregunta", "respuesta","tema"]}).then(function(){
					res.redirect("/quizes");
				}, function(err){
					res.render("quizes/new", {quiz:quiz, errors: err.errors});
				});
};

exports.edit = function(req, res){
	var quiz = req.quiz;//autoload de instancia de quiz
	res.render('quizes/edit', {quiz:quiz, errors:[]});
};

exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.save({fields:["pregunta", "respuesta","tema"]}).then(function(){
					res.redirect("/quizes");
				}, function(err){
					res.render("quizes/edit", {quiz:quiz, errors: err.errors});
				});
};

exports.destroy = function(req, res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

exports.author = function(req, res){
	res.render("quizes/author");	
};

exports.profileimage = function(req, res){
	console.log("profile image");
	var img = fs.readFileSync('./public/profile_image.png');
     res.writeHead(200, {'Content-Type': 'image/png' });
     res.end(img, 'binary');
};