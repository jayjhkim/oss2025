import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../api";

function DetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(data => setStudent(data));
  }, [id]);

  if (!student) return <p>Loading...</p>;

  return (
    <div>
      <h2>학생 세부 정보</h2>
      <p><strong>ID:</strong> {student.id}</p>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Age:</strong> {student.age}</p>
      <p><strong>Major:</strong> {student.major}</p>
      <p><strong>Gender:</strong> {student.gender}</p>

      <Link className="btn btn-primary" to={`/update/${id}`}>수정</Link>
      <Link className="btn btn-primary ms-2" to="/list">목록</Link>
    </div>
  );
}

export default DetailPage;
