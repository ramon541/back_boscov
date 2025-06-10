interface IResponse<T> {
    success: boolean;
    message: string | Array<string>;
    data?: T;
}

interface IApiController<T> {
    create: T;
    get: T;
    getAll: T;
    update: T;
    delete: T;
}

interface IReviewController<T> extends IApiController<T> {
    getAllReviewsByMovieId: T;
    getUserReviewByMovieId: T;
}

interface IApiAuthController<T> {
    register: T;
    login: T;
}
