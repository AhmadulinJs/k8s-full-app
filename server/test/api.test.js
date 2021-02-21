const chai = require('chai');
const app = require('../server')
const chaiHttpSwagger = require('chai-http-swagger');

const { expect } = chai;
const should = chai.should();

const todoHost = '/todos';

chai.use(chaiHttpSwagger.httpClient);

describe('Tests Todo APIs', () => {

  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      chaiHttpSwagger.skipFailedTests(this.currentTest.title);
    }
  });

  it('Should create a todo', function(done) {
    const requestObject = {
      todo_description: 'test',
      todo_priority: 'low',
      todo_completed: false
    }
    chai.hr({
      app,
      description: this.test.title,
      path: `${todoHost}/`,
      method: 'post',
      body: {
        json: requestObject
      }
    })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.a('Object');
        done();
      });
  });

  it('Should list a todo', function(done) {
    
    chai.hr({
      app,
      description: this.test.title,
      path: `${todoHost}/`,
      method: 'get',
    })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.a('Object');
        done();
      });
  });
});
