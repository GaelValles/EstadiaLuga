import Permiso from "../models/permiso.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";
import { deleteFile, uploadFoto } from "../libs/cloudinary.js";
cloudinary.config({
  cloud_name: "dftu2fjzj",
  api_key: "946929268796721",
  api_secret: "mQ0AiZEdxcmd7RLyhOB2KclWHQA",
  secured: true,
});
//Obtener todos los permisos
export const getPermisos = async (req, res) => {
    try {
      const permisos = await Permiso.find({user:req.user.id}).populate('user');
      res.json(permisos);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener los permisos",
        error,
      });
    }
  };
  
  export const getPermisoFile = async (req, res) => {
    try {
      const permiso = await Permiso.findById(req.params.id);
      if (!permiso) {
        return res.status(404).json({ message: 'Permiso no encontrado.' });
      }
  
      if (!permiso.foto || !permiso.foto.public_id) {
        return res.status(404).json({ message: 'Archivo no encontrado.' });
      }
  
      const resource = await cloudinary.api.resource(permiso.foto.public_id);
      const fileData = {
        name: permiso.titulo,
        url: resource.secure_url,
        format: resource.format
      };
  
      res.json(fileData);
    } catch (error) {
      console.error("Error al obtener archivo del permiso:", error);
      res.status(500).json({ message: 'Error al obtener archivo del permiso.' });
    }
  };

//Crear un permiso
export const postPermiso = async (req, res) => {
      const { titulo, fechaFinal, descripcion, avisoAntelacion } = req.body;  
  try {
    console.log(req)
      const newPermiso = new Permiso({ titulo, fechaFinal, descripcion, avisoAntelacion, status: true, user: req.user.id, userEmail: req.user.email  });

      if (req.files?.foto) {
        const result = await uploadFoto(req.files.foto.tempFilePath)
        newPermiso.foto = {
          public_id: result.public_id,
          secure_url: result.secure_url
        }
        await fs.unlink(req.files.foto.tempFilePath)
      }

      const savedPermiso = await newPermiso.save();
      res.json(savedPermiso);
      console.log(savedPermiso);
      console.log(savedPermiso)
    } catch (error) {
      return res.status(500).json({
        message: "Error al crear el permiso",
        error,
      });
    }
};
  
//Obtener solo un permiso por id
export const getPermiso = async (req, res) => {
    try {
      const permiso = await Permiso.findById(req.params.id);
      if (!permiso) {
        return res.status(404).json({ message: "Permiso no encontrado" });
      }
      res.json(permiso);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener el permiso",
        error,
      });
    }
};

export const updatePermiso = async (req, res, next) => {
  try {
    const permisoActual = await Permiso.findById(req.params.id);

    if (!permisoActual) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    const { titulo, fechaFinal, descripcion, avisoAntelacion } = req.body;
    const data = {
      titulo,
      fechaFinal,
      descripcion,
      avisoAntelacion,
    };

    console.log("Este es el permiso original", permisoActual);
    console.log("Datos recibidos:", data);

    if (req.files && req.files.foto) {
      const imgId = permisoActual.foto?.public_id;
      if (imgId) {
        await deleteFile(imgId);
      }

      const newImage = await uploadFoto(req.files.foto.tempFilePath);
      data.foto = {
        public_id: newImage.public_id,
        secure_url: newImage.secure_url
      };

      await fs.unlink(req.files.foto.tempFilePath); // Eliminar el archivo temporal
    }

    console.log("Datos que se van a actualizar:", data);

    const permisoUpdated = await Permiso.findByIdAndUpdate(req.params.id, data, { new: true });

    return res.status(200).json(permisoUpdated);

  } catch (error) {
    console.error("Error al actualizar el permiso:", error);
    res.status(500).json({
      message: "Error al actualizar el permiso",
      error,
    });
    next(error);
  }
};

  //Eliminar un permiso por id
  export const deletePermiso = async (req, res) => {
    try {
      const permiso = await Permiso.findByIdAndDelete(req.params.id);
  
      if (!permiso)
        return res.status(404).json({ message: "Permiso no encontrado" });
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({
        message: "Error al eliminar el documento",
        error,
      });
    }
  };
  
//Cambiar status en el permiso
export const cambioStatus = async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body;
      const permiso = await Permiso.findByIdAndUpdate(id, {
          status: status,
      }, { new: true });

      if (!permiso) {
          return res.status(404).json({ message: "Permiso no encontrado" });
      }

      res.status(200).json({ message: "Cambio de status", permiso });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al realizar el cambio de status" });
  }
};