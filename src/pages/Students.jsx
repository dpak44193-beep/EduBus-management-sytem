import { useEffect, useState } from "react";
import { getStudents, addStudent } from "../api/studentApi";


export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  return (
    <div>
      <h2>Students List</h2>

      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        students.map((s, index) => (
          <div key={index}>
            <p>Name: {s.name}</p>
            <p>Bus: {s.bus}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    busNo: ""
  });

  // GET DATA
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getStudents();
    setStudents(res.data);
  };

  // ADD DATA
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addStudent(form);
    loadData();
  };

  return (
    <div>
      <h2>Students</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          placeholder="Bus No"
          onChange={(e) =>
            setForm({ ...form, busNo: e.target.value })
          }
        />
        <button type="submit">Add</button>
      </form>

      {/* LIST */}
      {students.map((s) => (
        <div key={s._id}>
          {s.name} - {s.busNo}
        </div>
      ))}
    </div>
  );
}