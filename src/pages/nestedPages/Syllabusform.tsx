import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import styled from 'styled-components';

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function SyllabusForm() {
  const [course, setCourse] = useState('');
  const [instructor, setInstructor] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState('');
  const [duration, setDuration] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [instructors, setInstructors] = useState<string[]>([]);

  const courseOptions = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English Literature',
    'History',
    'Geography',
    'Economics',
    'Psychology'
  ];

  useEffect(() => {
    const instructorsRef = ref(database, 'TeachersAddEdit');
    onValue(instructorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const instructorNames = Object.values(data).map((teacher: any) => teacher.name);
        setInstructors(instructorNames);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const syllabusRef = ref(database, 'Syllabus');
    push(syllabusRef, {
      course,
      instructor,
      description,
      topics: topics.split(',').map(topic => topic.trim()),
      duration
    }).then(() => {
      setSuccessMessage('Syllabus added successfully!');
      setCourse('');
      setInstructor('');
      setDescription('');
      setTopics('');
      setDuration('');
      setTimeout(() => setSuccessMessage(''), 3000);
    }).catch((error) => {
      console.error("Error adding syllabus: ", error);
    });
  };

  return (
    <Container>
      <Title>Syllabus Form</Title>
      <Form onSubmit={handleSubmit}>
        <Select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        >
          <option value="">Select Course</option>
          {courseOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </Select>
        <Select
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          required
        >
          <option value="">Select Instructor</option>
          {instructors.map((instructorName, index) => (
            <option key={index} value={instructorName}>{instructorName}</option>
          ))}
        </Select>
        <TextArea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Topics (comma-separated)"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Course Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <Button type="submit">Add Syllabus</Button>
      </Form>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  font-size: 16px;
  background-color: white;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #27ae60;
  }
`;

const SuccessMessage = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #2ecc71;
  color: white;
  border-radius: 5px;
  text-align: center;
`;