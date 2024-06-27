import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const UpdateBookForm = ({ initialBookData }) => {
  const [bookData, setBookData] = useState(initialBookData);

  const handleFormChange = (event) => {
    setBookData({ ...bookData, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Implement logic to submit updated book data (e.g., using an API call)
    console.log("Submitting updated book data:", bookData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <TextField
        label="Title"
        name="title"
        value={bookData?.title}
        onChange={handleFormChange}
        fullWidth
        required
      />
      <TextField
        label="Author"
        name="author"
        value={bookData?.author}
        onChange={handleFormChange}
        fullWidth
      />
      <TextField
        label="Edition"
        name="edition"
        type="number"
        value={bookData?.edition}
        onChange={handleFormChange}
        fullWidth
        required
      />
      <TextField
        label="Publisher"
        name="publisher"
        value={bookData?.publisher}
        onChange={handleFormChange}
        fullWidth
      />
      <TextField
        label="Publication Date"
        name="publicationDate"
        type="date"
        value={bookData?.publication_date}
        onChange={handleFormChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Genre"
        name="genre"
        value={bookData?.genre}
        onChange={handleFormChange}
        fullWidth
      />
      <Button variant="contained" type="submit" color="primary">
        Update Book
      </Button>
    </form>
  );
};

export default UpdateBookForm;
