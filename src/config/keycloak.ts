import Keycloak from "keycloak-js";

const keycloakInstance = new Keycloak({
    url: "http://localhost:8080",
    realm: "angular_dev",
    clientId: "e_commerce",
});

export default keycloakInstance;
