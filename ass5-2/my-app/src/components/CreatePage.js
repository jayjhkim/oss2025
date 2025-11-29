import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

function CreatePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [major, setMajor] = useState("");
  const [gender, setGender] = useState("");

  const nameRef = useRef();
  const ageRef = useRef();
  const majorRef = useRef();
  const genderRef = useRef();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return nameRef.current.focus();
    if (!age) return ageRef.current.focus();
    if (!major) return majorRef.current.focus();
    if (!gender) return genderRef.current.focus();

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age, major, gender })
    });

    navigate("/list");
  };

  return (
    <div>
      <h2>학생 추가</h2>

      <form onSubmit={handleSubmit}>
        <input ref={nameRef} className="form-control mb-2" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input ref={ageRef} className="form-control mb-2" placeholder="age" value={age} onChange={(e)=>setAge(e.target.value)} />
        <input ref={majorRef} className="form-control mb-2" placeholder="major" value={major} onChange={(e)=>setMajor(e.target.value)} />
        <input ref={genderRef} className="form-control mb-2" placeholder="gender" value={gender} onChange={(e)=>setGender(e.target.value)} />

        <button className="btn btn-primary">추가</button>
      </form>
    </div>
  );
}

export default CreatePage;
