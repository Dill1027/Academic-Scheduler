import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
    year: {
        type: String,
        required: [true, 'Year is required'],
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
    },
    moduleName: {
        type: String,
        required: [true, 'Module name is required'],
        trim: true,
        minlength: [3, 'Module name must be at least 3 characters']
    },
    description: {
        type: String,
        trim: true
    },
    schedule: [{
        day: {
            type: String,
            required: [true, 'Day is required'],
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: {
            type: String,
            required: [true, 'Start time is required']
        },
        endTime: {
            type: String,
            required: [true, 'End time is required'],
            validate: {
                validator: function(value) {
                    return value > this.startTime;
                },
                message: 'End time must be after start time'
            }
        }
    }],
    documents: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add validation for schedule array
timetableSchema.path('schedule').validate(function(schedule) {
    if (!schedule || schedule.length === 0) {
        return false;
    }
    return true;
}, 'At least one schedule entry is required');

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;