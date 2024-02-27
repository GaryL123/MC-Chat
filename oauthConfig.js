import * as AuthSession from 'expo-auth-session';

// Construct the authorization URL manually
const oauthConfig = {
    clientId: '706298541322-0h4ukmt3p2c5qulh9bilms7ti8grnlov.apps.googleusercontent.com',
    redirectUri: 'https://mc-chat-b6bef.firebaseapp.com/__/auth/handler', // Directly using Firebase redirect URI
    scopes: ['openid', 'profile', 'email'],
};

// Helper function to construct the auth URL
function createAuthUrl(oauthConfig) {
    const scope = encodeURIComponent(oauthConfig.scopes.join(' '));
    const redirectUri = oauthConfig.redirectUri;
    const clientId = encodeURIComponent(oauthConfig.clientId);
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
}

export const obtainGoogleAccessToken = async () => {
    try {
        const authUrl = createAuthUrl(oauthConfig);
        const response = await AuthSession.loadAsync({ authUrl });

        if (response.type === 'success') {
            // The accessToken is part of the response
            return { success: true, accessToken: response.params.access_token };
        } else {
            // Handle the error or cancellation scenario
            return { success: false, error: 'Authentication was not successful' };
        }
    } catch (e) {
        console.error('Error obtaining access token:', e);
        return { success: false, msg: e.message };
    }
};
