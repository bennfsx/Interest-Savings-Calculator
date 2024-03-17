import React, { useState, useEffect } from "react";
import styles from "./Table.module.css";
import TableStyle from 'react-bootstrap/Table';
import LoadingAnimation from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editedTag, setEditedTag] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.airtable.com/v0/appETAOnMCK006o6N/InterestCalculator', {
          headers: {
            Authorization: 'Bearer patvMJsFSeycxRJiT.0a334de1aedd5f7ff42ce8d7db915df4c27917c34bc79c7805b1ccdaff50484b'
          }
        });
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData.records);
        } else {
          console.error('Failed to fetch data from Airtable:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data from Airtable:', error.message);
      } finally {
        setLoading(false); // Set loading state to false when data fetching is completed
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://api.airtable.com/v0/appETAOnMCK006o6N/InterestCalculator/${selectedRecord.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer patvMJsFSeycxRJiT.0a334de1aedd5f7ff42ce8d7db915df4c27917c34bc79c7805b1ccdaff50484b'
        }
      });
      if (response.ok) {
        console.log('Record deleted successfully');
        // Refresh data after deletion
        const updatedData = data.filter(record => record.id !== selectedRecord.id);
        setData(updatedData);
      } else {
        console.error('Failed to delete record:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting record:', error.message);
    } finally {
      setShowConfirmation(false);
      setSelectedRecord(null);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setSelectedRecord(null);
  };

  const handleConfirmationShow = (record) => {
    setSelectedRecord(record);
    setShowConfirmation(true);
  };

  const handleEditTag = (record) => {
    setEditedTag(record.fields.tag);
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  const handleSaveTag = async () => {
    try {
      const response = await fetch(`https://api.airtable.com/v0/appETAOnMCK006o6N/InterestCalculator/${selectedRecord.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer patvMJsFSeycxRJiT.0a334de1aedd5f7ff42ce8d7db915df4c27917c34bc79c7805b1ccdaff50484b',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            tag: editedTag
          }
        })
      });
      if (response.ok) {
        console.log('Tag updated successfully');
        const updatedData = data.map(record => {
          if (record.id === selectedRecord.id) {
            return {
              ...record,
              fields: {
                ...record.fields,
                tag: editedTag
              }
            };
          }
          return record;
        });
        setData(updatedData);
      } else {
        console.error('Failed to update tag:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating tag:', error.message);
    } finally {
      setEditedTag("");
      setShowEditModal(false);
      setSelectedRecord(null);
    }
  };

  const handleTagChange = (event) => {
    setEditedTag(event.target.value);
  };

  return (
    <div className={styles.tableContainer}>
      {loading ? (
        <LoadingAnimation animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </LoadingAnimation>
      ) : (
        <TableStyle striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Current Account Balance</th>
              <th>Annual Amount</th>
              <th>Monthly Amount</th>
              <th>After 1 Year (APY)</th>
              <th>Tag</th>
              <th>Edit Tag</th>
              <th>Delete Row</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{record.fields.date}</td>
                <td>S${parseFloat(record.fields.accountBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>S${parseFloat(record.fields.annualAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>S${parseFloat(record.fields.monthlyAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>S${(parseFloat(record.fields.accountBalance) + parseFloat(record.fields.annualAmount)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>{record.fields.tag}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditTag(record)}>Edit</Button>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleConfirmationShow(record)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableStyle>
      )}
      <Modal show={showConfirmation} onHide={handleConfirmationClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this record?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmationClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" value={editedTag} onChange={handleTagChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveTag}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Table;
