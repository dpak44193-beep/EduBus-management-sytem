import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  busNo: {
    type: String,
    required: true
  },
  route: {
    type: String
  }
});

const Student = mongoose.model("Student", studentSchema);

export default Student;