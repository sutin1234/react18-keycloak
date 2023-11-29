
import { jwtDecode } from "jwt-decode";
import Keycloak, { KeycloakLoginOptions, KeycloakLogoutOptions } from "keycloak-js";
import React, { createContext, useEffect, useRef, useState, type ReactNode } from "react";
import keycloakInstance from '../config/keycloak';

interface KeycloakContextProps {
    keycloak: Keycloak;
    authenticated: boolean
    isLoading: boolean
    login: (option?: KeycloakLoginOptions) => Promise<void>
    logout: (option?: KeycloakLogoutOptions) => Promise<void>
    profile: any
}

const KeycloakContext = createContext<KeycloakContextProps | null>(null);

export const useKeycloak = (): KeycloakContextProps => {
    const context = React.useContext(KeycloakContext);

    if (context === null) {
        throw new Error("useKeycloak must be used within a KeycloakProvider");
    }

    return context;
};


const useKeycloakState = (): KeycloakContextProps => {
    const [isLoading, setIsLoading] = useState(true);
    const kcInit = useRef(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [profile, setProfile] = useState({})

    async function login(option?: KeycloakLoginOptions) {
        return keycloakInstance.login(option)
    }
    async function logout(option?: KeycloakLoginOptions) {
        return keycloakInstance.logout(option)
    }

    useEffect(() => {
        if (kcInit.current) return

        kcInit.current = true
        keycloakInstance
            .init({
                onLoad: "login-required",
                checkLoginIframe: false,
            })
            .then((auth) => {
                console.log('auth ', auth, keycloakInstance)
                setIsLoading(false);
                setAuthenticated(auth)

                // decode jwt
                const decoded = jwtDecode(keycloakInstance.token as string);
                setProfile(decoded)
            })
            .catch(console.error);


        keycloakInstance.onTokenExpired = () => {
            console.log('onTokenExpired >>')
            keycloakInstance.updateToken(30).then(refreshed => {
                if (refreshed) {
                    console.log('refresh token success!')
                } else {
                    console.log('token still vaid')
                }
            })
        }
    }, []);

    return { isLoading, authenticated, keycloak: keycloakInstance, login, logout, profile };
};

export default function KeycloakProvider({ children }: {
    children: ReactNode;
}): JSX.Element {
    const { isLoading, authenticated, keycloak, login, logout, profile } = useKeycloakState() as KeycloakContextProps;
    return (
        <KeycloakContext.Provider value={{ isLoading, keycloak, authenticated, login, logout, profile }}>
            {!isLoading ? children : (
                <>
                    Loading ...
                </>
            )}
        </KeycloakContext.Provider>
    );
}