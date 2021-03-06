var lib = require('../own_modules/school_records');
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/school.db.backup');

var school_records;
describe('school_records',function(){
	beforeEach(function(){
		fs.writeFileSync('tests/data/school.db',dbFileData);
		school_records = lib.init('tests/data/school.db');
	});
	
	describe('#getGrades',function(){
		it('retrieves 2 grades',function(done){
			school_records.getGrades(function(err,grades){
				assert.deepEqual(grades,[{id:1,name:'1st std'},{id:2,name:'2nd std'}]);
				done();
			})
		})
	})

	describe('#getStudentsByGrade',function(){
		it('retrieves the students in the 2 grades',function(done){
			school_records.getStudentsByGrade(function(err,grades){
				assert.lengthOf(grades,2);
				assert.lengthOf(grades[0].students,4);
				assert.lengthOf(grades[1].students,3);
				done();
			})
		})
	})

	describe('#getSubjectsByGrade',function(){
		it('retrieves the subjects in the 2 grades',function(done){
			school_records.getSubjectsByGrade(function(err,grades){
				assert.lengthOf(grades,2);
				assert.lengthOf(grades[0].subjects,3);
				assert.lengthOf(grades[1].subjects,0);
				done();
			})
		})
	})

	describe('#getStudentSummary',function(){
		it('retrieves the summary of the student Abu',function(done){
			school_records.getStudentSummary(1, function(err,s){
				assert.equal(s.name,'Abu');
				assert.equal(s.grade_name,'1st std');
				assert.deepEqual(s.subjects,[{id:1,name:'English-1',score:75,maxScore:100},
					{id:2,name:'Maths-1',score:50,maxScore:100},
					{id:3,name:'Moral Science',score:25,maxScore:50}]);
				done();
			})
		})

		it('retrieves nothing of the non existent student',function(done){
			school_records.getStudentSummary(9, function(err,s){
				assert.notOk(err);
				assert.notOk(s);				
				done();
			})
		})
	})
	describe('#getGradeSummary',function(){
		it('retrieves the summary of grade 1',function(done){
			school_records.getGradeSummary(1,function(err,grade){
				assert.notOk(err);
				assert.equal(grade.name,'1st std');
				assert.deepEqual(grade.subjects,[{id:1,name:'English-1'},
					{id:2,name:'Maths-1'},
					{id:3,name:'Moral Science'}]);
				assert.deepEqual(grade.students,[{id:1,name:'Abu'},
					{id:2,name:'Babu'},
					{id:3,name:'Kabu'},
					{id:4,name:'Dabu'}]);
				assert.equal(grade.id,1);
				done();
			})
		})
	})

	describe('#getSubjectSummary',function(){
		it('retrieves the summary of subject 1',function(done){
			school_records.getSubjectSummary(1,function(err,subject){
				assert.notOk(err);
				assert.equal(subject[0].subject_name,'English-1');
				assert.deepEqual(subject, [{ subject_id: 1,
 						 subject_name: 'English-1',
 						 maxScore: 100,
 						 grade_id: 1,
 						 grade_name: '1st std',
 						 student_name: 'Abu',
 						 student_id: 1,
 						 score: 75 }]);
				done();
			})
		})
	})

	describe('#updateGrade',function(){
		it('update the grade_name from 1st std to class 1',function(done){
			school_records.updateGrade(["1st std","class 1"],function(err){
				assert.notOk(err);
			school_records.getGradeSummary(1,function(err,grade){
				assert.equal(grade.name,'class 1');
				done();
			})

			})
		})
	})
	describe('#updateStudentName',function(){
		it('update the StudentName from Abu to badbu',function(done){
			school_records.updateStudentName(["Abu","badbu"],function(err){
				assert.notOk(err);
			school_records.getStudentSummary(1, function(err,st_details){				
				assert.equal(st_details.name,'badbu');
				done();
			})

			})
		})
	})

	describe('#updateStudentGrade',function(){
		it('update the StudentGrade of Abu from 1 to 2',function(done){
			school_records.updateStudentGrade(["1","2"],function(err){
				assert.notOk(err);
				school_records.getStudentSummary(1, function(err,st_details){				
					assert.equal(st_details.grade_id,2);
				done();
			})
			})
		})
	})
	describe('#updateStudentScore',function(){
		it('update the StudentScore of Abu in English-1 from 75 to 80',function(done){
			school_records.updateStudentScore([1,1,80],function(err){
				assert.notOk(err);
				school_records.getStudentSummary(1, function(err,st_details){
					assert.equal(st_details.subjects[0].score,80);
				done();
				})
			})
		})
	})
	describe('#updateSubjectName',function(){
		it('update the subject name from cricket to kabbadi',function(done){
			school_records.updateSubjectName({subjectToChange:"kabbadi",id:1},function(err){
				assert.notOk(err);
				school_records.getSubjectSummary(1, function(err,su_details){
					assert.equal(su_details[0].subject_name,'kabbadi');
					done();
				})
			})
		})
	})
	describe('#updateSubjectMaxScore',function(){
		it('update the English-1 MaxScore from 100 to 150',function(done){
			school_records.updateSubjectName({subjectToChange:150,nameForChange:"English-1"},function(err){
				assert.notOk(err);
				school_records.getSubjectSummary(1, function(err,su_details){
					assert.equal(su_details[0].maxScore,150);
					done();
				})
			})
		})
	})
	describe('#addNewStudent',function(){
		it('add new student from student summary page',function(done){
			school_records.addStudent({studentName:"Heera",gradeId:1},function(err){
				assert.notOk(err);
				school_records.getStudentSummary(8, function(err,su_details){
					assert.equal(su_details.name,"Heera");
					done();
				})
			})
		})
	})
	
	describe('#addStudentSubject',function(){
		it('add subject of student from student summary page',function(done){
			school_records.addSubject({gradeId:1,subjectName:"TT",maxScore:75},function(err){
				assert.notOk(err);
				school_records.getSubjectsByGrade(function(err,sub_details){
					assert.equal(sub_details[0].subjects[3].name,"TT");
					assert.equal(sub_details[0].subjects[3].maxScore,75);
					done();
				})
			})
		})
	})


})