export type TRouter = {
    pathname: string;
}

export type TTarget = string | {
    path: string;
    routes: string[];
}