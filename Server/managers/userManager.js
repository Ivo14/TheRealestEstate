const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Estate = require('../models/Estate');
const Rent = require('../models/Rent');

exports.register = async (userdata) => {
    if(await User.findOne({email: userdata.email})){
        throw new Error('Email is already a member!');
    }

    const user = await User.create(userdata);

    const result = getAuthResult(user);

    return result;
}

exports.login = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid username or password!');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid username or password!');
    }

    const result = getAuthResult(user);

    return result;
}

exports.addListingId = async (estateId, userId) => {
    return User.findByIdAndUpdate(userId, {$push: { listings: estateId}});
}

exports.returnListings = async (userId) => {
    const user = await User.findById(userId);
    let listings = [];

    for(let id of user.listings) {
        const rent = await Rent.findById(id);
        const estate = await Estate.findById(id);

        if(rent) {
            listings.push(rent);
        } else if(estate) {
            listings.push(estate);
        }
    }

    return listings;
}

function getAuthResult(user) {
    const payload = {
        _id: user._id,
        email: user.email,
    }

    // synchronous variant
    const token = jwt.sign(payload, 'SECRET', {expiresIn: '2d'});

    const result = {
        _id: user._id,
        email: user.email,
        accessToken: token,
    }

    return result;
}