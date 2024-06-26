export interface ClientInterface {
    id: number;
    name: string;
    last_name: string;
    dni_cuit: string;
    phone: string;
    email: string;
    address: string;
    id_locality: string;
    annotations: string;
    locality: string;
}

export interface BasicClientInterface {
    id: number;
    name: string;
    last_name: string;
}

export interface ClientProjectInterface {
    id: string;
    title: string;
    status: string;
    priority: string;
    locality: string;
}