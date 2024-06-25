import React, { useState } from "react";

export default function LibrarianRegisration() {
  const [formData, setFormData] = useState(new FormData());

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      prevData.append(name, value);
      return prevData;
    });
  };

  const handleFileChange = (event) => {
    setFormData((prevData) => {
      prevData.append("file", event.target.files[0]);
      return prevData;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/submit-form", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      // Handle successful response
    } else {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        onChange={handleChange}
        placeholder="Email"
      />
      <input type="file" name="file" onChange={handleFileChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
