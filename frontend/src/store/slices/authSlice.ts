import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInterface {
    id_user: string | null;
    name: string | null;
    username: string | null;
}

interface RolesInterface {
    roles: string[];
}

interface AuthState {
    status: string;
    user: UserInterface | null;
    roles: RolesInterface | null;
    errorMessage?: string; // Hacer errorMessage opcional
}

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        status: "checking",
        user: { id_user: null, name: null, username: null },
        roles: { roles: [] },
        errorMessage: undefined,
    } as AuthState,

    reducers: {
        onChecking: (state) => {
            state.status = "checking";
            state.user = { id_user: null, name: null, username: null };
            state.roles = { roles: [] };
            state.errorMessage = undefined;
        },
        onLogin: (state, { payload }: PayloadAction<any>) => {
            state.status = "authenticated";
            state.user = {
                id_user: payload.id_user,
                name: payload.name,
                username: payload.username,
            };
            state.roles = payload.roles;
            state.errorMessage = undefined;
        },
        onLogout: (state, { payload }: PayloadAction<string | undefined>) => {
            state.status = "not-authenticated";
            state.user = null;
            state.roles = null;
            state.errorMessage = payload;
        },
        clearErrorMessage: (state) => {
            state.errorMessage = undefined;
        },
    },
});

export const { onChecking, onLogin, onLogout, clearErrorMessage } = authSlice.actions;
