import { useUser } from "@clerk/clerk-react";
import React, { createContext, useContext, useEffect, useState } from "react";

export const FinancialRecordsContext = createContext(undefined);

export const FinancialRecordsProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const { user } = useUser();

  const fetchRecords = async () => {
    if (!user) return;
    console.log("Fetching records for user:", user.id);
    const response = await fetch(
      `http://localhost:3001/financial-records/getAllByUserID/${user.id}`
    );

    if (response.ok) {
      const records = await response.json();
      console.log("Fetched records:", records);
      setRecords(records);
    } else {
      console.error("Failed to fetch records:", response.status);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record) => {
    console.log("Adding record:", record);
    const response = await fetch("http://localhost:3001/financial-records", {
      method: "POST",
      body: JSON.stringify(record),
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (response.ok) {
        const newRecord = await response.json();
        console.log("Added record:", newRecord);
        setRecords((prev) => [...prev, newRecord]);
      } else {
        console.error("Failed to add record:", response.status);
      }
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  const updateRecord = async (id, newRecordBody) => {
    const response = await fetch(
      `http://localhost:3001/financial-records/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(newRecordBody),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) =>
          prev.map((record) => {
            if (record._id === id) {
              return newRecord;
            } else {
              return record;
            }
          })
        );
      }
    } catch (err) {}
  };

  const deleteRecord = async (id) => {
    const response = await fetch(
      `http://localhost:3001/financial-records/${id}`,
      {
        method: "DELETE",
      }
    );

    try {
      if (response.ok) {
        const deletedRecord = await response.json();
        setRecords((prev) =>
          prev.filter((record) => record._id !== deletedRecord._id)
        );
      }
    } catch (err) {}
  };

  return (
    <FinancialRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);
  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }
  return context;
};
