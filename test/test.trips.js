/* const mongoose = require("mongoose");
const Trip = require("../models/Trip.js");
const expect = require('chai').expect;
const tripId = mongoose.Types.ObjectId(100);
let db;

describe("Trips", function () {
    before(function (done) {
        db = mongoose.connect("mongodb://localhost:27017/local_test", {
            useNewUrlParser: true
        });
        done();
    });

    after(function (done) {
        mongoose.connection.close();
        done();
    });

    beforeEach(function (done) {
        let trip = new Trip({
            user_id: mongoose.Types.ObjectId(1),
            startCity: 'paris',
            endCity: 'end',
            price: '1000',
            date: '12/12/2018',
            description: 'test',
        });

        trip.save(function (error) {
            if (error) {
                console.log("error" + error.message);
            } else {
                console.log("no error");
            }
            done();
        });
    });

    it("get list of trips", function (done) {
        Trip.find({}, function (err, trips) {
            expect(trips.length).to.equal(1);
            done();
        });
    });

    it("get trip by city", function (done) {
        Trip.findOne({
            startCity: 'paris'
        }, function (err, trip) {
            expect(trip.price).to.equal(1000);
            done();
        });
    });

    it("get trip by city not found", function (done) {
        Trip.findOne({
            startCity: 'paris1'
        }, function (err, trip) {
            expect(trip).to.be.null;
            done();
        });
    });


    afterEach(function (done) {
        Trip.remove({}, function () {
            done();
        });
    });
}); */