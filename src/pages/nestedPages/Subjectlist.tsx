import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import app from '../../config/Firebaseconfig';

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  department: string;
}

const Subjectlist: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  useEffect(() => {
    const db = getDatabase(app);
    const subjectsRef = ref(db, 'SubjectAddEdit');

    onValue(subjectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const subjectList = Object.entries(data).map(([id, subject]) => ({
          id,
          ...(subject as Omit<Subject, 'id'>),
        }));
        setSubjects(subjectList);
      } else {
        setSubjects([]);
      }
    });
  }, []);

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      const db = getDatabase(app);
      const subjectRef = ref(db, `SubjectAddEdit/${id}`);
      remove(subjectRef);
    }
  };

  const handleSave = (id: string, updatedSubject: Partial<Subject>) => {
    const db = getDatabase(app);
    const subjectRef = ref(db, `SubjectAddEdit/${id}`);
    update(subjectRef, updatedSubject);
    setEditingSubject(null);
  };

  return (
    <Container>
      <Title>Subject List</Title>
      {subjects.length === 0 ? (
        <NoSubjects>No subjects found.</NoSubjects>
      ) : (
        subjects.map((subject) => (
          <SubjectCard key={subject.id}>
            {editingSubject?.id === subject.id ? (
              <EditForm>
                <Input
                  value={editingSubject.name}
                  onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                />
                <Input
                  value={editingSubject.code}
                  onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                />
                <TextArea
                  value={editingSubject.description}
                  onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                />
                <Input
                  type="number"
                  value={editingSubject.credits}
                  onChange={(e) => setEditingSubject({ ...editingSubject, credits: parseInt(e.target.value) })}
                />
                <Input
                  value={editingSubject.department}
                  onChange={(e) => setEditingSubject({ ...editingSubject, department: e.target.value })}
                />
                <Button onClick={() => handleSave(subject.id, editingSubject)}>Save</Button>
                <Button onClick={() => setEditingSubject(null)}>Cancel</Button>
              </EditForm>
            ) : (
              <>
                <SubjectInfo>
                  <h2>{subject.name}</h2>
                  <p><strong>Code:</strong> {subject.code}</p>
                  <p><strong>Description:</strong> {subject.description}</p>
                  <p><strong>Credits:</strong> {subject.credits}</p>
                  <p><strong>Department:</strong> {subject.department}</p>
                </SubjectInfo>
                <ButtonGroup>
                  <Button onClick={() => handleEdit(subject)}>Edit</Button>
                  <Button onClick={() => handleDelete(subject.id)}>Delete</Button>
                </ButtonGroup>
              </>
            )}
          </SubjectCard>
        ))
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #1e90ff;
  margin-bottom: 2rem;
`;

const NoSubjects = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const SubjectCard = styled.div`
  background-color: #f0f8ff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SubjectInfo = styled.div`
  margin-bottom: 1rem;

  h2 {
    color: #1e90ff;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.25rem 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  background-color: #1e90ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4169e1;
  }
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
`;

export default Subjectlist;