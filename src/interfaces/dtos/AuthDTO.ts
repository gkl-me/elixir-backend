
export interface IRegisterDto{
    name:string,
    email:string,
    password:string,
}


export interface ILoginDto{
    email:string,
    password:string
}



export interface IAuthResponseDto{
    id:string,
    email:string,
    name:string,
    role:string,
    accessToken:string,
    refreshToken:string
}


export interface ISendVerificationEmailDto{
    email:string
}

export interface IVerifyEmailDto{
    token:string|undefined
}

export interface IVerifyUserDTO{
    token:string|undefined
}

export interface IGoogleAuthDto{
    name:string,
    email:string,
    googleId:string,
    image:string
}


export interface IRefreshTokenDto{
    refreshToken:string
}

export interface IRefreshTokenResponseDto{
    newAccessToken:string,
    newRefreshToken:string
}


export interface ILogoutDto{
    refreshToken:string
}

export interface IResendVerficationDto{
    email:string
}


export interface IForgotPasswordDto{
    email:string
}


export interface ISendOtpDto{
    email:string,
}

export interface IVerifyOtpDto{
    otp:string,
    email:string
}

export interface IVerifyOtpResponseDto{
    resetPasswordToken:string
}

export interface IResetPasswordDto{
    email:string
    newPassword:string
    resetPasswordToken:string
}