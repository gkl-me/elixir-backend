export interface IRegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface ILoginDto {
  email: string;
  password: string;
}

export interface IAuthResponseDto {
  user: {
    id: string,
    name: string,
    email: string,
    avatarUrl: string | null,
    role: 'user' | 'superAdmin'
  },
  workspace: {
    id: string,
    name: string,
    slug: string,
    memberId: string | null,
    roleId: string | null,
    isOwner: boolean
  } | null
  accessToken: string,
  refreshToken: string
}

export interface ISendVerificationEmailDto {
  email: string;
}

export interface IVerifyEmailDto {
  token: string | undefined;
}

export interface IVerifyUserDTO {
  token: string | undefined;
}

export interface IGoogleAuthDto {
  idToken: string;
}

export interface IGithubAuthDto {
  githubId: string;
  githubUsername: string;
  name: string;
  email: string;
  image: string;
  access_token: string;
}

export interface IRefreshTokenDto {
  refreshToken: string;
}

export interface IRefreshTokenResponseDto {
  newAccessToken: string;
  newRefreshToken: string;
}

export interface ILogoutDto {
  refreshToken: string;
}

export interface IResendVerficationDto {
  email: string;
}

export interface IForgotPasswordDto {
  email: string;
}

export interface IForgotPasswordResponseDto {
  userEmail: string;
  expiresAt: Date;
}

export interface ISendOtpDto {
  email: string;
}

export interface IVerifyOtpDto {
  otp: string;
  email: string;
}

export interface IVerifyOtpResponseDto {
  resetPasswordToken: string;
}

export interface IResetPasswordDto {
  email: string;
  newPassword: string;
  resetPasswordToken: string;
}
