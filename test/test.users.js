/* let mongoose = require("mongoose");
let User = require("../models/User.js");
const expect = require('chai').expect;
const sinon = require('sinon');

let db;

describe("User", function() {
    before(function(done) {
        db = mongoose.connect("mongodb://localhost:27017/local_test",  { useNewUrlParser: true });
        done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    beforeEach(function(done) {
        var account = new User({
            username: "test",
            password: "123345",
            email: "test@gmail.com"
        });

        account.save(function(error) {
            if (error) {
                console.log("error" + error.message);
            } else { 
                console.log("no error");
            }
            done();
        });
    });

    it("find a user by username", function(done) {
        User.findOne({ username: "test" }, function(err, account) {
            expect(account.username).to.equal('test');
            done();
        });
    });

    it('user not found', () => {
        User.findOne({username: 'smith'}, (err, account) => {
            expect(account).to.be.null;
        })
    });

    it('user not found', () => {
        User.findOne({username: 'text'}, (err, user) => {
            expect(user).to.be.null;
        })
    });


    afterEach(function(done) {
        User.remove({}, function() {
            done();
        });
    });
});  */