import axios from "axios";

const deleteFile = async (fileKey) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/fileManagement/delete`,
            { key: fileKey }
        );

        if (response.status === 204) {
            return "¡Archivo eliminado!";
        }
    } catch (error) {
        console.error(`Error al eliminar el archivo: ${error.message}`);

        throw new Error("Error al eliminar el archivo.");
    }
};

export default deleteFile;
