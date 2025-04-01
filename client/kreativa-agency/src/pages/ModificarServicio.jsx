import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Upload, Image, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import uploadFile from "../utils/fileUpload";

const ModificarServicio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [servicio, setServicio] = useState({
        nombre: "",
        descripcion: "",
        categoria_id: "",
        imagenes: [],
    });
    const [categorias, setCategorias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);

    const [api, contextHolder] = notification.useNotification();

    const openSuccessNotification = (message) => {
        api.success({
            message: "Éxito",
            description: message,
            placement: "bottomRight",
            duration: 4,
        });
    };

    const openErrorNotification = (message) => {
        api.error({
            message: "Error",
            description: message,
            placement: "bottomRight",
            duration: 4,
        });
    };

    const fetchCategorias = async () => {
        try {
            const res = await axios.get(
                "http://localhost:4000/api/servicios/categorias"
            );
            setCategorias(res.data);
        } catch (error) {
            console.error("Error cargando categorias:", error);
            openErrorNotification("Error al cargar las categorías");
        }
    };

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(
                    `http://localhost:4000/api/servicios/${id}`
                );
                setServicio(res.data);

                if (res.data.imagen) {
                    const initialFileList = [
                        {
                            uid: "-1",
                            name: "imagen-actual.jpg",
                            status: "done",
                            url: res.data.imagen,
                        },
                    ];
                    setFileList(initialFileList);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener el servicio: ", error);
                openErrorNotification(
                    "No se pudo cargar la información del servicio"
                );
                setIsLoading(false);
            }
        };

        fetchServicio();
        fetchCategorias();
    }, [id]);

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServicio((prevServicio) => ({ ...prevServicio, [name]: value }));
    };

    const handleImageChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (
            !servicio.nombre ||
            !servicio.descripcion ||
            !servicio.categoria_id
        ) {
            openErrorNotification("Todos los campos son obligatorios");
            return;
        }
        setConfirmModal(true);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            // First, handle file upload if there's a new file
            if (fileList.length > 0 && fileList[0].originFileObj) {
                try {
                    const file = fileList[0].originFileObj;

                    if (file) {
                        // This uploads the file to S3 and returns the file IDs
                        const imagenes = await uploadFile(
                            [file],
                            "landingpage",
                            "servicios",
                            id
                        );

                        console.log("Uploaded image IDs:", imagenes);

                        // Update the service with the new image IDs
                        // Important: Send only imagenes here to update just that field
                        const imageUpdateResponse = await axios.put(
                            `http://localhost:4000/api/servicios/modificar/${id}`,
                            { imagenes }
                        );

                        console.log(
                            "Image update response:",
                            imageUpdateResponse.data
                        );
                    }
                } catch (error) {
                    console.error("Error al subir archivos:", error);
                    openErrorNotification("No se pudo subir la imagen");
                    setConfirmModal(false);
                    setIsLoading(false);
                    return;
                }
            }

            // Update the service general information (separate from image update)
            const serviceData = {
                nombre: servicio.nombre,
                descripcion: servicio.descripcion,
                categoria_id: servicio.categoria_id,
            };

            const updateResponse = await axios.put(
                `http://localhost:4000/api/servicios/modificar/${id}`,
                serviceData
            );

            console.log("Service update response:", updateResponse.data);

            openSuccessNotification(
                `Servicio modificado exitosamente${fileList.length > 0 && fileList[0].originFileObj ? " con nueva imagen" : ""}`
            );
            setConfirmModal(false);
            setTimeout(() => navigate("/servicios"), 2000);
        } catch (error) {
            console.error("Error al modificar el servicio: ", error);
            openErrorNotification("Hubo un error al modificar el servicio");
            setConfirmModal(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAgregarCategoria = async () => {
        if (!nuevaCategoria.trim()) {
            openErrorNotification("Debes agregar un nombre a la categoría");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(
                "http://localhost:4000/api/servicios/categorias",
                {
                    nombre: nuevaCategoria,
                }
            );

            await fetchCategorias();

            setServicio((prevServicio) => ({
                ...prevServicio,
                categoria_id: response.data._id,
            }));
            setShowModal(false);
            setNuevaCategoria("");
        } catch (error) {
            console.error("Error al agregar la categoria:", error);
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
                openErrorNotification(
                    `Error del servidor: ${
                        error.response.data.message ||
                        "No se pudo agregar la categoría"
                    }`
                );
            } else {
                openErrorNotification("Error de conexión con el servidor.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Subir</div>
        </button>
    );

    return (
        <div>
            <AdminLayout>
                <div className="container main-container">
                    <div className="section-title text-center">
                        <h2>Modificar Servicio</h2>
                    </div>
                    <div className="mx-auto align-items-center justify-content-center d-flex">
                        <div className="col-xl-8">
                            {contextHolder}
                            <Form
                                onSubmit={handleSubmit}
                                className="servicio_form"
                            >
                                <div className="row">
                                    <div className="">
                                        <label
                                            htmlFor="nombre"
                                            className="form-label"
                                        >
                                            Nombre del servicio
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form_input"
                                            value={servicio.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="flex-grow-1">
                                            <label
                                                htmlFor="categoria_id"
                                                className="form-label"
                                            >
                                                Categoría del servicio
                                            </label>
                                            <div className="d-flex align-items-center gap-2">
                                                <Form.Select
                                                    name="categoria_id"
                                                    className="form_input"
                                                    value={
                                                        servicio.categoria_id
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">
                                                        Seleccione una categoría
                                                    </option>
                                                    {categorias.map((cat) => (
                                                        <option
                                                            key={cat._id}
                                                            value={cat._id}
                                                        >
                                                            {cat.nombre}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <button
                                                    type="button"
                                                    className="inline-btn btn-verde"
                                                    onClick={() =>
                                                        setShowModal(true)
                                                    }
                                                    disabled={isLoading}
                                                >
                                                    Nueva
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label
                                            className="form-label"
                                            htmlFor="descripcion"
                                        >
                                            Descripción
                                        </label>
                                        <textarea
                                            name="descripcion"
                                            className="form_input form-textarea"
                                            value={servicio.descripcion}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label
                                            className="form-label"
                                            htmlFor="imagenes"
                                        >
                                            Imagen del servicio (solo PNG o JPG)
                                        </label>
                                        <div className="mt-2">
                                            <Upload
                                                listType="picture-card"
                                                fileList={fileList}
                                                onPreview={handlePreview}
                                                onChange={handleImageChange}
                                                beforeUpload={(file) => {
                                                    const isJpgOrPng =
                                                        file.type ===
                                                            "image/jpeg" ||
                                                        file.type ===
                                                            "image/png";
                                                    if (!isJpgOrPng) {
                                                        openErrorNotification(
                                                            "Solo puedes subir archivos JPG o PNG"
                                                        );
                                                    }
                                                    return isJpgOrPng
                                                        ? false
                                                        : Upload.LIST_IGNORE;
                                                }}
                                                maxCount={1}
                                            >
                                                {fileList.length >= 1
                                                    ? null
                                                    : uploadButton}
                                            </Upload>
                                            {previewImage && (
                                                <Image
                                                    wrapperStyle={{
                                                        display: "none",
                                                    }}
                                                    preview={{
                                                        visible: previewOpen,
                                                        onVisibleChange: (
                                                            visible
                                                        ) =>
                                                            setPreviewOpen(
                                                                visible
                                                            ),
                                                        afterOpenChange: (
                                                            visible
                                                        ) =>
                                                            !visible &&
                                                            setPreviewImage(""),
                                                    }}
                                                    src={previewImage}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mt-3">
                                    <button
                                        type="submit"
                                        className="thm-btn form-btn"
                                        disabled={isLoading}
                                    >
                                        {isLoading
                                            ? "Procesando..."
                                            : "Modificar"}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Crear nueva categoría</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <label className="form-label">
                                Nombre de la nueva categoría
                            </label>
                            <input
                                type="text"
                                className="form_input"
                                value={nuevaCategoria}
                                onChange={(e) =>
                                    setNuevaCategoria(e.target.value)
                                }
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="thm-btn thm-btn-small btn-rojo"
                            onClick={() => setShowModal(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            className="thm-btn thm-btn-small"
                            onClick={handleAgregarCategoria}
                            disabled={isLoading}
                        >
                            {isLoading ? "Guardando..." : "Guardar"}
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={confirmModal}
                    onHide={() => !isLoading && setConfirmModal(false)}
                >
                    <Modal.Header closeButton={!isLoading}>
                        <Modal.Title>Confirmación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        ¿Está seguro que desea modificar este servicio?
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="thm-btn thm-btn-small btn-rojo"
                            onClick={() => setConfirmModal(false)}
                            disabled={isLoading}
                        >
                            No
                        </button>
                        <button
                            className="thm-btn thm-btn-small"
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? "Procesando..." : "Sí"}
                        </button>
                    </Modal.Footer>
                </Modal>
            </AdminLayout>
        </div>
    );
};

export default ModificarServicio;
