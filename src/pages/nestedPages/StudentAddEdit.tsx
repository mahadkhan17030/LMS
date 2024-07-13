import React, { useState } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, push } from 'firebase/database';
import app from '../../config/Firebaseconfig';

const database = getDatabase(app);

const StudentAddEdit: React.FC = () => {
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [studentId, setStudentId] = useState('');
  const [shift, setShift] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentRef = ref(database, 'StudentsaddEdit');
    push(studentRef, {
      name,
      fatherName,
      email,
      age: parseInt(age),
      classLevel,
      studentId,
      shift,
      gender
    }).then(() => {
      alert('Student added successfully!');
      clearForm();
    }).catch((error) => {
      alert('Error adding student: ' + error.message);
    });
  };

  const clearForm = () => {
    setName('');
    setFatherName('');
    setEmail('');
    setAge('');
    setClassLevel('');
    setStudentId('');
    setShift('');
    setGender('');
  };

  return (
    <Container>
      <Title>Add New Student</Title>
      <Form onSubmit={handleSubmit}>
        <FormRow>
          <InputGroup>
            <Label htmlFor="name">Name:</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="fatherName">Father's Name:</Label>
            <Input
              type="text"
              id="fatherName"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              required
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <Label htmlFor="email">Email:</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="age">Age:</Label>
            <Input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <Label htmlFor="classLevel">Class:</Label>
            <Select
              id="classLevel"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              required
            >
              <option value="">Select Class</option>
              <option value="Prep">Prep</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10 (Matric)">10 (Matric)</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label htmlFor="studentId">Student ID:</Label>
            <Input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <Label htmlFor="shift">Shift:</Label>
            <Select
              id="shift"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              required
            >
              <option value="">Select Shift</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label htmlFor="gender">Gender:</Label>
            <Select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </InputGroup>
        </FormRow>
        <SubmitButton type="submit">Add Student</SubmitButton>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  margin: 2rem auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #054bb4;
  font-size: 2.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InputGroup = styled.div`
  flex: 1;
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
  }

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #054bb4;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #054bb4;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #054bb4;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: #054bb4;
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #043584;
  }
`;

export default StudentAddEdit;