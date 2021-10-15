import { DatabaseAuthenticator, SignInOptions } from 'auth0';
import debug from 'debug';
import { inject, injectable } from 'tsyringe';

const log: debug.IDebugger = debug('app:AuthenticationService');

@injectable()
export class AuthenticationService {
    constructor(
        @inject('auth0-database-authenticator') private databaseAuthenticator: DatabaseAuthenticator
    ) {
        log('Created instance of AuthenticationService');
    }

    public login = async (accountInfo: {
        username: string,
        password: string
    }) => {
        const data = {
            ...accountInfo,
            //client_id: process.env.AUTH0_CLIENT_ID,
            connection: process.env.AUTH0_CONNECTION,
            //scope: 'openid',
            //otp: ''
        }


        const token = await this.databaseAuthenticator.signIn(data as SignInOptions)
        console.log(token)

        return token;
    }

    public logout = () => {

    }


}
