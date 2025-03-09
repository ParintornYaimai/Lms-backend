import { userTypeModel,loginTypeModel, logoutTypeModel } from "../../types/user.type";
import {secretModel,studentModel} from "../../model/student.Model"
import { generateAccessToken, generateRefreshToken } from "../../util/token";
import jwt,{JwtPayload} from "jsonwebtoken"
import bcrypt from 'bcrypt';
import crypto from "crypto";
import { sendOtpEmail } from '../../util/helper';
import {OtpModel} from '../../model/otp.Model'
import { TeacherModel } from "../../model/teacher.Model";

class AuthService{

    private async verifyWithDynamicSecret(token:string):Promise<JwtPayload>{
        const secret = await secretModel.findOne();
        if(!secret) throw new Error('Secret not found');
    
        try {
            return jwt.verify(token,secret.currentSecret) as JwtPayload;
        }catch(error){
            for(const old of secret.oldSecrets){
                try {
                  return jwt.verify(token, old.secret) as JwtPayload;
                } catch (e) {}
            }
            throw new Error('Invalid token');
        }
    }
    
    
    async create(data:userTypeModel ){
        const {firstname, lastname, email, password, role} = data
        const existUser = await studentModel.findOne({email});
        
        if(existUser) throw new Error('User already exist')
        if(!password) throw new Error('Password is required')
            
        //encrypt
        const salt = await bcrypt.genSalt(10)
        const encrypt = await bcrypt.hash(password,salt)
            
        const newUser =await studentModel.create({
            firstname,
            lastname,
            email,
            password: encrypt,
            role,
        });

        return newUser
    }

    async createForTeacher(data:userTypeModel ){
        const {firstname, lastname, email, password } = data
        const existUser = await TeacherModel.findOne({email});
        
        if(existUser) throw new Error('User already exist')
        if(!password) throw new Error('Password is required')
            
        //encrypt
        const salt = await bcrypt.genSalt(10)
        const encrypt = await bcrypt.hash(password,salt)
                
        const newUser = await TeacherModel.create({
            firstname,
            lastname,
            email,
            password: encrypt,
        })

        return newUser
    }

    async login(data: loginTypeModel) {
        const { email, password } = data;
    
        let user = await studentModel.findOne({ email });
        if(!user) user = await TeacherModel.findOne({ email });
        
        if(!user) throw new Error("User not found");
        
        const isMatch = bcrypt.compareSync(password, user.password);
        if(!isMatch) throw new Error("Password Invalid");

        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        return { accessToken, refreshToken };
    }

    async loggout (data:logoutTypeModel) {
        const {id,refresh_token} = data       

        const user = await studentModel.findById(id);
        if(!user) throw new Error('User not found')

        user.refreshTokens = user.refreshTokens?.filter((t) => t.token !== refresh_token) ?? [];
        await user.save();

        return user;
    }

    async generateAndSetSecret(){
        const newSecret = crypto.randomBytes(32).toString('hex');
        const existSecret = await secretModel.findOne();
    
        if(existSecret){
            existSecret.oldSecrets = existSecret.oldSecrets.filter(
                (oldSecret) => new Date(oldSecret.expiresAt) > new Date()
            );
  
            existSecret.oldSecrets.push({
                secret: existSecret.currentSecret  ,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            })

            if(existSecret.oldSecrets.length > 0){
                existSecret.oldSecrets = [existSecret.oldSecrets[existSecret.oldSecrets.length - 1]]; 
            }

            existSecret.currentSecret = newSecret
            await existSecret.save();

        }else{
            await secretModel.create({
                currentSecret: newSecret,
                oldSecrets: []
            })
        }
    }

    async refreshToken(refreshTokenInput: string){
        const userData = await this.verifyWithDynamicSecret(refreshTokenInput);
        const user = await studentModel.findById(userData.id);

        if(!user || !user?.refreshTokens || !user.refreshTokens.some((t) => t.token === refreshTokenInput)) {
            throw new Error('Invalid refresh token')
        }

        const now = new Date();
        user.refreshTokens = user.refreshTokens.filter(t => new Date(t.expiresAt) > now);
        await user.save();
        
        return await generateAccessToken(user);
    }

    async getCurrentSecret(){
        const secret = await secretModel.findOne();
        if(!secret) throw new Error('Secret not found. generate one first');
        
        return secret.currentSecret;
    }

    async sendOtp(email: string){
        const otp = Math.floor(10000 + Math.random() * 90000).toString();
        const result = await OtpModel.create({
            email,
            otp,
            otpExpiresAt: new Date()
        })
        await sendOtpEmail(result.email, result.otp);
        
        return "OTP sent successfully" 
    }

    async verifyOtp(email: string, otpEntered: string){
        const data = await OtpModel.findOne({email}).lean();
        if(!data) throw new Error('Email not found');

        const isOtpValid = data.otp === otpEntered 
        if (!isOtpValid) throw new Error('OTP is invalid');
        if(new Date() < new Date(data.otpExpiresAt)) throw new Error('OTP is expired');
        
        return "OTP verified successfully";
    }

    async resetPassword(email: string, RePassword: string){
        const data = await OtpModel.findOne({email}).lean();
        if(!data) throw new Error('Email not found');

        const hashRepassword = bcrypt.hashSync(RePassword, 10);
        await studentModel.updateOne({ email }, { password: hashRepassword });
        
        return "Password reset successfully"
    }
}

export default new AuthService

