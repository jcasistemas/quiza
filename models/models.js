var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;


//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(DB_name, user, pwd,
	{dialect: protocol,
		protocol:protocol,
		port:port,
		host:host,
		storage:storage,
		omitNull: true
	})

/*var sequelize = new Sequelize(null, null, null,
		{dialect: "sqlite", storage: "quiz.sqlite"}
		);*/

//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var Comment = sequelize.import(path.join(__dirname, 'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment, {     // Relación 1 a N
  'constraints': true,      // Relacionar la pregunta con los comentarios (Actualizar/Borrar en Cascada)
  'onUpdate': 'cascade',
  'onDelete': 'cascade',
  'hooks': true 
});

exports.Quiz = Quiz; //exportar definición de tabla Quiz
exports.Comment = Comment;

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	//success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count === 0){//la tabla se inicializa solo si está vacia
			Quiz.create({pregunta: 'Capital de Portugal',
						respuesta: 'Lisboa',
						tema: "otro"
			});
			Quiz.create({pregunta: 'Capital de Italia',
						respuesta: 'Roma',
						tema: "otro"
			}).then(function(){cosole.log("Base de datos inicializada")})
		}
	});

})