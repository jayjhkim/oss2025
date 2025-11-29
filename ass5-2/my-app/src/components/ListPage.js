import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

function ListPage() {
  const [students, setStudents] = useState([]);

  const fetchData = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteStudent = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div>
      <h1>학생데이터 관리</h1>
      <Link className="btn btn-primary mb-3" to="/create">학생 추가</Link>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Age</th><th>Major</th><th>Gender</th><th>Function</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>
                <Link to={`/detail/${s.id}`}>{s.name}</Link>
              </td>
              <td>{s.age}</td>
              <td>{s.major}</td>
              <td>{s.gender}</td>
              <td>
                <Link className="btn btn-primary mb-3 me-1" to={`/update/${s.id}`}>수정</Link>
                <button className="btn btn-primary mb-3" onClick={() => deleteStudent(s.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default ListPage;
