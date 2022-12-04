import axios from 'axios';
// export const uploadImg = ev => {
//   //Defining our variables
//   const UPLOAD_PRESET = 'oxyhertz_7'; //insert yours
//   const CLOUD_NAME = 'oxyhertz'; //insert yours
//   const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
//   const FORM_DATA = new FormData();
//   //Building the request body
//   FORM_DATA.append('file', ev.target.files[0]); // form data kind of key : file, add the file we get
//   FORM_DATA.append('upload_preset', UPLOAD_PRESET); // add the upload_preset
//   //Sending a post method request to Cloudinary`s API
//   return fetch(UPLOAD_URL, {
//     // add the img to Cloudinary
//     method: 'POST',
//     body: FORM_DATA,
//   })
//     .then(res => res.json())
//     .then(res => res) //return the res
//     .catch(err => console.error(err));
// };

export const uploadImg = async file => {
  //gets the file and upload it to cloudinary
  // Defining our variables
  const UPLOAD_PRESET = 'ssrtedsh'; // Insert yours
  const CLOUD_NAME = 'dkqvblbeq'; // Insert yours
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const FORM_DATA = new FormData();
  // Building the request body
  FORM_DATA.append('file', file);
  FORM_DATA.append('upload_preset', UPLOAD_PRESET);
  // Sending a post method request to Cloudniarys' API
  try {
    const res = await axios.post(UPLOAD_URL, FORM_DATA);
    return res.data;
  } catch (err) {
    console.error('ERROR!', err);
  }
};
