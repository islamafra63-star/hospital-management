const express = require("express");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({
        message: "Hospital Backend is Running"
    });
});
let users = [];

const appointmentSchema = new mongoose.Schema({
    id: Number,
    serial: Number,
    name: String,
    email: String,
    ownerEmail: String,
    phone: String,
    doctor: String,
    date: String,
    status: String
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
// Sign Up
app.post("/signup", (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    // Check empty fields
    if (name === "" || email === "" || phone === "" || password === "") {

        return res.json({
            success: false,
            message: "All fields are required"
        });

    }

    // Check password length
    if (password.length < 6) {

        return res.json({
            success: false,
            message: "Password must be at least 6 characters"
        });

    }

    // Save user
    users.push({
        name: name,
        email: email,
        phone: phone,
        password: password
    });

    // Success
    res.json({
        success: true,
        message: "Sign Up successful",
        user: {
            name: name,
            email: email,
            phone: phone
        }
    });

});


// Sign In
app.post("/signin", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    // Check empty fields
    if (email === "" || password === "") {

        return res.json({
            success: false,
            message: "Email and password are required"
        });

    }
    // Find user
    const user = users.find(function(u) {
        return u.email === email;
    });

    // User not found
    if (!user) {

        return res.json({
            success: false,
            message: "User not found"
        });

    }

    // Check password
    if (user.password !== password) {

        return res.json({
            success: false,
            message: "Incorrect password"
        });

    }

    // Sign In successful
    res.json({
        success: true,
        message: "Sign In successful",
        user: {
            name: user.name,
            email: user.email,
            phone: user.phone
        }
    });

});
// Doctor Details

app.get("/doctor/:id", (req, res) => {

    const id = req.params.id;

    // Doctor 1
    if (id === "1") {

        return res.json({
            success: true,
            name: "Dr. Iqbal Mahmud",
            degrees: "MBBS, BCS (Health), MD (Cardiology), FESC, FAPSIC",
            specialty: "Clinical & Interventional Cardiology, Pediatric Cardiology",
            training: "Fellowship in Interventional Cardiology",
            hospital: "Parkview Hospital Limited, Chittagong",
            room: "325",
            visitingHours: "7:00 PM - 9:00 PM",
            days: "Saturday - Thursday",
            closed: "Friday"
        });

    }

    // Doctor 2
    if (id === "2") {

        return res.json({
            success: true,
            name: "Dr. K. Khin U (Chow Chow)",
            degrees: "MBBS, BCS (Health), FCPS (ENT)",
            specialty: "ENT & Head-Neck Surgery",
            training: "Micro Ear Surgery and Endoscopic Sinus Surgery",
            position: "Associate Professor, Department of ENT",
            hospital: "Epic Health Care Ltd., Chattogram",
            visitingHours: "6:00 PM - 10:00 PM",
            offDays: "Thursday and Friday"
        });

    }

    // Doctor 3
           if (id === "3") {
    return res.json({
        success: true,
        name: "Prof. Dr. Alvin Saha",
        degrees: "MBBS (CU), DD (Bangkok & Japan), SLRTC (India)",
        specialty: "Skin, Allergy, Leprosy & Sexual Diseases",
        training: "Dermatology and Venereology",
        position: "Professor & Head, Department of Dermatology & Venereology",
        hospital: "Metro Diagnostic Center, Chittagong",
        address: "Metro Tower, Goal Pahar Mor, Mehedibag, Chattogram",
        room: "Ground floor",
        closed: "Friday",
        days: "Saturday to Thursday",
        visitingHours: "5:00 PM - 8:00 PM"
    });
}

    // Doctor not found
    res.json({
        success: false,
        message: "Doctor not found"
    });

});
// Appointment

app.post("/appointment", async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const doctor = req.body.doctor;
    const date = req.body.date;

    if (name === "" || email === "" || phone === "" || doctor === "" || date === "") {
        return res.json({
            success: false,
            message: "All fields are required"
        });
    }

    try {

        const doctorAppointments = await Appointment.find({
            doctor: doctor,
            date: date
        });

        const serial = doctorAppointments.length + 1;

        const appointment = new Appointment({
            id: Date.now(),
            serial: serial,
            name: name,
            email: email,
            ownerEmail:email,
            phone: phone,
            doctor: doctor,
            date: date,
            status: "Confirmed"
        });

        await appointment.save();

        res.json({
            success: true,
            message: "Appointment booked successfully",
            serial: serial
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Failed to book appointment"
        });

    }

});

// Update Appointment
app.put("/appointment/:id", async (req, res) => {

    const id = Number(req.params.id);

    try {

        const appointment = await Appointment.findOne({ id: id });

        if (!appointment) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        appointment.name = req.body.name;
        appointment.email = req.body.email;
        appointment.phone = req.body.phone;
        appointment.doctor = req.body.doctor;
        appointment.date = req.body.date;

        await appointment.save();

        res.json({
            success: true,
            message: "Appointment updated successfully"
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Failed to update appointment"
        });

    }

});
// Get Appointments
app.get("/appointments", async (req, res) => {

    try {

        const appointments = await Appointment.find();

        res.json({
            success: true,
            appointments: appointments
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Failed to load appointments"
        });

    }                                                                                                                                   
});
// Delete Appointment
app.delete("/appointment/:id", async (req, res) => {
    const id = Number(req.params.id);
    const ownerEmail = req.body.ownerEmail;

    try {
        const appointment = await Appointment.findOneAndDelete({
            id: id,
            ownerEmail: ownerEmail
        });

        if (!appointment) {
            return res.json({
                success: false,
                message: "You can only delete your own appointment"
            });
        }

        res.json({
            success: true,
            message: "Appointment deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Failed to delete appointment"
        });
    }
});
        
// Cancel Appointment
app.post("/cancel-appointment", async (req, res) => {

    const serial = Number(req.body.serial);
    const doctor = req.body.doctor;
    const date = req.body.date;

    try {

        const appointment = await Appointment.findOne({
            serial: serial,
            doctor: doctor,
            date: date
        });

        if (!appointment) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        appointment.status = "Cancelled";

        await appointment.save();

        res.json({
            success: true,
            message: "Appointment cancelled successfully"
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Failed to cancel appointment"
        });

    }

});
// Start Server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log("Server running on port " + PORT);
        });
    })
    .catch(error => {
        console.log("MongoDB connection failed:", error);
    });