import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove, update } from 'firebase/database';
import styled from 'styled-components';

const firebaseConfig = {
  apiKey: "AIzaSyB0oDfjQY_7SToBfMjHUybvOXjltA1HgFY",
  authDomain: "software-lms-cada3.firebaseapp.com",
  databaseURL: "https://software-lms-cada3-default-rtdb.firebaseio.com",
  projectId: "software-lms-cada3",
  storageBucket: "software-lms-cada3.appspot.com",
  messagingSenderId: "595895974186",
  appId: "1:595895974186:web:f944bd9f8d7dd663ce0653",
  measurementId: "G-ZYJ18KKD7Z"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  fatherName: string;
  fatherPhone: string;
  cnic: string;
}

const Registration: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [cnic, setCnic] = useState('');

  useEffect(() => {
    const studentsRef = ref(database, 'Registration');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentsArray = Object.entries(data).flatMap(([gradeKey, gradeStudents]: [string, any]) =>
          Object.entries(gradeStudents).map(([id, student]: [string, any]) => ({
            id,
            ...student,
            grade: gradeKey
          }))
        );
        setStudents(studentsArray);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentsRef = ref(database, `Registration/${grade}`);
    push(studentsRef, {
      name,
      age: parseInt(age),
      grade,
      fatherName,
      fatherPhone,
      cnic
    });
    setName('');
    setAge('');
    setGrade('');
    setFatherName('');
    setFatherPhone('');
    setCnic('');
  };

  const handleEdit = (student: Student) => {
    const updatedStudent = {
      name: prompt('Enter new name', student.name) || student.name,
      age: parseInt(prompt('Enter new age', student.age.toString()) || student.age.toString()),
      grade: prompt('Enter new grade', student.grade) || student.grade,
      fatherName: prompt('Enter new father\'s name', student.fatherName) || student.fatherName,
      fatherPhone: prompt('Enter new father\'s phone', student.fatherPhone) || student.fatherPhone,
      cnic: prompt('Enter new CNIC', student.cnic) || student.cnic
    };
    const studentRef = ref(database, `Registration/${student.grade}/${student.id}`);
    update(studentRef, updatedStudent);
  };

  const handleDelete = (student: Student) => {
    const studentRef = ref(database, `Registration/${student.grade}/${student.id}`);
    remove(studentRef);
  };

  return (
    <Container>
      <h1>Student Registration</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Father's Name"
          value={fatherName}
          onChange={(e) => setFatherName(e.target.value)}
          required
        />
        <Input
          type="tel"
          placeholder="Father's Phone"
          value={fatherPhone}
          onChange={(e) => setFatherPhone(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="CNIC"
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
          required
        />
        <Button type="submit">Add Student</Button>
      </Form>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Age</Th>
            <Th>Grade</Th>
            <Th>Father's Name</Th>
            <Th>Father's Phone</Th>
            <Th>CNIC</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <Td>{student.name}</Td>
              <Td>{student.age}</Td>
              <Td>{student.grade}</Td>
              <Td>{student.fatherName}</Td>
              <Td>{student.fatherPhone}</Td>
              <Td>{student.cnic}</Td>
              <Td>
                <ActionButton onClick={() => handleEdit(student)}>Edit</ActionButton>
                <ActionButton onClick={() => handleDelete(student)}>Delete</ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const ActionButton = styled(Button)`
  padding: 5px 10px;
  font-size: 14px;
  margin-right: 5px;
`;

export default Registration;