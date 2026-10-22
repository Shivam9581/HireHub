import User from "../models/User";

export const getProfile = async(userId : string) => {
    const user = await User.findById(userId).select("name email role resume createdAt")

    if(!user) throw new Error("User Not Found!");

    return user;
}

export const UpdateProfile = async (
    userId : string,
    data : {
        name? : string;
        email? : string;
    }
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (data.name !== undefined) {
        user.name = data.name;
    }

    if (data.email !== undefined) {
        user.email = data.email;
    }

    await user.save();

    return user;
}


import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

const uploadPdfToCloudinary = (userId: string, fileBuffer: Buffer) =>
    new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: "hirehub/resumes",
                public_id: `${userId}-${Date.now()}`,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (!result) {
                    reject(new Error("Resume upload failed!"));
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(fileBuffer);
    });



const destroyResumeAsset = async (publicId : string) : Promise<boolean> =>{
    let deleted = false;

    for(const resource_type of ["image", "raw"] as const){
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type,
            invalidate:true,
        });

        if(response.result === 'ok') deleted = true;
    }

    return deleted;
};



export const uploadResume = async (userId : string,fileBuffer : Buffer) =>  {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const uploaded = await uploadPdfToCloudinary(userId, fileBuffer);

    const oldPublicId = user.resume?.publicId;

    user.resume = {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
    };


    try{
        await user.save();
    } catch (error){
        destroyResumeAsset(uploaded.public_id).catch(() => {});
        throw Error;
    }

    if(oldPublicId){
        try{
            await destroyResumeAsset(oldPublicId);
        }catch (error) {
        console.error("Failed to delete old resume : ", error);
        }
    }

    return {
        url : user.resume.url,
    };

};


export const deleteResume = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.resume?.publicId) {
        throw new Error("No resume found");
    }

    const publicId = user.resume.publicId;

    try{
        await destroyResumeAsset(publicId);
    } catch {
        throw new Error("Failed to delete resume from Cloudinary");
    }


    user.resume = {
        url: "",
        publicId: "",
    };

    await user.save();

    return { message: "Resume deleted successfully" };
};