module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true
    },
    purge: ["./src/**/*"],
    theme: {
        extend: {}
    },
    variants: {},
    plugins: [require("@tailwindcss/custom-forms")]
};
