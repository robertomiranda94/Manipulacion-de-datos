const { where } = require('sequelize');
const db = require('../database/models');
const sequelize = db.sequelize;
const { validationResult } = require('express-validator');
const moment = require('moment')


const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie, moment: moment })
            }).catch(error => console.log(error));
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    }, //Trabaja con el CRUD
    add: function (req, res) {
        return res.render('moviesAdd')
    },
    create: function (req, res) {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            const { title, rating, awards, release_date, length } = req.body;
            db.Movie.create({
                title: title.trim(),
                rating,
                awards,
                release_date,
                length
            }).then(() => { return res.redirect('/movies') })
        } else {
            return res.render('moviesAdd', {
                errores: errors.mapped(),
                old: req.body
            })
        }
    },
    edit: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie => res.render("moviesEdit", { Movie, releaseDate: moment(Movie.release_date).format('YYYY-MM-DD') }))
            .catch(error => console.log(error))
    },
    update: function (req, res) {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            const { title, rating, awards, release_date, length } = req.body;
            db.Movie.update({
                title: title.trim(),
                rating,
                awards,
                release_date,
                length
            },
                { where: { id: req.params.id } })
                .then(() => { return res.redirect('/movies') })
                .catch(error => console.log(error))
        } else {
            return res.render('moviesEdit', {
                errores: errors.mapped(),
                old: req.body
            })
        }


    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie => res.render('moviesDelete', { Movie }))
            .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(() => { return res.redirect('/movies') })
            .catch(error => console.log(error))
    }

}

module.exports = moviesController;