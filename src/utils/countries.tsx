import countriesJSON from '../assets/countries.json';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;

export const countriesOptions = Object.entries(countries).map(
    ([key, value]: any) => ({ label: value.name, value: key })
);
