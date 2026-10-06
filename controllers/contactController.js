const Contact = require('../model/Contact');
const cloudinary = require('../config/cloudinary');

// 1. ADD CONTACT
exports.addContact = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                error: "Image is required"
            });
        }

        const file = req.files.image;
        const uploadedImage = await cloudinary.uploader.upload(file.tempFilePath);

        const newContact = new Contact({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            gender: req.body.gender,
            userId: req.user._id,
            imageUrl: uploadedImage.secure_url,
            imageId: uploadedImage.public_id
        });

        const result = await newContact.save();
        res.status(200).json({
            newcontact: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
};

// 2. GET ALL CONTACTS (PAGINATED)
exports.getAllContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const data = await Contact.find({ userId: req.user._id })
            .populate("userId", "fullName email phone")
            .select('_id fullName email phone address gender userId imageUrl imageId')
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            contactlist: data
        });
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
};

// 3. GET CONTACT BY ID
exports.getContactById = async (req, res) => {
    try {
        const data = await Contact.findById(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "Contact not found"
            });
        }

        if (data.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: "invalid user hai"
            });
        }

        res.status(200).json({
            contactbyid: data
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
};

// 4. GET CONTACT BY GENDER
exports.getContactByGender = async (req, res) => {
    try {
        const data = await Contact.find({
            gender: req.params.gender,
            userId: req.user._id
        });

        res.status(200).json({
            contactbygender: data
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
};

// 5. UPDATE CONTACT
exports.updateContact = async (req, res) => {
    try {
        const data = await Contact.findById(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "Contact not found"
            });
        }

        if (data.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: "invalid user hai"
            });
        }

        const updatedData = {
            fullName: req.body.fullName || data.fullName,
            email: req.body.email || data.email,
            phone: req.body.phone || data.phone,
            address: req.body.address || data.address,
            gender: req.body.gender || data.gender,
            userId: data.userId
        };

        if (req.files && req.files.image) {
            if (data.imageId) {
                await cloudinary.uploader.destroy(data.imageId);
            }
            const file = req.files.image;
            const uploadedImage = await cloudinary.uploader.upload(file.tempFilePath);
            updatedData.imageUrl = uploadedImage.secure_url;
            updatedData.imageId = uploadedImage.public_id;
        } else {
            updatedData.imageUrl = data.imageUrl;
            updatedData.imageId = data.imageId;
        }

        const result = await Contact.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json({
            updatedData: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
};

// 6. DELETE CONTACT BY ID
exports.deleteContact = async (req, res) => {
    try {
        const data = await Contact.findById(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "Contact not found"
            });
        }

        if (data.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: "invalid user hai"
            });
        }

        if (data.imageId) {
            await cloudinary.uploader.destroy(data.imageId);
        }

        await Contact.deleteOne({ _id: req.params.id });
        res.status(200).json({
            message: "data deleted"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
};

// 7. DELETE BY GENDER
exports.deleteByGender = async (req, res) => {
    try {
        await Contact.deleteMany({
            gender: req.params.gender,
            userId: req.user._id
        });

        res.status(200).json({
            message: "data deleted"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
};

// 8. COUNT CONTACTS
exports.getContactCount = async (req, res) => {
    try {
        const total = await Contact.countDocuments({ userId: req.user._id });
        res.status(200).json({
            Total: total
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
};
