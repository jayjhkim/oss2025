import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

function UpdatePage() {
  const { id } = useParams();
  const [student, setStudent] = useState({});
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(data => setStudent(data));
  }, [id]);

  const updateField = (field, value) => {
    const updated = { ...student, [field]: value };
    setStudent(updated);

    setCount(c => c + 1);

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  };

  if (!student.id) return <p>Loading...</p>;

  return (
    <div>
      <h2>학생 수정(총 수정 횟수: {count}회)</h2>
      <input className="form-control mb-2" value={student.name} onChange={(e)=>updateField("name", e.target.value)} />
      <input className="form-control mb-2" value={student.age} onChange={(e)=>updateField("age", e.target.value)} />
      <input className="form-control mb-2" value={student.major} onChange={(e)=>updateField("major", e.target.value)} />
      <input className="form-control mb-2" value={student.gender} onChange={(e)=>updateField("gender", e.target.value)} />
    </div>
  );
}

export default UpdatePage;
