import React, {useState} from "react";

const BASE="https://69186ccb21a96359486ffe56.mockapi.io/students";

function ShowList() {
    const[students, setStudents] = useState([]);

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [major, setMajor] = useState("");
    const [gender, setGender] = useState("");

    const [updateId, setUpdateId] = useState("");
    const [updateName, setUpdateName] = useState("");
    const [updateAge, setUpdateAge] = useState("");
    const [updateMajor, setUpdateMajor] = useState("");
    const [updateGender, setUpdateGender] = useState("");
    
    const [deleteId, setDeleteId] = useState("");

    const getStudents=async()=>{
        const res=await fetch(BASE);
        const data=await res.json();
        setStudents(data);
    };

    const addStudent = async () => {
        if (!name || !age || !major || !gender) {
            alert("모든 항목을 입력하세요.");
            return;
        }

        await fetch(BASE, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name,
                age,
                major,
                gender,
            }),
        });

        setName("");
        setAge("");
        setMajor("");
        setGender("");

        getStudents();
    };

    const updateStudent = async () => {
        if (!updateId) {
            alert("id를 입력하세요.");
            return;
        }

        const updateData = {};

        if (updateName) updateData.name = updateName;
        if (updateAge) updateData.age = updateAge;
        if (updateMajor) updateData.major = updateMajor;
        if (updateGender) updateData.gender = updateGender;

        if (Object.keys(updateData).length === 0) {
            alert("수정할 값을 입력하세요.");
            return;
        }

        await fetch(`${BASE}/${updateId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updateData),
        });

        getStudents();
    };

    const deleteStudent = async () => {
        //console.log("delete ok");

        if (!deleteId) {
            alert("삭제할 id를 입력하세요.");
            return;
        }

        await fetch(`${BASE}/${deleteId}`, {
            method: "DELETE",
        });

        setDeleteId("");
        getStudents();
    };

    return (
        <div className="container" style={{padding: "20px"}}>
            <h2 className="mb-3">학생 데이터 관리 페이지</h2>
            <button className="btn btn-primary mb-3" onClick={getStudents}>학생 데이터 불러오기</button>

            <ul>
                {students.map((student)=>(
                    <li key={student.id}>
                        {student.id}. {student.name} (age: {student.age}, major: {student.major}, gender:{" "} {student.gender})
                    </li>
                ))}
            </ul>

            <hr/>

            <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addModal">학생데이터 추가</button>
            <button className="btn btn-primary mb-3 ms-2" data-bs-toggle="modal" data-bs-target="#updateModal">학생데이터 수정</button>

            <hr/>

            <h6>학생데이터 삭제</h6>

            <input className="form-control w-25 d-inline" placeholder="id" value={deleteId} onChange={(e) => setDeleteId(e.target.value)}/>

            <button className="btn btn-primary ms-2" onClick={deleteStudent}>학생데이터 삭제</button>

            <div className="modal fade" id="addModal">
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">학생데이터 추가</h5>
                    <button className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div className="modal-body">
                    <input className="form-control mb-2" placeholder="name" value={name} onChange={(e) => setName(e.target.value)}/>
                    <input className="form-control mb-2" placeholder="age" value={age} onChange={(e) => setAge(e.target.value)}/>
                    <input className="form-control mb-2" placeholder="major" value={major} onChange={(e) => setMajor(e.target.value)}/>
                    <input className="form-control mb-2" placeholder="gender" value={gender} onChange={(e) => setGender(e.target.value)}/>
                    </div>

                    <div className="modal-footer">
                    <button className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                    <button className="btn btn-primary" data-bs-dismiss="modal" onClick={addStudent}>추가</button>
                    </div>
                </div>
                </div>
            </div>

            <div className="modal fade" id="updateModal">
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">학생데이터 수정</h5>
                    <button className="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div className="modal-body">
                    <input className="form-control mb-2" placeholder="id" value={updateId} onChange={(e) => setUpdateId(e.target.value)}/>
                    <input className="form-control mb-2" placeholder="new name" value={updateName} onChange={(e) => setUpdateName(e.target.value)}/>
                    <input className="form-control mb-2" placeholder="new age" value={updateAge} onChange={(e) => setUpdateAge(e.target.value)}/>
                    <input className="form-control mb-2" placeholder="new major" value={updateMajor} onChange={(e) => setUpdateMajor(e.target.value)}/>
                    <input className="form-control mb-2" placeholder="new gender" value={updateGender} onChange={(e) => setUpdateGender(e.target.value)}/>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                    <button className="btn btn-primary" data-bs-dismiss="modal" onClick={updateStudent}>수정</button>
                </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default ShowList;