const mongoose = require("mongoose");

// models
let Trip = require("./../models/Trip");

module.exports = {
    getAllTrips: (req, res) => {
        let user = req.user || req.body;
        let userId = mongoose.Types.ObjectId(user._id);

        Trip.find({user_id: userId}, (err, trips) => {
            res.render("pages/trips/list", { trips: trips });
        });
    },

    getTrip: (req, res) => {
        const filters = { _id: mongoose.Types.ObjectId(req.params.id) };

        Trip.findOne(filters, (err, trip) => {
            if (!trip) return res.status(404).send("Trip not found!");
            res.render("pages/trips/details", { model: trip });
        });
    },

    duplicate: (req, res) => {
        const filters = { _id: mongoose.Types.ObjectId(req.params.id) };

        Trip.findOne(filters, (err, trip) => {
            if (!trip) {
                req.flash("success", "Could not duplicate trip: trip was not found");
                res.redirect("/api/trips");
            }

            var data = {
                startCity: trip.startCity,
                endCity: trip.endCity,
                price: trip.price,
                date: trip.date,
                description: trip.description,
                user_id: trip.user_id
            };

            Trip.create(data, (err, data) => {
                if (!err) req.flash("success", "Your trip was saved!");
                res.redirect("/api/trips");
            });
        });
    },

    saveTrip: (req, res) => {
        var data = {
            startCity: req.body.startCity,
            endCity: req.body.endCity,
            price: req.body.price,
            date: req.body.date,
            description: req.body.description,
            user_id: (req.user || {})._id
        };

        if (req.body.id) data._id = req.body.id;
        let trip = new Trip(data);

        // Validation
        var error = trip.validateSync();
        if (error && error.errors) {
            for (key in error.errors) {
                req.flash("error_message", error.errors[key].message);
            }
            return res.render("pages/trips/edit", { model: req.body.id ? trip : data });
        }

        // Update
        if (req.body.id) {
            trip.update(trip, (err, trip) => {
                if (err) {
                    req.flash("error_message", err);
                    return res.render("pages/trips/edit", { model: trip });
                }
                
                req.flash("success_message", "Your trip was saved!");
                res.redirect("/api/trips");
            });
            // Insert
        } else {
            req.flash("success_message", "Your trip was saved!");
            Trip.create(data, (err, data) => {
                if (!err) req.flash("success", "Your trip was saved!");
                res.redirect("/api/trips");
            });
        }
    },

    getEditTrip: (req, res) => {
        const filters = { _id: mongoose.Types.ObjectId(req.params.id) };

        Trip.findOne(filters, (err, trip) => {
            if (!trip) return req.error("Could not find trip");

            res.render("pages/trips/edit", { model: trip });
        });
    },

    newTrip: (req, res) => {
        res.render("pages/trips/edit", { model: {} });
    },

    deleteTrip: (req, res) => {
        const query = { _id: mongoose.Types.ObjectId(req.params.id) };

        Trip.findOne(query, (err, trip) => {
            if (trip) {
                trip.remove();
                req.flash("success_message", "Your trip was removed!");
                res.redirect("/api/trips");
            } else {
                req.flash("error_message", "Your trip was not found!");
                res.redirect("/api/trips");
            }
        });
    }
};
