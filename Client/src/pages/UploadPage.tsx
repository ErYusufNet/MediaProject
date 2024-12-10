import React, { useState } from 'react';
import '../assets/styles/uploadpage.css';
import { Label } from "@fluentui/react-components";
import axios from 'axios';

function UploadPage() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setUploadedFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert("Please upload an image.");
      return;
    }

    const body = new FormData();

    body.append('name', name);
    body.append('desc', desc);
    body.append('file', file);
    body.append('installer', localStorage.getItem('user') as string);

    try {
      const response = await axios.post('http://localhost:8000/tasks/create-task', body)
      alert(response.data.message);
    } catch {
      alert("An unexpected error has occurred.");
    }
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {

      setUploadedFile(event.target.files[0]);
    }
  };

  return (
    <div className='uploadholder'>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Name and Description</legend>
          <Label htmlFor='media-name'>Media's name</Label>
          <input id='media-name' type='text' onChange={(e) => setName(e.target.value)} maxLength={30} required />

          <Label htmlFor='media-description'>Description</Label>
          <textarea id='media-description' onChange={(e) => setDesc(e.target.value)} maxLength={300} required></textarea>
        </fieldset>

        <fieldset>
          <legend>Upload Media</legend>

          <Label htmlFor="file">Upload File</Label>
          <input
            id="file"
            name="media"
            type="file"
            accept="image/png, image/jpeg, video/mp4, video/mov"
            onChange={onImageChange}
            required
          />
          {file?.type.includes("image") ? <img src={URL.createObjectURL(file)} alt="preview image" className='file' /> : file?.type.includes("video") ? <video autoPlay={true} muted playsInline src={URL.createObjectURL(file)} id="video" width="800" height="600" ></video> : ""}
        </fieldset>

        <input type='submit' value="Upload" />
      </form>
    </div>
  )
}

export default UploadPage;
