const langConfig = [
    {
        code: 'en-US',
        isDefault: true,
        label: 'English',
        shortCode: 'en',
        dateFnsCode: 'enUS'
    },
    { code: 'pt-BR', label: 'Português', shortCode: 'pt', dateFnsCode: 'ptBR' },
    { code: 'fr-FR', label: 'Français', shortCode: 'fr', dateFnsCode: 'fr' },
    { code: 'es-ES', label: 'Español', shortCode: 'es', dateFnsCode: 'es' },
    { code: 'lg-LG', label: 'Luganda', shortCode: 'lg', dateFnsCode: 'lg' }
];

export const languagesOptions = Object.entries(langConfig).map(
    ([, value]: any) => ({
        flagKey: value.flagKey,
        label: value.label,
        value: value.shortCode
    })
);
