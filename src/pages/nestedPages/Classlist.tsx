import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import app from '../../config/Firebaseconfig';

const database = getDatabase(app);

interface Class {
  id: string;
  name: string;
  teacher: string;
  schedule: string;
  capacity: number;
  description: string;
}

export default function ClassList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [detailClass, setDetailClass] = useState<Class | null>(null);

  useEffect(() => {
    const classesRef = ref(database, 'Classform');
    onValue(classesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const classList = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Class, 'id'>),
        }));
        setClasses(classList);
      }
    });
  }, []);

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
  };

  const handleSave = (id: string, updatedClass: Partial<Class>) => {
    const classRef = ref(database, `Classform/${id}`);
    update(classRef, updatedClass)
      .then(() => {
        setEditingClass(null);
        alert('Class updated successfully!');
      })
      .catch((error) => {
        alert('Error updating class: ' + error.message);
      });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      const classRef = ref(database, `Classform/${id}`);
      remove(classRef)
        .then(() => {
          alert('Class deleted successfully!');
        })
        .catch((error) => {
          alert('Error deleting class: ' + error.message);
        });
    }
  };

  const handleDetail = (cls: Class) => {
    setDetailClass(cls);
  };

  return (
    <Container>
      <Title>Existing Classes</Title>
      {classes.map((cls) => (
        <ClassItem key={cls.id}>
          {editingClass && editingClass.id === cls.id ? (
            <EditForm>
              <Input
                type="text"
                value={editingClass.name}
                onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
              />
              <Input
                type="text"
                value={editingClass.teacher}
                onChange={(e) => setEditingClass({ ...editingClass, teacher: e.target.value })}
              />
              <Input
                type="text"
                value={editingClass.schedule}
                onChange={(e) => setEditingClass({ ...editingClass, schedule: e.target.value })}
              />
              <Input
                type="number"
                value={editingClass.capacity}
                onChange={(e) => setEditingClass({ ...editingClass, capacity: parseInt(e.target.value) })}
              />
              <Button onClick={() => handleSave(cls.id, editingClass)}>Save</Button>
              <Button onClick={() => setEditingClass(null)}>Cancel</Button>
            </EditForm>
          ) : (
            <>
              <h3>{cls.name}</h3>
              <p>Teacher: {cls.teacher}</p>
              <p>Schedule: {cls.schedule}</p>
              <p>Capacity: {cls.capacity}</p>
              <ButtonGroup>
                <Button onClick={() => handleEdit(cls)}>Edit</Button>
                <Button onClick={() => handleDelete(cls.id)}>Delete</Button>
                <Button onClick={() => handleDetail(cls)}>Details</Button>
              </ButtonGroup>
            </>
          )}
        </ClassItem>
      ))}
      {detailClass && (
        <Modal>
          <ModalContent>
            <h2>{detailClass.name}</h2>
            <p>Teacher: {detailClass.teacher}</p>
            <p>Schedule: {detailClass.schedule}</p>
            <p>Capacity: {detailClass.capacity}</p>
            <p>Description: {detailClass.description}</p>
            <Button onClick={() => setDetailClass(null)}>Close</Button>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #1e90ff;
  margin-bottom: 2rem;
`;

const ClassItem = styled.div`
  background-color: white;
  border: 1px solid #87cefa;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;

  h3 {
    color: #1e90ff;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.25rem 0;
    color: #4169e1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
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
  gap: 0.5rem;
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
`;
