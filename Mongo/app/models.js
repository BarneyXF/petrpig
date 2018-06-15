var mongoose = require('mongoose');

var PigSchema = mongoose.Schema(
{
    Name: 
    {
        type: String, 
        required: [true, "Name of element of 5th column reqired!"]
    },
    DateOfBirth: 
    {
        type: Date, 
        required: [true, "Every pig has date of birth, so please let us know it."]
    },
    PlaceOfBirth: 
    {
        type: String,
        reqired: [true, "Where does pig born? Big brother must know."]
    },
    ListOfActives: 
    [
        {
            Type: 
            {
                type: String, 
                enum: ["Bitcoins", "Rubles"]
            },
            Value: 
            {
                type: Number,
                default: 0,
                min: 0
            }
        }
    ],
    PlaceOfLiving: 
    {
        type: String,
        reqired: [true, "You can mark your tractor as place of living."]
    }
});

var ProfileSchema = mongoose.Schema(
{
    Pig: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pig",
        reqired: [true, "Profile without pig? Originally, but it won't work.('Pig' not filled)"]
    },
    Reason:
    {
        type: String,
        reqired: [true, "If you have no reasons for leave, then stay here.('Reason' not filled)"]
    }, 
    Destination:
    {
        type: String,
        reqired: [true, "'Destination unknown - tu tu du du' - that's song, and you must tell us where do you go.('Destination' not filled)"]
    },
    DateOfLeaving:
    {
        type: Date
    },
    DateOfReturning:
    {
        type: Date,
        reqired: [false, "We're looking forward to see you and your nologi again."]
    },
    SecondCitizenship:
    {
        type: Boolean,
        reqired: [true, "Can you be nice and try not to get it?^^(Fill 'SecondCitizenship' field with 'FALSE' 'FALSE' 'FALSE'...)"]
    },
    HaveExitPermit:
    {
        type: Boolean,
        reqired:[true, "Hey, you must fill it.('HaveExitPermit' not filled)"]
    }
});

var Pig = mongoose.model('Pig', PigSchema);
var Profile = mongoose.model('Profile', ProfileSchema);

module.exports = {
    Pig: Pig,
    Profile: Profile
}