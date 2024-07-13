import React, { useState } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, push } from 'firebase/database';
import app from '../../config/Firebaseconfig';

const database = getDatabase(app);

const SubjectAddEdit: React.FC = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectRef = ref(database, 'SubjectAddEdit');
    push(subjectRef, {
      name,
      code,
      description,
      credits: parseInt(credits),
      department
    }).then(() => {
      alert('Subject added successfully!');
      clearForm();
    }).catch((error) => {
      alert('Error adding subject: ' + error.message);
    });
  };

  const clearForm = () => {
    setName('');
    setCode('');
    setDescription('');
    setCredits('');
    setDepartment('');
  };

  return (
    <Container>
      <Title>Add New Subject</Title>
      <Form onSubmit={handleSubmit}>
        <FormRow>
          <InputGroup>
            <Label htmlFor="name">Subject Name:</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="code">Subject Code:</Label>
            <Input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <Label htmlFor="description">Description:</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <Label htmlFor="credits">Credits:</Label>
            <Input
              type="number"
              id="credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              required
            />
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
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </Select>
          </InputGroup>
        </FormRow>
        <SubmitButton type="submit">Add Subject</SubmitButton>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  background-color: #f0f8ff;
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  margin: 2rem auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #1e90ff;
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
  color: #1e90ff;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #87cefa;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #1e90ff;
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #87cefa;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: #1e90ff;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #87cefa;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #1e90ff;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: #1e90ff;
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
    background-color: #4169e1;
  }
`;

export default SubjectAddEdit;