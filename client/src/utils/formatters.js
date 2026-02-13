
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
    }).format(amount);
};

export const numberToWords = (value) => {
    if (value === 0) return "CERO";

    const units = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE", "VEINTIUNO", "VEINTIDOS", "VEINTITRES", "VEINTICUATRO", "VEINTICINCO", "VEINTISEIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];
    const tens = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const hundreds = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

    const integerPart = Math.floor(value);

    // Convert integer part to words
    let words = "";

    if (integerPart === 0) words = "CERO";
    else if (integerPart > 999999) {
        words = "SOPORTE SOLO HASTA 999,999"; // Simplification for now, or implement millions
    } else {
        // Thousands
        const miles = Math.floor(integerPart / 1000);
        const rest = integerPart % 1000;

        if (miles > 0) {
            if (miles === 1) words += "MIL ";
            else words += convertHundreds(miles) + " MIL ";
        }

        if (rest > 0 || miles === 0) {
            words += convertHundreds(rest);
        }
    }

    // Helper for 0-999
    function convertHundreds(num) {
        let str = "";
        if (num === 100) return "CIEN";

        if (num > 100) {
            str += hundreds[Math.floor(num / 100)] + " ";
            num %= 100;
        }

        if (num <= 29) {
            str += units[num];
        } else {
            str += tens[Math.floor(num / 10)];
            if (num % 10 > 0) str += " Y " + units[num % 10];
        }
        return str.trim();
    }

    return words.trim();
};
