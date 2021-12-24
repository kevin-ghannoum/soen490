import jwtDecode from 'jwt-decode';

export const getCurrentUserEmail = (token: string): string => {
    const tokenInfo: any = jwtDecode(token);
    const currentUserEmail: string = tokenInfo.email
    return currentUserEmail
}