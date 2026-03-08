import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";
export const searchContacts = async (req, res) => {
    try {
        const { searchTerm } = req.body;
        if (searchTerm === undefined || searchTerm === null) {
            return res.status(400).send("Search Term is Required");
        }
        const sanitizedSeachTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g, "\\$&"
        );
        const regex = new RegExp(sanitizedSeachTerm, 'i');
        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
                }
            ]
        })
        return res.status(200).json({ contacts });
    } catch (error) {

        return res.status(500).send("Internal Server Error");
    }
};


export const getContactFromDMList = async (req, res) => {
    try {
        let userId = req.user;
        userId = new mongoose.Types.ObjectId(userId);
             
       
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                }
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$sender', userId] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind:"$contactInfo"
            },
            {
                $project:{
                    _id:1,
                    lastMessageTime:1,
                    email:'$contactInfo.email',
                    firstName:'$contactInfo.firstName',
                    lastName:'$contactInfo.lastName',
                    image:'$contactInfo.image',
                    color:'$contactInfo.color'
                }
            },
            {
                $sort:{lastMessageTime:-1},
            },
        ]);
        // console.log(contacts,'Visited');
        return res.status(200).json({ contacts });
    } catch (error) {

        return res.status(500).send("Internal Server Error");
    }
};

export const getAllContacts = async (req, res) => {
    try {
        // 1. Added "email" to the projection so you can actually use it
        const users = await User.find({
            _id: { $ne: req.user }
        }, "firstName lastName _id email"); 

        // 2. Map BOTH label and value
        const contacts = users.map((user) => ({
            label: user.firstName 
                ? `${user.firstName} ${user.lastName}` 
                : user.email,
            value: user._id, // <--- THIS WAS MISSING
        }));

        return res.status(200).json({ contacts });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};