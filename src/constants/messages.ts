import { INVALID } from "zod"

export const CONSTANT_MESSAGES = {

    SUCCESS:"Request completed successfully.",
    CREATED:"Resource created successfully.",

    INTERNAL_SERVER_ERROR:"An unexpected error occurred. Please try again later.",
    BAD_REQUEST:"The request could not be understood.",
    UNAUTHORIZED:"You are not authorized please try again",
    FORBIDDEN:"You are not allowed to perform this action.",
    NOT_FOUND: "The requested resource could not be found.",
    
    INVALID_INPUT:"The request contains invalid data.",
    INVALID_CREDENTIALS:"Invalid email or password"
}


export const AUTH_MESSAGES = {

    INVALID_CREDENTIALS:"Invalid email or password",

    SESSION_EXPIRED:"Session expired login again",
    ALREADY_EXITS:"Email already exists please login",
    BLOCKED:"User blocked by admin",
    VERIFY_ERROR:"User not verified, Verifcation email sent",
    NOT_FOUND:'User not found Signup',
    TOKEN_ERROR:"Token not found or expired",
    INVALID_TOKEN:"Token is invalid or expired",


    GOOGLE_AUTH:'Please Login with google',
    GOOGLE_TOKEN_ERROR:"Google auth faild try again",
    INVALID_GOOGLE_ACC:"Invalid google account",

    GITHUB_AUTH:"Please login with github",

    TOKEN_REFRESH:'Token Successfully refreshed',
    OTP_ERROR:'Otp expired, click on resend to get a new otp',
    OTP_EXPIRED:"Otp expired , click on resend to get new otp",
    INVALID_OTP:'Otp is invalid or does not match',
    RESET_TOKEN_EXPIRED:"Your reset session has expired. Please start again.",
    INVALID_RESET_TOKEN: "Your reset session is invalid. Please start again.",
    OTP_SENT:'Otp has been sent to email',
    OTP_VERIFIED:"Otp verifed",
    OTP_COOLDOWN_ERROR:"Please wait 2 minutes before requesting another OTP",
    OTP_ATTEMPT_ERROR:"OTP attempt limit reached.Click on resend for new otp.",
    OTP_RETRY_ERROR:"Otp retry limit. Try again after one hour."
}

export const USER_MESSAGES = {

    PASSWORD_UPDATED:"Password updated successfully",
    PROFILE_UPDATED:"User profile updated successfully",

    LOGIN_SUCCESS:'User successfully logged in',
    LOGOUT_SUCCESS:'User logout success',
    VERIFY_SUCCESS:'User successfully verified',
    RESEND_VERIFY:'New verification mail has been sent',
    REGISTER_USER:'Verification mail has been sent',
    FETCH_SUCCESS:'User details fetched successfully',
    TOGGLE_SUCCESS:'User status changed successfully',
    UPDATE_PASSWORD_SUCCESS:"User password updated"
}



export const PLAN_MESSAGES = {
    UPDATE_ERROR:'Failed to update the plan',
    STRIPE_PRODUCT_ERROR:'Failed to create stripe product',
    STRIPE_PRICE_ERROR:"Failed to create stripe price",
    STRIPE_ERROR:"Failed to get details from stripe",
    FETCH_SUCCESS:"Plans details fetched",
    UPDATE_SUCCESS:"Plan successfully updated",
    ERROR:"Failed to subscripe to the plan",
    STRIPE_SUBSCRIPTION_ERROR:'failed to create stripe subscription',
    
}