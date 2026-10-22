// // This utility converts the buffer into a stream and uploads it.


// import { UploadApiResponse } from "cloudinary";
// import { Readable } from "stream";
// import cloudinary from "../config/cloudinary";

// const uploadToCloudinary = (
//     buffer: Buffer
// ): Promise<UploadApiResponse> => {

//     return new Promise((resolve, reject) => {

//         const uploadStream = cloudinary.uploader.upload_stream(
//             {
//                 folder: "hirehub/resumes",
//                 resource_type: "raw",
//             },
//             (error, result) => {

//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     resolve(result!);
//                 }

//             }
//         );

//         Readable.from(buffer).pipe(uploadStream);

//     });

// };

// export default uploadToCloudinary;