import React, { useState } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, push } from 'firebase/database';
import app from '../../config/Firebaseconfig';

const database = getDatabase(app);

const TeacherAddEdit: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacherRef = ref(database, 'TeachersAddEdit');
    push(teacherRef, {
      name,
      email,
      phone,
      subject,
      qualification,
      experience: parseInt(experience),
      teacherId,
      department
    }).then(() => {
      alert('Teacher added successfully!');
      clearForm();
    }).catch((error) => {
      alert('Error adding teacher: ' + error.message);
    });
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setQualification('');
    setExperience('');
    setTeacherId('');
    setDepartment('');
  };

  const generateTeacherId = () => {
    const prefix = 'TCH';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setTeacherId(`${prefix}${randomNum}`);
  };

  const handleQualificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQualification(e.target.value);
    // You could add logic here to set a default subject based on qualification
  };

  return (
    <Container>
      <Title>Add New Teacher</Title>
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
            <Label htmlFor="email">Email:</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <Label htmlFor="phone">Phone:</Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="subject">Subject:</Label>
            <Input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <Label htmlFor="qualification">Qualification:</Label>
            <Select
              id="qualification"
              value={qualification}
              onChange={handleQualificationChange}
              required
            >
              <option value="">Select Qualification</option>
              <option value="Matric">Matric</option>
              <option value="Inter">Inter</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label htmlFor="experience">Years of Experience:</Label>
            <Input
              type="number"
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <Label htmlFor="teacherId">Teacher ID:</Label>
            <Input
              type="text"
              id="teacherId"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              required
            />
            <GenerateButton type="button" onClick={generateTeacherId}>Generate ID</GenerateButton>
          </InputGroup>
          <InputGroup>
            <Label htmlFor="department">Department:</Label>
            <Select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Social Studies">Social Studies</option>
            </Select>
          </InputGroup>
        </FormRow>
        <SubmitButton type="submit">Add Teacher</SubmitButton>
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

const GenerateButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background-color: #218838;
  }
`;

export default TeacherAddEdit;