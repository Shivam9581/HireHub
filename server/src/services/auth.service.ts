import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../config/env";
import User from "../models/User";


// Register function

export const registerUser = async (
    name: string,
    email: string,
    password: string,
    role: "student" | "recruiter"
) => {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);  // The second parameter is called the salt rounds. (Higher number means more secure but slower)

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    // return user;
    return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    };
};


// Login function
export const loginUser = async (
    email: string,
    password: string
) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        { // Payload
            id: user._id,
            role: user.role,
        },
        env.JWT_SECRET,
        { // Secret
            expiresIn: "7d",
        }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};