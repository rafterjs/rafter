import mongoose, {Schema} from 'mongoose';

const userSchema = new Schema(
    {
        first_name: String,
        last_name: String,
        email: String,
    },
    {
        collection: 'users'
    }
);

userSchema.index({email: 1}, {unique: true});

/**
 * @returns {String}
 */
userSchema.methods.getId = function() {
    return this._id;
};

/**
 * @returns {String}
 */
userSchema.methods.getFirstName = function() {
    return this.first_name;
};

/**
 * @param {String} firstName
 * @return {mongoose.Schema.methods}
 */
userSchema.methods.setFirstName = function(firstName) {
    this.first_name = firstName;
    return this;
};

/**
 * @returns {String}
 */
userSchema.methods.getLastName = function() {
    return this.last_name;
};

/**
 * @param {String} lastName
 * @return {mongoose.Schema.methods}
 */
userSchema.methods.setLastName = function(lastName) {
    this.last_name = lastName;
    return this;
};

/**
 * @returns {String}
 */
userSchema.methods.getEmail = function() {
    return this.email;
};

/**
 * @param {String} email
 * @return {mongoose.Schema.methods}
 */
userSchema.methods.setEmail = function(email) {
    this.email = email;
    return this;
};

/**
 * TODO move this to a dynamic factory / provider that takes a connection as a dependency
 */
class UserModel {
    constructor() {
        return mongoose.model('user', userSchema);
    }
}

export default new UserModel();
