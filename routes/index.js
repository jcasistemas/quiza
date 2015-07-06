var express = require('express');
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' ,errors: []});
});

router.param('quizId', quizController.load); //autoload: quizId
router.param('commentId', commentController.load);//autoload commentId

//Definicion de rutas de sesion
router.get('/login', sessionController.new);//login
router.post('/login', sessionController.create);//create session
router.get('/logout', sessionController.destroy);//delete session

router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',sessionController.loginRequired,  commentController.publish);

/*router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);*/
router.get('/quizes/author', quizController.author);
router.get('/quizes/profileimage', quizController.profileimage);
module.exports = router;
