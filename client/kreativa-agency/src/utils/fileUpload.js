import axios from "axios";

const uploadFile = async (files, folder, parent, parent_id) => {
    const formData = new FormData();

    const path = JSON.stringify({
        folder: folder,
        parent: parent,
        parent_id: parent_id,
    });

    formData.append("path", path);

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/fileManagement`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return res.data.files_ids;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default uploadFile;
