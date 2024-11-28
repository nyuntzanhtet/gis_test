import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, FormHelperText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addCafe, updateCafe } from '../../features/cafesSlice';

const EditCafePage = (props) => {
  const {
    cafe: editCafe,
    handleCancel,
  } = props;
  const dispatch = useDispatch();
  const [cafe, setCafe] = useState(editCafe);
  const [logoFile, setLogoFile] = useState(null); // File for the logo
  const [logoPreview, setLogoPreview] = useState(null); // Preview of the uploaded logo
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCafe((prev) => ({ ...prev, [name]: value }));
    setIsEditing(true);
  };

  useEffect(() => {
    if (cafe.id && cafe.logo) {
      setLogoPreview(`data:image/png;base64,${cafe.logo}`);
    }
  }, []);

  const handleSubmit = async (e) => {
    const newErrors = {};
    if (!cafe.name) newErrors.name = 'Name is required';
    if (!cafe.description) newErrors.description = 'Description is required';
    if (!cafe.location) newErrors.location = 'Location is required';

    if (cafe.name && (cafe.name.length < 6 || cafe.name.length > 10)) {
      newErrors.name = 'Name must be between 6 and 10 characters';
    }

    // Description validation: maximum 256 characters
    if (cafe.description && (cafe.description.length > 256)) {
      newErrors.description = 'Description must be less than 256 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (logoFile) {
      await convertToBase64(logoFile);
    } else {
      if (cafe?.id) {
        await dispatch(updateCafe(cafe));
      } else {
        await dispatch(addCafe(cafe));
      }
      setLogoFile(null);
      setLogoPreview(null);
      setErrors({});
      handleCancel();
    }
  };

  const convertToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const newCafe = {
          ...cafe,
          logo: reader.result,
          isUploaded: true,
        }
        if (cafe?.id) {
          await dispatch(updateCafe(newCafe));
        } else {
          await dispatch(addCafe(newCafe));
        }
        setLogoFile(null);
        setLogoPreview(null);
        setErrors({});
        handleCancel();
        resolve()
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, logo: 'Logo file must be less than 2MB' }));
        setLogoFile(null);
        setLogoPreview(null);
        return;
      }

      setLogoFile(file); // Store the file
      setLogoPreview(URL.createObjectURL(file)); // Generate preview URL
      setErrors((prev) => ({
        ...prev,
        logo: null,
      }));
    }
  };

  const onNo = () => {
    setOpenDialog(false);
  };

  const onYes = () => {
    setOpenDialog(false);
    setIsEditing(false);
    handleCancel();
  }

  const handleClose = () => {
    if (isEditing) {
      setOpenDialog(true);
    } else {
      handleCancel();
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', mt: 5 }}>
      <TextField
        name="name"
        label="Name"
        value={cafe.name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        error={Boolean(errors.name)}
        helperText={errors.name}
      />
      <TextField
        name="description"
        label="Description"
        value={cafe.description}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        multiline
        rows={3}
        error={Boolean(errors.description)}
        helperText={errors.description}
      />
      <TextField
        name="location"
        label="Location"
        value={cafe.location}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        error={Boolean(errors.location)}
        helperText={errors.location}
      />
      <Box sx={{ mt: 2 }}>
        <input
          accept="image/*"
          id="logo-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="logo-upload">
          <Button variant="outlined" component="span">
            Upload Logo
          </Button>
        </label>
        {logoPreview && (
          <Box sx={{ mt: 2 }}>
            <p>Logo Preview:</p>
            <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
          </Box>
        )}
        {errors.logo && (
          <FormHelperText error>{errors.logo}</FormHelperText> // Show error if logo is invalid
        )}
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Discard Changes</DialogTitle>
        <DialogContent>
          Are you sure to discard your changes?
        </DialogContent>
        <DialogActions>
          <Button onClick={onNo} color="secondary">
            No
          </Button>
          <Button onClick={onYes} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditCafePage;
