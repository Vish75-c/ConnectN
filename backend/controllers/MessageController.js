import Message from "../models/MessageModel.js";


export const getMessages = async (req, res) => {
  try {
    const user1=req.user;
    const user2=req.body._id;

    if(!user1||!user2){
        return res.status(400).send("Both user Id is required");
    }
   
    const messages=await Message.find({
        $or:[
            {sender:user1,recipient:user2},
            {sender:user2,recipient:user1}
        ]
    }).sort({timestamp:1});

    return res.status(200).json({messages});
  } catch (error) {
    
    return res.status(500).send("Internal Server Error");
  }
};