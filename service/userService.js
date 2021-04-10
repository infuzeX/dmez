const { User }  = require('../model/registerModel');
const ApiFeatures = require('../utils/apifeatures');

exports.register = async (data) => await User.create(data);

exports.fetchUser = async (user, query) => {
    const feature = new ApiFeatures(User.findOne(user), query)
        .filterRestrictFields('password')
        .limitFields();
    return await feature.query;
}

exports.getUserPassword = async (query) => await User.findOne(query, { 'password': 1 });

exports.updateUser = async (query, data) => await User.updateOne(query, data, { runValidators: true });