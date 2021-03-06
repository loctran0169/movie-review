var config = require('../../../../config');
var response_express = require(config.library_dir+'/response').response_express;
var lib_common = require(config.library_dir+'/common');
var User = require(config.models_dir + '/mongo/user');
var Film = require(config.models_dir + '/mongo/film');

exports.get = (req, res)=>{
    let user_id = req.params.user_id

    User.findById(user_id)
    .populate('liked_film')
    .then(user=>{
        if (!user) {
            return Promise.reject("user not exist")
        }

        return response_express.success(res, user.liked_film)
    })
    .catch(err=>response_express.exception(res, err.message || err))
}

exports.like = (req, res)=>{
    let miss=lib_common.checkMissParams(res, req.body, ["film_id"])
    if (miss) return

    let user_id = req.params.user_id
    let film_id = req.body.film_id

    User.findById(user_id)
    .then(user=>{
        if (!user) {
            return Promise.reject("user not exist")
        }

        if(!user.liked_film.includes(film_id))
            user.liked_film.push(film_id);

        user.save()
        return Film.findById(film_id)
    })
    .then(film=>{
        response_express.success(res, film)
    })
    .catch(err=>response_express.exception(res, err.message || err))
}

exports.unlike = (req, res)=>{
    let miss=lib_common.checkMissParams(res, req.body, ["film_id"])
    if (miss) return

    let user_id = req.params.user_id
    let film_id = req.body.film_id

    User.findById(user_id)
    .then(user=>{
        if (!user) {
            return Promise.reject("user not exist")
        }

        user.liked_film = user.liked_film.filter(f=>f!=film_id)

        return user.save()
    })
    .then(user=>{
        response_express.success(res, user)
    })
    .catch(err=>response_express.exception(res, err.message || err))
}