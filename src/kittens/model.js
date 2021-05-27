const mongoose = require('mongoose');
const log = require('@talkbox/backend-util-logger');

const breeds = [
    "Abyssinian",
    "Bombay",
    "Shorthair"
];

const schema = new mongoose.Schema({
    name: String,
    nameLower: {
        type: String,
        index: true
    },
    chipNumber: {
        type: String,
        index: { unique: true }
    },
    breed: {
        type: String,
        enum: breeds
    },
    createDate: Number,
    lastUpdate: Number,
});

const Kitten = mongoose.model('Kitten', schema);

/**
 * create function, translate API request object to database object
 *
 * @param apiObject API request object
 * @param user user who called the create API
 * @returns {Promise<T>}
 */
const createDo = (apiObject, user) => {
    const data = {
        name: apiObject.name,
        nameLower: apiObject.name.toLowerCase(),
        breed: apiObject.breed || "Abyssinian",
        chipNumber: apiObject.chipNumber,
    };

    const now = new Date().getTime();
    data.createDate = now;
    data.lastUpdate = now;

    return new Kitten(data).save()
        .then(result => {
            if (result) log.info("kitten", "create|"+result._id+"|"+user._id);
            return result;
        });
};

/**
 * update function, update according to API request object
 *
 * @param id ID of object
 * @param input API request object
 * @param user user who called the create API
 * @returns {*}
 */
const updateDo = (id, input, user) => {
    const data = {};
    if (input.name) {
        data.name = input.name;
        data.nameLower = input.name.toLowerCase();
    }
    if (input.breed) data.breed = input.breed;
    if (input.chipNumber) data.chipNumber = input.chipNumber;
    data.lastUpdate = new Date().getTime();

    return Kitten.findOneAndUpdate({ _id: id }, data, {new: true})
        .then(result => {
            if (result) log.info("kitten", "update|"+result._id+"|"+user._id);
            return result;
        });
};

/**
 * delete function
 *
 * @param id ID of object
 * @param user user who called the create API
 * @returns {*}
 */
const deleteDo = (id, user) => {
    return Kitten.findByIdAndDelete(id)
        .then(result => {
            if (result) log.info("kitten", "delete|"+result._id+"|"+user._id);
            return result;
        });
};

module.exports = {
    breeds: breeds,
    get: (id) => Kitten.findById(id),
    list: () => Kitten.find(),
    search: (text) => Kitten.find({ nameLower: {$regex: text.toLowerCase()} }),
    getByChipNumber: (chipNumber) => Kitten.findOne({ chipNumber: chipNumber }),
    create: createDo,
    delete: deleteDo,
    update: updateDo,
};
