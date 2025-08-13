import React, { useState, useEffect } from "react";
import Home from "./home.jsx"
export default function DynamicUdyamForm() {
  const [formSchema, setFormSchema] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Validation patterns
  const patterns = {
    aadhaar: /^\d{12}$/, // 12 digits
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ // ABCDE1234F
  };

  // Fetch form schema from backend
  useEffect(() => {
  fetch("http://localhost:5000/api/formfields", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load form schema");
        return res.json();
      })
      .then((data) => {
        // Map backend keys to expected keys for rendering
        const mapped = data.map((field) => {
          // Map elementType/fieldType to tag/type
          let tag = "input";
          let type = field.fieldType || "text";
          if (field.elementType === "input") {
            if (type === "textarea") tag = "textarea";
            else if (type === "select") tag = "select";
            else tag = "input";
          } else if (field.elementType) {
            tag = field.elementType;
          }
          return {
            name: field.fieldName || field.name || field.id,
            type,
            tag,
            label: field.label || field.placeholder || field.fieldName || field.name || field.id,
            placeholder: field.placeholder || "",
            required: field.required || false,
            options: field.options || [],
            ...field
          };
        });
        setFormSchema(mapped);
        // Initialize formData with empty values for each field
        const initialData = {};
        mapped.forEach((field) => {
          if (field.type === "checkbox") initialData[field.name] = false;
          else initialData[field.name] = "";
        });
        setFormData(initialData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching form schema:", err);
        setLoading(false);
      });
  }, []);

  // Handle input changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Apply field-specific validation
    if (name.toLowerCase().includes("aadhaar")) {
      setErrors((prev) => ({
        ...prev,
        [name]: patterns.aadhaar.test(value) ? "" : "Aadhaar must be 12 digits"
      }));
    }
    if (name.toLowerCase().includes("pan")) {
      setErrors((prev) => ({
        ...prev,
        [name]: patterns.pan.test(value) ? "" : "Invalid PAN format"
      }));
    }
  };

  // Map technical field names to user-friendly keys for submission
  const fieldKeyMap = {
    "ctl00$ContentPlaceHolder1$txtadharno": "Aadhaar Number",
    "ctl00$ContentPlaceHolder1$txtownername": "Owner Name",
    "ctl00$ContentPlaceHolder1$txtPan": "PAN Number",
    "ctl00$ContentPlaceHolder1$txtPanName": "Name as per PAN",
    "ctl00$ContentPlaceHolder1$txtdob": "Date of Birth",
    "ctl00$ContentPlaceHolder1$ddlTypeofOrg": "Type of Organisation",
    "ctl00$ContentPlaceHolder1$rbpanyesno": "Do you have PAN?",
    "ctl00$ContentPlaceHolder1$rbdDOB": "DOB Type",
    "ctl00$ContentPlaceHolder1$chkDecarationP": "PAN Declaration",
    "ctl00$ContentPlaceHolder1$pin": "PIN Code",
    "ctl00$ContentPlaceHolder1$city": "City",
    "ctl00$ContentPlaceHolder1$state": "State",
    // Add more mappings as needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map formData keys to user-friendly keys for submission
    const mappedData = {};
    Object.keys(formData).forEach((key) => {
      const friendlyKey = fieldKeyMap[key] || key;
      mappedData[friendlyKey] = formData[key];
    });
    console.log("Form Data:", mappedData);
    alert("Form submitted!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-lg font-semibold text-blue-600 animate-pulse">Loading form...</span>
      </div>
    );
  }

  return (
    <Home formSchema={formSchema} formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} errors={errors} />
  );
}
