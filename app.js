 var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var school_records = require('./own_modules/school_records').init('./data/school.db');
var app = express();
var school_routes = require('./own_modules/school_routes');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/grades',school_routes.get_grades);
app.get('/students',school_routes.get_students);
app.get('/subjects',school_routes.get_subjects);
app.get('/students/:id',school_routes.get_student);
app.get('/grades/:id',school_routes.get_grade_summary);
app.get('/subject/:id',school_routes.get_subject_summary);
app.get('/updateGrade/:grade',school_routes.update_garde);
app.get('/updateStudentName/:name',school_routes.update_student_name);
app.get('/updateStudentGrade/:id',school_routes.update_student_grade);
app.get('/updateStudentScore/:id',school_routes.update_student_score);
app.get('/updateSubjectName/:id',school_routes.update_subject_name);
app.get('/updateSubjectMaxScore/:name',school_routes.update_subject_name);
app.get('/addStudent/:name',school_routes.add_new_student);
app.get('/addStudentData',school_routes.add_student);
app.get('/addSubject/:id',school_routes.add_new_subjects);
app.get('/addSubjectData',school_routes.add_subject);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
