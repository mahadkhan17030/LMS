import React, { useState } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, push } from 'firebase/database';
import app from '../../config/Firebaseconfig';

const database = getDatabase(app);

export default function ClassForm() {
  const [className, setClassName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [schedule, setSchedule] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const classesRef = ref(database, 'Classform');
    push(classesRef, {
      name: className,
      teacher,
      schedule,
      capacity: parseInt(capacity),
      description,
    }).then(() => {
      alert('Class added successfully!');
      clearForm();
    }).catch((error) => {
      alert('Error adding class: ' + error.message);
    });
  };

  const clearForm = () => {
    setClassName('');
    setTeacher('');
    setSchedule('');
    setCapacity('');
    setDescription('');
  };

  return (
    <Container>
      <Title>Add New Class</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="className">Class Name:</Label>
          <Input
            type="text"
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="teacher">Teacher:</Label>
          <Input
            type="text"
            id="teacher"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="schedule">Schedule:</Label>
          <Input
            type="text"
            id="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="capacity">Capacity:</Label>
          <Input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">Description:</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormGroup>
        <SubmitButton type="submit">Add Class</SubmitButton>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #1e90ff;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #4169e1;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #87cefa;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1e90ff;
  }
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #87cefa;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #1e90ff;
  }
`;

const SubmitButton = styled.button`
  background-color: #1e90ff;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4169e1;
  }
`;