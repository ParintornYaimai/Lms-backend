import jwt from 'jsonwebtoken'
import authService from '../modules/auth/auth.service'





// create Access_token
export const generateAccessToken =async(user:any)=>{
    const secret = await authService.getCurrentSecret();
    return jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname , email: user.email ,role: user.role  }, secret, { expiresIn: '5m' });
}

// create Refresh_token
export const generateRefreshToken =async(user:any)=>{
    const secret = await authService.getCurrentSecret();

    const existToken = user.refreshTokens.find(
        (refreshToken: any)=> new Date(refreshToken.expiresAt) > new Date()
    );

    if(existToken){
        return existToken.token
    }

    const token = jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname , email: user.email ,role: user.role  }, secret, { expiresIn: '7d' });
    
    // save Refresh Token 
    user.refreshTokens.push({ token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    await user.save();
  
    return token;
}

