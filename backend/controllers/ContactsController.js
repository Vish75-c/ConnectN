import User from "../models/UserModel.js";
export const searchContacts = async (req, res) => {
  try {
    const {searchTerm}=req.body;
    if(searchTerm===undefined||searchTerm===null){
        return res.status(400).send("Search Term is Required");
    }
    const sanitizedSeachTerm=searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,"\\$&"
    );
    const regex=new RegExp(sanitizedSeachTerm,'i');
    const contacts=await User.find({
        $and:[
            {_id:{$ne:req.userId}},
            {
                $or:[{firstName:regex},{lastName:regex},{email:regex}]
            }
        ]
    })
    return res.status(200).json({contacts});
  } catch (error) {
    
    return res.status(500).send("Internal Server Error");
  }
};