export enum TType {
    Profit = 0,
    Cost = 1,
}

export type TCategories = {
    id: number;
    name: string;
}

export type TEvent = {
    id: number;
    name: string;
    number: number;
    date: string;
    type: TType;
    categoryId: number;
}

