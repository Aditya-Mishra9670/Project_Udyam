import React, { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
import Home from "./home.jsx"
// Mapping technical field names to user-friendly labels
const fieldLabelMap = {
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
export default function DynamicUdyamForm() {
  const [formSchema, setFormSchema] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation patterns
  const patterns = {
    aadhaar: /^\d{12}$/, // 12 digits
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ // ABCDE1234F
  };

  // Fetch form schema from backend
  // Helper to reset form to initial state
  const resetForm = (schema) => {
    const initialData = {};
    schema.forEach((field) => {
      if (field.type === "checkbox") initialData[field.name] = false;
      else initialData[field.name] = "";
    });
    setFormData(initialData);
    setErrors({});
    setStep(1);
    setOtpSent(false);
    setOtpValue("");
  };

  useEffect(() => {
    fetch(`${apiUrl}/api/formfields`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load form schema");
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((field) => {
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
        resetForm(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching form schema:", err);
        setLoading(false);
      });
  }, []);

  // Step logic state
  const [step, setStep] = useState(1); // 1: Aadhaar, 2: OTP, 3: PAN
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");


  // Handle input changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validation for Aadhaar and PAN
    if (name === "ctl00$ContentPlaceHolder1$txtadharno") {
      setErrors((prev) => ({
        ...prev,
        [name]: patterns.aadhaar.test(value) ? "" : "Aadhaar must be 12 digits"
      }));
    }
    if (name === "ctl00$ContentPlaceHolder1$txtPan") {
      setErrors((prev) => ({
        ...prev,
        [name]: patterns.pan.test(value) ? "" : "Invalid PAN format"
      }));
    }
    if (name === "otp") {
      setOtpValue(value);
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
    // If pin changes, fetch city/state
    if (name === "ctl00$ContentPlaceHolder1$pin" && value.length === 6 && /^\d{6}$/.test(value)) {
      fetchCityStateAndSet(value);
    }
  };

  // Fetch city/state and update formData
  const fetchCityStateAndSet = async (pinCode) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
      const data = await res.json();
      if (data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          ["ctl00$ContentPlaceHolder1$city"]: postOffice.District,
          ["ctl00$ContentPlaceHolder1$state"]: postOffice.State
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          ["ctl00$ContentPlaceHolder1$city"]: "",
          ["ctl00$ContentPlaceHolder1$state"]: ""
        }));
      }
    } catch (err) {
      setFormData((prev) => ({
        ...prev,
        ["ctl00$ContentPlaceHolder1$city"]: "",
        ["ctl00$ContentPlaceHolder1$state"]: ""
      }));
      console.error("PIN fetch error:", err);
    }
  };


  // Step 1: Aadhaar submit
  const handleAadhaarSubmit = (e) => {
    e.preventDefault();
    const aadhaarKey = "ctl00$ContentPlaceHolder1$txtadharno";
    if (!patterns.aadhaar.test(formData[aadhaarKey])) {
      setErrors((prev) => ({ ...prev, [aadhaarKey]: "Aadhaar must be 12 digits" }));
      return;
    }
    setOtpSent(true);
    setStep(2);
  };

  // Step 2: OTP submit
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpValue === "123123") {
      setStep(3);
      setOtpSent(false);
    } else {
      setErrors((prev) => ({ ...prev, otp: "Invalid OTP. Use 123123 for testing." }));
    }
  };

  // Step 3: PAN + Details submit (integrated with backend)
  const handlePanSubmit = async (e) => {
    e.preventDefault();
    const step3FieldNames = [
      "ctl00$ContentPlaceHolder1$txtPan",
      "ctl00$ContentPlaceHolder1$txtPanName",
      "ctl00$ContentPlaceHolder1$txtdob",
      "ctl00$ContentPlaceHolder1$ddlTypeofOrg",
      "ctl00$ContentPlaceHolder1$rbpanyesno",
      "ctl00$ContentPlaceHolder1$rbdDOB",
      "ctl00$ContentPlaceHolder1$chkDecarationP",
      "ctl00$ContentPlaceHolder1$pin",
      "ctl00$ContentPlaceHolder1$city",
      "ctl00$ContentPlaceHolder1$state"
    ];
    let hasError = false;
    let newErrors = { ...errors };
    step3FieldNames.forEach((key) => {
      const field = formSchema.find(f => f.name === key);
      if (field && field.required && (!formData[key] || formData[key].toString().trim() === "")) {
        newErrors[key] = "Required";
        hasError = true;
      } else {
        newErrors[key] = "";
      }
      // PAN format validation
      if (key === "ctl00$ContentPlaceHolder1$txtPan" && formData[key] && !patterns.pan.test(formData[key])) {
        newErrors[key] = "Invalid PAN format";
        hasError = true;
      }
    });
    setErrors(newErrors);
    if (hasError) return;

    // Prepare payload for backend (map keys to backend expected keys)
    const payload = {
      name: formData["ctl00$ContentPlaceHolder1$txtownername"],
      aadhaar: formData["ctl00$ContentPlaceHolder1$txtadharno"],
      pan: formData["ctl00$ContentPlaceHolder1$txtPan"],
      pin: formData["ctl00$ContentPlaceHolder1$pin"],
      city: formData["ctl00$ContentPlaceHolder1$city"],
      state: formData["ctl00$ContentPlaceHolder1$state"]
      // Add more fields as needed for your backend
    };

    try {
      const res = await fetch(`${apiUrl}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (res.ok) {
        setShowSuccess(true);
        resetForm(formSchema);
        setTimeout(() => setShowSuccess(false), 2500);
      } else {
        alert(result.message || "Submission failed. Please check your data.");
      }
    } catch (err) {
      alert("Network or server error. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-lg font-semibold text-blue-600 animate-pulse">Loading form...</span>
      </div>
    );
  }

  // Success popup
  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl px-12 py-10 border-2 border-green-400 flex flex-col items-center">
          <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Success!</h2>
          <p className="text-green-600 text-lg">Form submitted and saved to database.</p>
        </div>
      </div>
    );
  }

  // Step 1: Aadhaar + Owner Name
  if (step === 1) {
    const aadhaarKey = "ctl00$ContentPlaceHolder1$txtadharno";
    const ownerNameKey = "ctl00$ContentPlaceHolder1$txtownername";
    const aadhaarField = formSchema.find(f => f.name === aadhaarKey);
    const ownerNameField = formSchema.find(f => f.name === ownerNameKey);
    // Only show if both fields exist, else fallback to Aadhaar only
    const step1Fields = [aadhaarField, ownerNameField].filter(Boolean);
    return (
      <Home
        formSchema={step1Fields}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleAadhaarSubmit}
        errors={errors}
        fieldLabelMap={fieldLabelMap}
        otpSent={false}
      />
    );
  }

  // Step 2: OTP
  if (step === 2) {
    const aadhaarKey = "ctl00$ContentPlaceHolder1$txtadharno";
    const aadhaarField = formSchema.find(f => f.name === aadhaarKey);
    return (
      <Home
        formSchema={aadhaarField ? [aadhaarField] : []}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleOtpSubmit}
        errors={errors}
        fieldLabelMap={fieldLabelMap}
        otpSent={true}
        otpValue={otpValue}
        setOtpValue={setOtpValue}
      />
    );
  }

  // Step 3: PAN + Details (show all relevant fields, only one DOB field)
  if (step === 3) {
    const step3FieldNames = [
      "ctl00$ContentPlaceHolder1$txtPan",
      "ctl00$ContentPlaceHolder1$txtPanName",
      // Only one DOB field:
      "ctl00$ContentPlaceHolder1$txtdob",
      "ctl00$ContentPlaceHolder1$ddlTypeofOrg",
      "ctl00$ContentPlaceHolder1$rbpanyesno",
      "ctl00$ContentPlaceHolder1$chkDecarationP",
      "ctl00$ContentPlaceHolder1$pin",
      "ctl00$ContentPlaceHolder1$city",
      "ctl00$ContentPlaceHolder1$state"
    ];
    const step3Fields = formSchema.filter(f => step3FieldNames.includes(f.name));
    // Add onBlur to pin field for city/state fetch
    const enhancedFields = step3Fields.map(f =>
      f.name === "ctl00$ContentPlaceHolder1$pin"
        ? { ...f, onBlur: () => fetchCityStateAndSet(formData["ctl00$ContentPlaceHolder1$pin"]) }
        : f
    );
    return (
      <Home
        formSchema={enhancedFields}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handlePanSubmit}
        errors={errors}
        fieldLabelMap={fieldLabelMap}
        otpSent={false}
      />
    );
  }
}
