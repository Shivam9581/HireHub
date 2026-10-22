// import User from "../models/User";
// import uploadToCloudinary from "../utils/uploadToClaudary";
// import cloudinary from "../config/cloudinary";

// export const uploadResume = async (

//     userId: string,

//     buffer: Buffer

// ) => {

//     const user = await User.findById(userId);

//     if (!user)

//         throw new Error("User not found");

//     if (user.resume?.publicId) {

//         await cloudinary.uploader.destroy(

//             user.resume.publicId as string,

//             {

//                 resource_type: "raw",

//             }

//         );

//     }

//     const uploaded = await uploadToCloudinary(
//         buffer
//     );

//     user.resume = {

//         url: uploaded.secure_url,

//         publicId: uploaded.public_id,

//     };

//     await user.save();

//     return user;

// };