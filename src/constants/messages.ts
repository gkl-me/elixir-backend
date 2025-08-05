export enum CONSTANT_MESSAGES {

    SUCCESS="Request completed successfully.",
    CREATED= "Resource created successfully.",

    INTERNAL_SERVER_ERROR="An unexpected error occurred. Please try again later.",
    BAD_REQUEST= "The request could not be understood.",
    UNAUTHORIZED= "You are not authorized please try again",
    FORBIDDEN= "You are not allowed to perform this action.",
    NOT_FOUND= "The requested resource could not be found.",
    
    INVALID_INPUT= "The request contains invalid data.",
    INVALID_CREDENTIALS="Invalid email or password"
}


export enum AUTH_MESSAGES {
    ALREADY_EXITS="Email already exists please login",
    BLOCKED="User blocked by admin",
    VERIFY_ERROR="User not verified, Verifcation email sent",
    NOT_FOUND='User not found Signup',
    TOKEN_ERROR="Token not found",
    GOOGLE_AUTH='Please Login with google',
    TOKEN_REFRESH='Token Successfully refreshed',
}

export enum USER_MESSAGES {
    LOGIN_SUCCESS='User successfully logged in',
    LOGOUT_SUCCESS='User logout success',
    VERIFY_USER='User successfully verified',
    REGISTER_USER='Verification mail has been sent',
    FETCH_SUCCESS='User details fetched successfully',
    TOGGLE_SUCCESS='User status changed successfully',
}


export enum ADMIN_MESSAGES {
    LOGIN_SUCCESS = 'Admin Login Successful',
    FETCH_SUCCESS = 'Admin details fetched',
    LOGOUT_SUCCESS = 'Admin Logout success',
    REFRESH_SUCCESS = 'Admin Token Refresh Success',
}

export enum PLAN_MESSAGES {
    UPDATE_ERROR='Failed to update the plan',
    STRIPE_PRODUCT_ERROR='Failed to create stripe product',
    STRIPE_PRICE_ERROR="Failed to create stripe price",
    STRIPE_ERROR="Failed to get details from stripe",
    FETCH_SUCCESS="Plans details fetched",
    UPDATE_SUCCESS="Plan successfully updated",
    ERROR="Failed to subscripe to the plan",
    STRIPE_SUBSCRIPTION_ERROR='failed to create stripe subscription',
    
}