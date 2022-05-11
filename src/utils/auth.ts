import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth';
import { app } from "./firebase";

// provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    // provider.addScope('profile');
    // provider.addScope('email');

    // provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithRedirect(auth, provider);
};

export const getUserWithGoogle = async () => {
    const auth = getAuth(app);
    const result = await getRedirectResult(auth)
    if (result) {
        const token = await result.user.getIdToken();
        const user = authenticate(token)
        return user;
    }
    return null
}

export const logout = async () => {
    const auth = getAuth(app)
    await signOut(auth)
    localStorage.removeItem('user')
    localStorage.removeItem("room")
}

export const getUser = () => {
    try {
        const tokenText = localStorage.getItem('user') || ''
        if (tokenText === '') {
            return null
        }
        const token = JSON.parse(tokenText)
        if (token && token?.displayName) {
            return token
        }
        return null
    } catch (e) {
        return null
    }
}

export const check = () => {
    const auth = getAuth(app)
    return auth.currentUser !== null ? true : false;
}

export const authenticate = async (token: string) => {
    const url = window.__RUNTIME_CONFIG__.REACT_APP_LOGIN_URL || ''
    const appID = window.__RUNTIME_CONFIG__.REACT_APP_APP_ID || ''
    const webAPI = window.__RUNTIME_CONFIG__.REACT_APP_WEB_API || ''
    const response = await fetch(url, {
        headers: {
            "Grpc-Metadata-app-id": appID,
            "Grpc-Metadata-web-api-key": webAPI
        },
        body: JSON.stringify({
            token,
            token_type: "firebase-token",
        }),
        method: 'POST'
    })
    const user = await response.json()
    const { access_token } = await user
    const { user_profile } = await user
    localStorage.setItem('access_token', access_token || '')
    localStorage.setItem('user', JSON.stringify(user_profile) || '')
    return await user_profile
}