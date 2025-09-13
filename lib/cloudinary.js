// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file, folder = 'general') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `poppy-pie/${folder}`,
      quality: 'auto:best',
      fetch_format: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// New utility functions for the frontend
export const uploadImageFile = async (file, folder = 'general', resize = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    if (resize) {
      formData.append('resize', resize);
    }

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload image');
    }

    return data.data;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

export const deleteImageFile = async (publicId) => {
  try {
    const response = await fetch(`/api/upload/image?publicId=${publicId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete image');
    }

    return data;
  } catch (error) {
    console.error('Image deletion error:', error);
    throw new Error(error.message || 'Failed to delete image');
  }
};

export const getImageInfo = async (publicId) => {
  try {
    const response = await fetch(`/api/upload/image?publicId=${publicId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get image info');
    }

    return data.data;
  } catch (error) {
    console.error('Image info error:', error);
    throw new Error(error.message || 'Failed to get image info');
  }
};

export const listImagesInFolder = async (folder) => {
  try {
    const response = await fetch(`/api/upload/image?folder=${folder}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to list images');
    }

    return data.data;
  } catch (error) {
    console.error('Images listing error:', error);
    throw new Error(error.message || 'Failed to list images');
  }
};

export default cloudinary;