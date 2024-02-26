import { useDispatch, useSelector } from "react-redux";
import apiSJM from "../api/apiSJM";
import { onChecking, onLogin, onLogout, clearErrorMessage, RootState } from "../store";

interface LoginProps {
    username: string;
    password: string;
}

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ username, password }: LoginProps) => {
        dispatch(onChecking());
        try {
            const { data } = await apiSJM.post("/auth/login", { username, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("token-init-date", new Date().getTime().toString());
            dispatch(onLogin({
                id_user: data.user.id,
                name: data.user.name,
                username: data.user.username,
                roles: data.user.roles,
            }));
        } catch (error) {
            dispatch(onLogout("Verifique las credenciales ingresadas"));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    };

    const checkAuthToken = async () => {
        const token = localStorage.getItem("token");
        if (!token) return dispatch(onLogout());

        try {
            const { data } = await apiSJM.get("/auth/renew");
            localStorage.setItem("token", data.token);
            localStorage.setItem("token-init-date", new Date().getTime().toString());
            dispatch(onLogin({
                id_user: data.user.id,
                name: data.user.name,
                username: data.user.username,
                roles: data.user.roles,
            }));
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout("Ocurrió un error al verificar el token"));
        }
    };

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout("Sesión cerrada correctamente"));
    };

    return {
        // Propiedades
        status,
        user,

        errorMessage,

        // Métodos
        startLogin,
        checkAuthToken,
        startLogout,
    };
};