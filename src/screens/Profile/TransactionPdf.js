import { pick, types } from '@react-native-documents/picker';
import axios from 'axios';
import { baseurl } from '../../assets/constants/baseurl';
import { Platform } from 'react-native';
import { supabase } from '../../lib/supabase';

export const SelectFile = async () => {
  try {
    const [pickResult] = await pick({
      type: [types.pdf],
    });
    return pickResult;
  } catch (err) {
    // picker dismiss error is not a real error, so we can ignore it
    if (err.code === 'DOCUMENT_PICKER_CANCELED') {
      return null;
    }
    console.error('File selection error:', err);
    return null;
  }
};

const prepareFormData = (file, password) => {
  const formData = new FormData();

  formData.append('pdf', {
    name: file.name,
    type: file.type,
    uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
  });

  // Append the password only if it's provided
  if (password) {
    formData.append('password', password);
  }

  return formData;
};

const uploadFile = async (formData, token) => {
  try {
    const response = await axios.post(
      `${baseurl}/finance/extract-transactions`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);

    if (error.response) {
      // The server responded with a status code outside the 2xx range
      let detail = error.response.data?.detail || 'An unknown server error occurred.';

      // **FIX:** Check for the specific duplicate transaction error string from the backend.
      if (typeof detail === 'string' && detail.includes('duplicate key value violates unique constraint')) {
        // Replace the raw database error with a user-friendly message.
        detail = 'Upload failed. This file contains transactions that have already been recorded.';
      }

      throw new Error(detail);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      throw new Error(error.message);
    }
  }
};

export const handleUpload = async (pickedFile, password) => {
  if (!pickedFile) {
    return { success: false, message: 'No file selected.' };
  }

  const formData = prepareFormData(pickedFile, password);

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Supabase session error:", error.message);
      return { success: false, message: 'Authentication session error.' };
    }

    const access_token = data?.session?.access_token;
    if (!access_token) {
        return { success: false, message: 'Not authenticated. Please sign in again.' };
    }

    const result = await uploadFile(formData, access_token);
    console.log('Transactions extracted:', result.transactions.length);

    return { success: true, message: `${result.transactions.length} transactions uploaded successfully!` };
  } catch (err) {
    // The specific error message from uploadFile's catch block is used here
    console.error('Error uploading file:', err.message);
    return { success: false, message: err.message };
  }
};