export interface ITokenManager {
    generateAccessToken(id:string,role:string):string;
    generateRefreshToken(id:string,role:string):string;
    verifyToken(token:string,type:'access'|'refresh'):{id:string,role:string};
    decodeToken(token:string):{id:string,role:string}
}