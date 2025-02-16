document.getElementById("translateButton").addEventListener("click", async () => {
    const inputText = document.getElementById("inputText").value;
    const inputLanguage = document.getElementById("inputLanguage").value;
    const outputLanguage = document.getElementById("outputLanguage").value;

    if (inputText.trim() === "") {
        alert("Por favor, ingresa un texto para traducir.");
        return;
    }

    // Mostrar en la consola los valores para verificar que todo se esté enviando correctamente
    console.log("Texto a traducir:", inputText);
    console.log("Idioma de entrada:", inputLanguage);
    console.log("Idioma de salida:", outputLanguage);

    // URL de la API de Magicloops
    const apiUrl = "https://magicloops.dev/api/loop/f45a0bfe-d1d6-4160-ad2d-015e2a170244/run";

    // Crear el cuerpo de la solicitud
    const requestBody = JSON.stringify({
        text: inputText,
        language: inputLanguage === "es" ? "en" : "es" // Invertimos el idioma de entrada y salida
    });

    try {
        // Hacemos la solicitud POST a la API
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: requestBody,
        });

        console.log("Respuesta de la API:", response);  // Verifica si la respuesta es exitosa

        // Verificamos si la respuesta fue exitosa
        if (response.ok) {
            const data = await response.json();
            console.log("Datos de la respuesta:", data);  // Verifica los datos recibidos

            // Función para extraer solo lo que está entre comillas de un string JSON
            function extractJsonValue(jsonString, key) {
                const regex = new RegExp(`"(${key})": ?"([^"]+)"`);
                const match = jsonString.match(regex);
                return match ? match[2] : "N/A";
            }

            // Extraemos los valores con la expresión regular
            const translation = extractJsonValue(data.translatedText, "translation");
            const pronunciation = extractJsonValue(data.phoneticPronunciation, "phonetic_pronunciation");
            const contraction = extractJsonValue(data.contractionForm, "contraction_form");

            // Mostramos la traducción, la pronunciación fonética y la contracción
            document.getElementById("outputText").innerHTML = `
                <p><strong>Traducción:</strong> ${translation}</p>
                <br>
                <p><strong>Pronunciación:</strong> ${pronunciation}</p>
                <br>
                <p><strong>Contracción:</strong> ${contraction}</p>
            `;
        } else {
            // Si la respuesta de la API no es exitosa
            document.getElementById("outputText").textContent = "Error al traducir. Intenta nuevamente.";
        }
    } catch (error) {
        // En caso de error al hacer la solicitud
        console.error("Error en la solicitud:", error);
        document.getElementById("outputText").textContent = "Hubo un problema al hacer la solicitud.";
    }
});
