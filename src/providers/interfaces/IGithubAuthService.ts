


export interface IGithubAuthService{
    getGithubUser(accessToken:string):Promise<void>
    verifyGithubUser(accessToken:string):Promise<[{
        email:string,
        primary:boolean,
        verified:boolean
    }]>
}