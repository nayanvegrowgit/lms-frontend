const [newbookData, setNewBookData] = useState({
  title: "",
  author: "",
  edition: 0,
  publisher: "",
  publication_date: "",
  genre: "",
  total: 0,
});

const [updatebookData, setUpdateBookData] = useState({
  title: "",
  author: "",
  publisher: "",
  publication_date: "",
  edition: parseInt("0"),
  genre: "",
});

/*

<>
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={(e) => {
          handleBookAddModalOpen();
          e.preventDefault();
        }}
      >
        Add
      </Button>
      <Modal
        open={addbookopen}
        onClose={handleBookAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            form: { margin: "10px 0" },
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            margin="10px 0"
          >
            Book Details:
          </Typography>
          <form
            onSubmit={(e) => {
              handleBookAddFormSubmit();
              handleBookAddModalClose();
              e.preventDefault();
            }}
          >
            <StyledFormRow>
              <TextField
                label="Title"
                name="title"
                value={newbookData.title}
                onChange={handleBookAddFormChange}
                fullWidth
                required
              />
            </StyledFormRow>
            <StyledFormRow>
              <TextField
                label="Author"
                name="author"
                value={newbookData.author}
                onChange={handleBookAddFormChange}
                fullWidth
              />
            </StyledFormRow>
            <StyledFormRow>
              <TextField
                label="Edition"
                name="edition"
                type="number"
                value={newbookData.edition}
                onChange={handleBookAddFormChange}
                fullWidth
                required
              />
            </StyledFormRow>
            <StyledFormRow>
              <TextField
                label="Publisher"
                name="publisher"
                value={newbookData.publisher}
                onChange={handleBookAddFormChange}
                fullWidth
              />
            </StyledFormRow>
            <StyledFormRow>
              <TextField
                label="Publication Date"
                name="publication_date"
                type="date"
                value={newbookData.publication_date}
                onChange={handleBookAddFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </StyledFormRow>
            <StyledFormRow>
              <TextField
                label="Genre"
                name="genre"
                value={newbookData.genre}
                onChange={handleBookAddFormChange}
                fullWidth
              />
            </StyledFormRow>
            <StyledFormRow>
              <TextField
                label="NumberOfCopies"
                name="total"
                value={newbookData.total}
                onChange={handleBookAddFormChange}
                fullWidth
              />
            </StyledFormRow>
            <StyledFormRow>
              <Button variant="contained" type="submit" color="primary">
                Add Book
              </Button>
            </StyledFormRow>
          </form>
        </Box>
      </Modal>
    </>*/
